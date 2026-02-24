from fastapi import APIRouter, HTTPException, Depends
from ..database import get_database
from ..models.schemas import ProfileUpdate
from ..utils.auth_deps import get_current_user
from ..gemini_service import gemini_service
from datetime import datetime

router = APIRouter(prefix="/user", tags=["User"])

@router.get("/me")
async def get_user_me(current_user: dict = Depends(get_current_user)):
    user = current_user
    user["_id"] = str(user["_id"])
    user.pop("hashed_password", None)
    return user

@router.put("/profile")
async def update_profile(
    profile_data: ProfileUpdate, 
    current_user: dict = Depends(get_current_user)
):
    db = get_database()
    
    # Normalize skills to lowercase
    normalized_skills = [skill.lower().strip() for skill in profile_data.skills]
    
    # AI Misuse Detection (Step 2: Profile Update)
    profile_dict = profile_data.dict()
    profile_dict['skills'] = normalized_skills
    profile_dict['target_role'] = profile_dict['target_role'].lower().strip()
    
    misuse_check = await gemini_service.detect_profile_misuse(profile_dict)
    
    update_data = {
        "education": profile_data.education.lower().strip(),
        "skills": normalized_skills,
        "preferred_sector": profile_data.preferred_sector.lower().strip(),
        "preferred_location": profile_data.preferred_location.lower().strip(),
        "target_role": profile_dict['target_role']
    }
    
    if misuse_check["severity_score"] > 0.75:
        # Increase warning count or block if necessary
        db.users.update_one(
            {"email": current_user["email"]}, 
            {"$inc": {"warning_count": 1}}
        )
        db.misuse_reports.insert_one({
            "user_id": str(current_user["_id"]),
            "severity_score": misuse_check["severity_score"],
            "analysis": misuse_check["explanation"],
            "flagged": True,
            "timestamp": datetime.utcnow()
        })

    db.users.update_one(
        {"email": current_user["email"]}, 
        {"$set": update_data}
    )
    
    return {"message": "Profile updated successfully", "misuse_flagged": misuse_check["severity_score"] > 0.75}
