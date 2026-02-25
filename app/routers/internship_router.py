from fastapi import APIRouter, Depends, HTTPException
from ..database import get_database
from ..recommender import recommender
from ..gemini_service import gemini_service
from ..utils.auth_deps import get_current_user
from ..utils.scoring import calculate_location_match, calculate_sector_match
from bson import ObjectId
from sklearn.metrics.pairwise import cosine_similarity

router = APIRouter(prefix="/internship", tags=["Internships"])

@router.get("/{internship_id}/gap-analysis")
async def get_gap_analysis(
    internship_id: str, 
    current_user: dict = Depends(get_current_user)
):
    db = get_database()
    
    # 1. Fetch Internship
    try:
        internship = db.internships.find_one({"_id": ObjectId(internship_id)})
        if not internship:
            # Try finding by string if it's not a valid ObjectId (fallback)
            internship = db.internships.find_one({"internship_id": internship_id})
            
        if not internship:
            raise HTTPException(status_code=404, detail="Internship not found")
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid internship_id format")

    # 2. Recalculate Scores for this specific internship
    user_profile = current_user
    user_skills = user_profile.get('skills', [])
    target_role = str(user_profile.get('target_role', '')).lower().strip()
    preferred_sector = str(user_profile.get('preferred_sector', '')).lower().strip()
    preferred_location = str(user_profile.get('preferred_location', '')).lower().strip()

    # Re-run scoring logic (standardized with recommender.py)
    skill_match_pct, matched, missing = recommender.calculate_skill_match(user_skills, internship.get('required_skills', []))
    
    # Semantic score
    user_text = target_role + " " + " ".join(user_skills)
    user_vector = recommender.tfidf_vectorizer.transform([user_text])
    
    # Synthesize internship text if needed
    intern_text = f"{internship.get('title', '')} {internship.get('sector', '')} {' '.join(internship.get('required_skills', []))}"
    intern_vector = recommender.tfidf_vectorizer.transform([intern_text])
    
    semantic_score = float(cosine_similarity(user_vector, intern_vector).flatten()[0])
    sector_score = calculate_sector_match(preferred_sector, internship.get('sector'))
    location_score = calculate_location_match(preferred_location, internship.get('location'))

    base_score = (
        0.5 * skill_match_pct +
        0.3 * semantic_score +
        0.1 * sector_score +
        0.1 * location_score
    ) * 100

    # Feedback Boost
    behavior_profile = recommender.get_user_behavior_profile(str(user_profile["_id"]))
    feedback_boost = recommender.calculate_feedback_boost(internship, behavior_profile)
    
    overall_score = base_score + feedback_boost

    # 3. Enhanced Gap Analysis Logic
    # We want impact scores per skill as requested by PRD
    missing_skills_data = []
    total_req = len(internship.get('required_skills', []))
    
    # Each missing skill contributes to 50% / total_req of the score
    impact_per_skill = round((0.5 * (1.0 / total_req) * 100), 1) if total_req > 0 else 0
    
    for skill in missing:
        missing_skills_data.append({
            "name": skill,
            "current_level": 1, # Beginner
            "target_level": 4,  # Advanced
            "impact_score": impact_per_skill,
            "current_progress_percent": 30 + (hash(skill) % 20), # Simulated semi-random
            "target_progress_percent": 85 + (hash(skill) % 10)
        })

    # Projected score if all missing skills are completed (skill_match becomes 1.0)
    projected_base = (0.5 * 1.0 + 0.3 * semantic_score + 0.1 * sector_score + 0.1 * location_score) * 100
    projected_total = round(projected_base + feedback_boost, 2)

    # 4. Gemini Roadmap
    roadmap = await gemini_service.get_structured_roadmap(internship.get('title'), missing)

    return {
        "internship": {
            "id": internship_id,
            "title": internship.get('title'),
            "company": internship.get('company') or internship.get('organization') or "AIRE Partner",
            "overall_score": round(overall_score, 2),
            "skill_match": round(skill_match_pct * 100, 2),
            "semantic_fit": round(semantic_score * 100, 2),
            "behavior_boost": round(feedback_boost, 2)
        },
        "gap_analysis": {
            "missing_skills": missing_skills_data,
            "projected_score_if_completed": projected_total
        },
        "gemini_roadmap": roadmap
    }
