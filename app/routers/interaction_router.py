from fastapi import APIRouter, Depends, HTTPException
from ..database import get_database
from ..models.schemas import UserInteractionCreate
from ..utils.auth_deps import get_current_user
from datetime import datetime
from bson import ObjectId

router = APIRouter(prefix="/interactions", tags=["User Interactions"])

@router.post("/")
async def record_interaction(
    interaction: UserInteractionCreate, 
    current_user: dict = Depends(get_current_user)
):
    db = get_database()
    
    # Validate internship existence
    try:
        internship = db.internships.find_one({"_id": ObjectId(interaction.internship_id)})
        if not internship:
            raise HTTPException(status_code=404, detail="Internship not found")
    except:
        raise HTTPException(status_code=400, detail="Invalid internship_id format")

    # Prepare interaction log
    interaction_log = {
        "user_id": str(current_user["_id"]),
        "internship_id": interaction.internship_id,
        "action": interaction.action.lower(),
        "timestamp": datetime.utcnow(),
        "sector": internship.get("sector"),
        "skills_detected": internship.get("required_skills", [])
    }
    
    # Store in raw logs
    db.user_interactions.insert_one(interaction_log)
    
    # Trigger behavior aggregate update (simplified as direct update here for now)
    # In a larger system, this would be a background task
    update_behavior_profile(db, str(current_user["_id"]), interaction_log)
    
    return {"message": f"Interaction '{interaction.action}' recorded successfully."}

def update_behavior_profile(db, user_id: str, interaction: dict):
    action = interaction["action"]
    sector = interaction.get("sector")
    skills = interaction.get("skills_detected", [])
    
    update_query = {}
    
    if sector:
        # Increment sector preference count
        # Viewed: 1, Saved: 3, Applied: 5, Rejected: -4
        weight = 0
        if action == "viewed": weight = 1
        elif action == "saved": weight = 3
        elif action == "applied": weight = 5
        elif action == "rejected": weight = -4
        
        if weight != 0:
            update_query[f"preferred_sectors.{sector}"] = weight
            
    if skills:
        # Increment skill weights based on interaction
        # For simplicity, we use same weights as sectors
        skill_weight = 0
        if action == "viewed": skill_weight = 1
        elif action == "saved": skill_weight = 3
        elif action == "applied": skill_weight = 5
        elif action == "rejected": skill_weight = -2 # Less penalty for skills
        
        if skill_weight != 0:
            for skill in skills:
                update_query[f"preferred_skills.{skill}"] = skill_weight

    if update_query:
        db.user_behavior_profiles.update_one(
            {"user_id": user_id},
            {"$inc": update_query},
            upsert=True
        )
