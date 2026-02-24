from fastapi import APIRouter, HTTPException, Body, Depends, Request, BackgroundTasks
from ..utils.limiter import limiter
from ..database import get_database
from ..models.schemas import InternshipCreate, AdminLogin
from ..recommender import recommender
from ..utils.auth_deps import verify_admin
from ..utils.jwt_handler import create_access_token
from ..config import settings
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.post("/login")
@limiter.limit("5/minute")
async def admin_login(request: Request, credentials: AdminLogin):
    if credentials.email == settings.ADMIN_DEFAULT_EMAIL and credentials.password == settings.ADMIN_DEFAULT_PASSWORD:
        access_token = create_access_token(data={"sub": credentials.email})
        return {"access_token": access_token, "token_type": "bearer"}
    else:
        raise HTTPException(status_code=401, detail="Invalid admin credentials")

def refresh_recommender():
    db = get_database()
    all_internships = list(db.internships.find())
    recommender.fit(all_internships)

@router.post("/add-internship", dependencies=[Depends(verify_admin)])
async def add_internship(internship: InternshipCreate, background_tasks: BackgroundTasks):
    db = get_database()
    internship_dict = internship.dict()
    internship_dict["created_at"] = datetime.utcnow()
    result = db.internships.insert_one(internship_dict)
    
    # Refresh recommender after adding new data in the background
    background_tasks.add_task(refresh_recommender)
    
    return {"message": "Internship added. Recommender refresh triggered.", "id": str(result.inserted_id)}

@router.get("/dashboard", dependencies=[Depends(verify_admin)])
@router.get("/stats")
async def get_stats():
    db = get_database()
    user_count = db.users.count_documents({})
    internship_count = db.internships.count_documents({})
    misuse_count = db.misuse_reports.count_documents({})
    
    return {
        "total_users": user_count,
        "total_internships": internship_count,
        "flagged_profiles": misuse_count
    }

@router.get("/internships", dependencies=[Depends(verify_admin)])
async def list_internships():
    db = get_database()
    internships = list(db.internships.find())
    for i in internships:
        i["_id"] = str(i["_id"])
    return internships

@router.get("/users", dependencies=[Depends(verify_admin)])
async def list_users():
    db = get_database()
    users = list(db.users.find({}, {"password": 0}))
    for u in users:
        u["_id"] = str(u["_id"])
    return users

@router.get("/analytics", dependencies=[Depends(verify_admin)])
async def get_analytics():
    # Placeholder for analytics logic
    return {"message": "Analytics endpoint"}

@router.post("/block-user/{user_id}", dependencies=[Depends(verify_admin)])
async def block_user(user_id: str):
    db = get_database()
    db.users.update_one({"_id": ObjectId(user_id)}, {"$set": {"is_blocked": True}})
    return {"message": "User blocked"}
