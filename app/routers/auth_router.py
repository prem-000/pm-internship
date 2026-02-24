from fastapi import APIRouter, HTTPException, status
from ..models.schemas import UserRegister, Token
from ..database import get_database
from ..utils.hashing import get_password_hash, verify_password
from ..utils.jwt_handler import create_access_token
from datetime import datetime

router = APIRouter(prefix="/auth", tags=["Authentication"])

def validate_gmail(email: str) -> str:
    """
    Normalizes email and ensures it is a @gmail.com account.
    """
    email = email.lower().strip()
    if not email.endswith("@gmail.com"):
        raise HTTPException(
            status_code=400,
            detail="Only Gmail accounts are allowed"
        )
    return email

@router.post("/register")
async def register(user: UserRegister):
    db = get_database()
    
    # Enforce Gmail only validation
    email = validate_gmail(user.email)
    
    if db.users.find_one({"email": email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    user_dict = {
        "email": email,
        "hashed_password": hashed_password,
        "role": "user",
        "education": None,
        "skills": [],
        "preferred_sector": None,
        "preferred_location": None,
        "target_role": None,
        "warning_count": 0,
        "is_blocked": False,
        "created_at": datetime.utcnow()
    }
    
    db.users.insert_one(user_dict)

    return {"message": "User registered successfully"}

@router.post("/login", response_model=Token)
async def login(user_data: UserRegister):
    db = get_database()
    
    # Enforce Gmail only validation
    email = validate_gmail(user_data.email)
    
    user = db.users.find_one({"email": email})
    if not user or not verify_password(user_data.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if user.get("is_blocked"):
        raise HTTPException(status_code=403, detail="Account is blocked")
        
    access_token = create_access_token(data={"sub": user["email"], "role": user["role"]})
    return {"access_token": access_token, "token_type": "bearer"}
