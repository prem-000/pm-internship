from fastapi import APIRouter, Depends, HTTPException
from ..database import get_database
from ..models.schemas import UserFeedbackCreate
from ..utils.auth_deps import get_current_user
from datetime import datetime
from bson import ObjectId

router = APIRouter(tags=["User Behavior & Feedback"])

@router.get("/behavior/profile")
async def get_behavior_profile(current_user: dict = Depends(get_current_user)):
    db = get_database()
    profile = db.user_behavior_profiles.find_one({"user_id": str(current_user["_id"])})
    
    if not profile:
        return {
            "total_boost": 0,
            "breakdown": {
                "initiative": 0,
                "communication": 0,
                "critical_thinking": 0
            }
        }
    
    boosts = profile.get("feedback_boosts", {})
    total_boost = sum(boosts.values()) if boosts else 0
    
    return {
        "total_boost": min(total_boost, 20), # Cap at 20
        "breakdown": {
            "initiative": 5 if total_boost > 10 else 2,
            "communication": 4 if total_boost > 15 else 1,
            "critical_thinking": 3 if total_boost > 5 else 0
        }
    }

@router.post("/feedback/")


async def record_feedback(
    feedback: UserFeedbackCreate, 
    current_user: dict = Depends(get_current_user)
):
    db = get_database()
    
    # Validate internship existence
    try:
        internship = db.internships.find_one({"_id": ObjectId(feedback.internship_id)})
        if not internship:
            raise HTTPException(status_code=404, detail="Internship not found")
    except:
        raise HTTPException(status_code=400, detail="Invalid internship_id format")

    # Prepare feedback log
    feedback_log = {
        "user_id": str(current_user["_id"]),
        "internship_id": feedback.internship_id,
        "action": feedback.action.lower(),
        "timestamp": datetime.utcnow(),
        "sector": internship.get("sector"),
        "skills_detected": internship.get("required_skills", [])
    }
    
    # Store in user_feedback collection
    db.user_feedback.insert_one(feedback_log)
    
    # Update behavior profile for scoring boosts
    update_feedback_profile(db, str(current_user["_id"]), feedback_log)
    
    return {"message": f"Feedback '{feedback.action}' recorded successfully."}

def update_feedback_profile(db, user_id: str, feedback: dict):
    action = feedback["action"]
    sector = feedback.get("sector")
    
    update_query = {}
    
    if sector:
        # Boost logic: applied (+15), saved (+10), viewed (+5), rejected (-10)
        weight = 0
        if action == "applied": weight = 15
        elif action == "saved": weight = 10
        elif action == "viewed": weight = 5
        elif action == "rejected": weight = -10
        
        if weight != 0:
            update_query[f"feedback_boosts.{sector}"] = weight

    if update_query:
        db.user_behavior_profiles.update_one(
            {"user_id": user_id},
            {"$inc": update_query},
            upsert=True
        )

@router.post("/behavior/reset")
async def reset_behavior(current_user: dict = Depends(get_current_user)):
    db = get_database()
    db.user_behavior_profiles.delete_one({"user_id": str(current_user["_id"])})
    return {
        "status": "success",
        "message": "Behavioral weights reset to default"
    }

@router.delete("/feedback/clear")
async def clear_feedback(current_user: dict = Depends(get_current_user)):
    db = get_database()
    user_id = str(current_user["_id"])
    
    # Delete from feedback history
    db.user_feedback.delete_many({"user_id": user_id})
    
    # Reset behavior profile as well since it's derived from feedback
    db.user_behavior_profiles.delete_one({"user_id": user_id})
    
    return {
        "status": "success",
        "message": "Feedback history cleared"
    }
