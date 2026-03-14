from fastapi import APIRouter, Depends, HTTPException
from ..recommender import recommender
from ..services.skill_gap_service import skill_gap_service
from ..gemini_service import gemini_service
from ..database import get_database
from ..utils.auth_deps import get_current_user
from ..utils.profile_helper import calculate_profile_strength
from typing import List
import asyncio
from bson import ObjectId

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

    # Check for target_role OR target_roles
    target_role = user.get("target_role")
    if not target_role and user.get("target_roles"):
        target_role = user.get("target_roles")[0]
        
    if not target_role:
        raise HTTPException(status_code=400, detail="Profile incomplete: target roles missing.")
    
    # Re-assign for recommender consistency
    user["target_role"] = target_role

    print(f"🚀 Processing recommendations for user: {user['email']} with filters: {filters}")
    
    recommendations = recommender.recommend(user, filters=filters)
    
    # For the top 5 recommendations, ensure we have skills via Gemini if missing
    # (Restricted to top 5 to respect the < 3s performance target)
    top_recommendations = recommendations[:5]
    
    async def enrich_rec(rec):
        # internship_data inside rec already exists
        # If required_skills is empty, extract using Gemini
        # Note: In a production app, we would cache this in the DB.
        required_skills = rec.get("match_details", {}).get("matched_skills", []) + \
                        rec.get("match_details", {}).get("missing_skills", [])
        
        # If we have very few skills, try to enrich from description
        if len(required_skills) < 3:
            # We need the full description here, but recommender only returns a summary
            # We'll mock the extraction or assume we can fetch it if needed.
            # For now, we'll use the existing match_details.
            pass

        return {
            "internship": {
                "internship_id": rec["internship_id"],
                "title": rec["title"],
                "company": rec["company"],
                "location": rec["location"],
                "apply_url": rec["apply_url"],
                "required_skills": required_skills
            },
            "user_skills": user.get("skills", []),
            "missing_skills": {
                "skills": rec["match_details"]["missing_skills"]
            },
            "score": rec["score"],
            "gap_analysis": rec["gap_analysis"],
            # Keep legacy fields for frontend compatibility
            "internship_id": rec["internship_id"],
            "title": rec["title"],
            "organization": rec["company"],
            "company": rec["company"],
            "location": rec["location"],
            "apply_url": rec["apply_url"],
            "match_details": rec["match_details"]
        }

    # Process enrichments
    final_recommendations = await asyncio.gather(*[enrich_rec(r) for r in recommendations])
    
    # Calculate Profile Strength
    profile_strength = calculate_profile_strength(user)

    return {
        "recommendations": final_recommendations,
        "profile_strength": profile_strength,
        "total_matches": len(final_recommendations)
    }

@router.get("/{internship_id}/skill-gap")
async def get_internship_skill_gap(
    internship_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Retrieves missing skills and a Gemini-generated explanation for a specific internship.
    """
    db = get_database()

    # 1. Fetch Internship Data
    try:
        internship = db.internships.find_one({"_id": ObjectId(internship_id)})
    except:
        internship = db.internships.find_one({"internship_id": internship_id})
        
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")

    # 2. Extract required skills (handle list or summary)
    required_skills = internship.get("required_skills")
    if not required_skills:
        # If no skills stored, try to extract from description
        description = internship.get("description", "")
        required_skills = await gemini_service.extract_skills_from_description(description)
        # Cache back to DB for efficiency if description was present
        if required_skills and description:
            db.internships.update_one({"_id": internship["_id"]}, {"$set": {"required_skills": required_skills}})

    # 3. Fetch User Skills
    user_skills = current_user.get("skills", [])

    # 4. Compute Missing Skills
    missing_skills_list = skill_gap_service.calculate_missing_skills(user_skills, required_skills)

    # 5. Generate Gemini Explanation
    explanation = await skill_gap_service.generate_gemini_explanation(
        internship.get("title", "this position"),
        missing_skills_list
    )

    return {
        "internship": {
            "id": internship_id,
            "title": internship.get("title")
        },
        "user_skills": user_skills,
        "missing_skills": {
            "skills": missing_skills_list
        },
        "explanation": {
            "gemini_text": explanation
        }
    }

