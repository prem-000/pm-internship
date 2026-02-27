from fastapi import APIRouter, Depends, HTTPException
from ..recommender import recommender
from ..gemini_service import gemini_service
from ..database import get_database
from ..models.schemas import RecommendationResponse
from ..utils.auth_deps import get_current_user
from ..utils.profile_helper import calculate_profile_strength
from typing import List
from datetime import datetime

router = APIRouter(prefix="/recommend", tags=["Recommendations"])

@router.post("/")
async def get_recommendations(
    filters: dict = {}, 
    current_user: dict = Depends(get_current_user)
):
    user = current_user
    
    # Critical Profile Completeness Checks
    if not user.get("skills"):
        raise HTTPException(status_code=400, detail="Profile incomplete: skills missing.")

    if not user.get("target_role"):
        raise HTTPException(status_code=400, detail="Profile incomplete: target_role missing.")
    
    print(f"🚀 Processing recommendations for user: {user['email']} with filters: {filters}")
    
    recommendations = recommender.recommend(user, filters=filters)
    
    # Calculate Profile Strength (synchronized with user_router)
    profile_strength = calculate_profile_strength(user)

    # Prepare response in PRD format
    return {
        "recommendations": recommendations if recommendations is not None else [],
        "gap_analysis": {
            "missing_skills": user.get("missing_skills") or [],
            "impact_scores": {}
        },
        "profile_strength": profile_strength,
        "semantic_alignment": 88, # Simulated
        "behavior_boost": 12      # Simulated
    }

