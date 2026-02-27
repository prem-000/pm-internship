
from fastapi import APIRouter, Depends, HTTPException
from ..database import get_database
from ..utils.auth_deps import get_current_user
from typing import List, Dict
from datetime import datetime, timedelta

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/match-trend")
async def get_match_trend(
    range: str = "6months", 
    current_user: dict = Depends(get_current_user)
):
    db = get_database()
    user_id = str(current_user["_id"])
    
    # Fetch from match_scores
    trend_docs = list(db.match_scores.find({"user_id": user_id}).sort("created_at", 1))
    
    if not trend_docs:
        # Provide some fallback/default data if empty
        return {
            "trend": [
                {"month": "Jan", "score": 60},
                {"month": "Feb", "score": 62},
                {"month": "Mar", "score": 65}
            ],
            "growth_percentage": 5.0
        }
    
    trend = []
    for doc in trend_docs:
        trend.append({
            "month": doc.get("month"),
            "score": doc.get("match_percentage")
        })
        
    # Calculate growth percentage (simplified: last vs first)
    if len(trend) > 1:
        first = trend[0]["score"]
        last = trend[-1]["score"]
        growth = round(((last - first) / first) * 100, 1) if first > 0 else 0
    else:
        growth = 0
        
    return {
        "trend": trend,
        "growth_percentage": growth
    }

@router.get("/sector-distribution")
async def get_sector_distribution(current_user: dict = Depends(get_current_user)):
    db = get_database()
    user_id = str(current_user["_id"])
    
    # Aggregate from user_feedback where action is 'applied' or 'saved'
    pipeline = [
        {"$match": {"user_id": user_id, "action": {"$in": ["applied", "saved", "viewed"]}}},
        {"$group": {"_id": "$sector", "count": {"$sum": 1}}}
    ]
    
    results = list(db.user_feedback.aggregate(pipeline))
    
    if not results:
        return {
            "total_match": 0,
            "sectors": []
        }
    
    total_actions = sum(r["count"] for r in results)
    sectors = []
    for r in results:
        if r["_id"]: # Skip None
            sectors.append({
                "name": r["_id"],
                "percentage": round((r["count"] / total_actions) * 100)
            })
            
    # Sort sectors by percentage
    sectors.sort(key=lambda x: x["percentage"], reverse=True)
    
    return {
        "total_match": 82, # Simulated high match logic from PRD
        "sectors": sectors[:3] # Top 3
    }

@router.get("/behavioral-heatmap")
async def get_behavioral_heatmap(current_user: dict = Depends(get_current_user)):
    db = get_database()
    user_id = str(current_user["_id"])
    
    # Need to count applied vs viewed per sector
    pipeline = [
        {"$match": {"user_id": user_id, "action": {"$in": ["applied", "viewed"]}}},
        {"$group": {
            "_id": "$sector",
            "applied": {"$sum": {"$cond": [{"$eq": ["$action", "applied"]}, 1, 0]}},
            "viewed": {"$sum": {"$cond": [{"$eq": ["$action", "viewed"]}, 1, 0]}}
        }}
    ]
    
    results = list(db.user_feedback.aggregate(pipeline))
    
    heatmap = []
    for r in results:
        if r["_id"]:
            heatmap.append({
                "sector": r["_id"],
                "applied": r["applied"],
                "viewed": r["viewed"]
            })
            
    return heatmap

@router.get("/skill-timeline")
async def get_skill_timeline(current_user: dict = Depends(get_current_user)):
    db = get_database()
    user_id = str(current_user["_id"])
    
    skills = list(db.skills.find({"user_id": user_id}).sort("acquired_date", -1))
    
    timeline = []
    for skill in skills:
        timeline.append({
            "month": skill["acquired_date"].strftime("%B %Y"),
            "skill": skill["skill_name"],
            "description": skill.get("description", ""),
            "status": "verified" if skill.get("verified") else "pending"
        })
        
    return timeline
