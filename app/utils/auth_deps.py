from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from .jwt_handler import decode_access_token
from ..database import get_database

from ..config import settings

security = HTTPBearer()


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = decode_access_token(token)
    
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    email: str = payload.get("sub")
    db = get_database()
    user = db.users.find_one({"email": email})
    
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.get("is_blocked"):
        raise HTTPException(status_code=403, detail="User is blocked")
        
    return user

def role_required(allowed_roles: list):
    async def dependency(current_user: dict = Depends(get_current_user)):
        if current_user.get("role") not in allowed_roles:
            raise HTTPException(
                status_code=403, 
                detail=f"Role {allowed_roles} required. You are {current_user.get('role')}"
            )
        return current_user
    return dependency
