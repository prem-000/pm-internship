from fastapi import APIRouter, HTTPException, Depends
from ..database import get_database
from ..models.schemas import ProfileUpdateRequest, LanguageUpdateRequest
from ..utils.auth_deps import get_current_user
from ..utils.profile_helper import calculate_profile_strength
from datetime import datetime

router = APIRouter(prefix="/user", tags=["User"])

@router.get("/profile")
async def get_profile(current_user: dict = Depends(get_current_user)):
    user = current_user
    user["_id"] = str(user["_id"])
    user.pop("hashed_password", None)
    
    # Calculate Profile Strength
    profile_strength = calculate_profile_strength(user)

    return {
        "full_name": user.get("full_name") or "",
        "bio": user.get("bio") or "",
        "skills": user.get("skills") or [],
        "target_roles": user.get("target_roles") or ([user.get("target_role")] if user.get("target_role") else []),
        "sector_preference": user.get("preferred_sector") or "",
        "location_preference": user.get("preferred_location") or "remote",
        "preferred_language": user.get("preferred_language") or "en",
        "university": user.get("university") or "",
        "graduation_year": user.get("graduation_year"),
        "education": user.get("education") or "",
        "linkedin_url": user.get("linkedin_url"),
        "github_url": user.get("github_url"),
        "portfolio_url": user.get("portfolio_url"),
        "profile_strength": profile_strength,
        "semantic_alignment": 85, 
        "last_updated": user.get("updated_at", user.get("created_at"))
    }

@router.get("/me")
async def get_my_info(current_user: dict = Depends(get_current_user)):
    user = current_user
    return {
        "id": str(user["_id"]),
        "full_name": user.get("full_name") or user.get("name") or "User",
        "email": user.get("email"),
        "role": user.get("role", "Student"),
        "department": user.get("university") or user.get("education") or "N/A",
        "member_since": (user.get("created_at") or datetime.utcnow()).strftime("%Y-%m-%d"),
        "plan": "Free"
    }

@router.put("/profile/update")
async def update_profile(
    profile_update: ProfileUpdateRequest, 
    current_user: dict = Depends(get_current_user)
):
    db = get_database()
    
    # Partial Update Logic with exclude_unset to avoid overwriting with None
    update_data = {
        k: v
        for k, v in profile_update.dict(exclude_unset=True).items()
    }
    
    # Extra processing for URLs to ensure they are strings and handle empty values
    for url_field in ["linkedin_url", "github_url", "portfolio_url"]:
        if url_field in update_data:
            val = update_data[url_field]
            if val is None or (isinstance(val, str) and val.strip() == ""):
                update_data[url_field] = None
            else:
                update_data[url_field] = str(val)

    # Recommender compatibility: Sync target_role if target_roles is updated
    if "target_roles" in update_data and update_data["target_roles"]:
        update_data["target_role"] = update_data["target_roles"][0]

    if update_data:
        update_data["updated_at"] = datetime.utcnow()
        db.users.update_one(
            {"email": current_user["email"]}, 
            {"$set": update_data}
        )
    
    # Re-fetch updated user for strength calculation
    user = db.users.find_one({"email": current_user["email"]})
    profile_strength = calculate_profile_strength(user)
    
    # Prepare response including all fields
    updated_profile = {
        "full_name": user.get("full_name"),
        "bio": user.get("bio"),
        "university": user.get("university"),
        "graduation_year": user.get("graduation_year"),
        "education": user.get("education"),
        "skills": user.get("skills", []),
        "target_roles": user.get("target_roles", []),
        "sector_preference": user.get("preferred_sector", ""),
        "location_preference": user.get("preferred_location", "remote"),
        "preferred_language": user.get("preferred_language", "en"),
        "linkedin_url": str(user.get("linkedin_url")) if user.get("linkedin_url") else None,
        "github_url": str(user.get("github_url")) if user.get("github_url") else None,
        "portfolio_url": str(user.get("portfolio_url")) if user.get("portfolio_url") else None,
        "profile_strength": profile_strength,
        "last_updated": user.get("updated_at")
    }

    return {
        "message": "Profile updated successfully", 
        "profile": updated_profile
    }

@router.put("/update-language")
async def update_language(
    lang_data: LanguageUpdateRequest,
    current_user: dict = Depends(get_current_user)
):
    db = get_database()
    db.users.update_one(
        {"email": current_user["email"]},
        {"$set": {"preferred_language": lang_data.preferred_language, "updated_at": datetime.utcnow()}}
    )
    return {"message": "Language preference updated", "preferred_language": lang_data.preferred_language}
