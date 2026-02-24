from fastapi import APIRouter, Depends, HTTPException
from ..recommender import recommender
from ..gemini_service import gemini_service
from ..database import get_database
from ..models.schemas import RecommendationResponse
from ..utils.auth_deps import get_current_user
from typing import List
from datetime import datetime

router = APIRouter(prefix="/recommend", tags=["Recommendations"])

@router.post("/", response_model=List[RecommendationResponse])
async def get_recommendations(current_user: dict = Depends(get_current_user)):
    user = current_user
    
    # Critical Profile Completeness Checks
    if not user.get("skills"):
        raise HTTPException(status_code=400, detail="Profile incomplete: skills missing. Please update your profile in Step 2.")

    if not user.get("target_role"):
        raise HTTPException(status_code=400, detail="Profile incomplete: target_role missing. Please update your profile in Step 2.")
    
    print(f"🚀 Processing recommendations for user: {user['email']}")
    
    recommendations = recommender.recommend(user)
    
    if not recommendations:
        print(f"⚠️ No recommendations found for user: {user['email']}")
        return []

    db = get_database()
    final_recommendations = []
    
    # Add Gemini Advisory for Top recommendations
    for rec in recommendations:
        # Generate roadmap using Gemini with fallback
        roadmap = await gemini_service.get_learning_roadmap(rec["title"], rec["match_details"]["missing_skills"])
        rec["learning_roadmap"] = roadmap
            
        final_recommendations.append(RecommendationResponse(**rec))
        
        # Log recommendation
        db.recommendation_logs.insert_one({
            "user_id": str(user["_id"]),
            "internship_id": rec["internship_id"],
            "score": rec["score"],
            "timestamp": datetime.utcnow()
        })

    print(f"✅ Returned {len(final_recommendations)} recommendations.")
    return final_recommendations
