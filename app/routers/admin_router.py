from fastapi import APIRouter, HTTPException, Body, Depends, Request, BackgroundTasks, WebSocket, WebSocketDisconnect
from ..utils.limiter import limiter
from ..database import get_database
from ..models.schemas import InternshipCreate, AdminLogin, LanguageSettingsUpdate
from ..recommender import recommender
from ..utils.auth_deps import verify_admin
from ..utils.jwt_handler import create_access_token
from ..config import settings
from bson import ObjectId
from datetime import datetime, timedelta
import asyncio
import json

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.post("/login")
@limiter.limit("5/minute")
async def admin_login(request: Request, credentials: AdminLogin):
    if credentials.email == settings.ADMIN_DEFAULT_EMAIL and credentials.password == settings.ADMIN_DEFAULT_PASSWORD:
        access_token = create_access_token(data={"sub": credentials.email, "role": "admin"})
        return {"access_token": access_token, "token_type": "bearer"}
    else:
        raise HTTPException(status_code=401, detail="Invalid admin credentials")

@router.get("/stats/users", dependencies=[Depends(verify_admin)])
async def get_user_stats():
    db = get_database()
    total = db.users.count_documents({})
    # Mocking trend for now, but in real app we'd compare with previous period
    return {
        "count": total,
        "trend": 12.5,
        "label": "Total Users"
    }

@router.get("/stats/internships", dependencies=[Depends(verify_admin)])
async def get_internship_stats():
    db = get_database()
    total = db.internships.count_documents({})
    return {
        "count": total,
        "trend": 5.2,
        "label": "Active Internships"
    }

@router.get("/stats/blocked", dependencies=[Depends(verify_admin)])
async def get_blocked_stats():
    db = get_database()
    total = db.users.count_documents({"is_blocked": True})
    return {
        "count": total,
        "trend": -2.1,
        "label": "Blocked Users"
    }

@router.get("/system/status", dependencies=[Depends(verify_admin)])
async def get_system_status():
    # Simulate system health
    return {
        "status": "Healthy",
        "uptime": "99.9%",
        "latency": "24ms",
        "alerts": 3
    }

@router.get("/stats", dependencies=[Depends(verify_admin)])
async def get_all_stats():
    db = get_database()
    return {
        "total_users": db.users.count_documents({}),
        "active_internships": db.internships.count_documents({}),
        "blocked_users": db.users.count_documents({"is_blocked": True}),
        "system_status": "Online",
        "trend": {
            "users": 12.5,
            "internships": 5.2,
            "blocked": -2.1
        }
    }

@router.get("/analytics", dependencies=[Depends(verify_admin)])
async def get_admin_analytics(range: str = "7d"):
    # Mock data based on range
    labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    if range == "24h":
        labels = ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"]
        data = [120, 150, 180, 240, 210, 190]
    elif range == "1m":
        labels = ["Week 1", "Week 2", "Week 3", "Week 4"]
        data = [1200, 1500, 1300, 1700]
    else:
        data = [45, 52, 38, 65, 48, 72, 58]
        
    return {
        "labels": labels,
        "datasets": [
            {
                "label": "System Load",
                "data": data
            }
        ]
    }

@router.get("/activity", dependencies=[Depends(verify_admin)])
async def get_activity_feed(limit: int = 10):
    # Simulated logs/activity
    activities = [
        {"type": "info", "message": "Admin login successful", "timestamp": str(datetime.utcnow()), "user": "admin@aire.com"},
        {"type": "warning", "message": "High latency detected in recommendation engine", "timestamp": str(datetime.utcnow()), "user": "System"},
        {"type": "critical", "message": "Database connection spike - 85% capacity", "timestamp": str(datetime.utcnow()), "user": "MongoDB"},
        {"type": "info", "message": "New internship post: Senior Frontend Engineer", "timestamp": str(datetime.utcnow()), "user": "Oracle"},
        {"type": "info", "message": "User ID 507f191e810c19729de860ea blocked", "timestamp": str(datetime.utcnow()), "user": "Admin"},
    ]
    return activities[:limit]

@router.get("/users", dependencies=[Depends(verify_admin)])
async def list_users(page: int = 1, search: str = ""):
    db = get_database()
    query = {}
    if search:
        query = {"$or": [
            {"email": {"$regex": search, "$options": "i"}},
            {"full_name": {"$regex": search, "$options": "i"}}
        ]}
    
    users = list(db.users.find(query, {"password": 0}).skip((page-1)*10).limit(10))
    for u in users:
        u["_id"] = str(u["_id"])
    return users

@router.get("/users/{user_id}", dependencies=[Depends(verify_admin)])
async def get_user_detail(user_id: str):
    db = get_database()
    user = db.users.find_one({"_id": ObjectId(user_id)}, {"password": 0})
    if user:
        user["_id"] = str(user["_id"])
        return user
    raise HTTPException(status_code=404, detail="User not found")

@router.patch("/users/{user_id}/block", dependencies=[Depends(verify_admin)])
async def block_user(user_id: str):
    db = get_database()
    db.users.update_one({"_id": ObjectId(user_id)}, {"$set": {"is_blocked": True}})
    return {"message": "User blocked"}

@router.patch("/users/{user_id}/unblock", dependencies=[Depends(verify_admin)])
async def unblock_user(user_id: str):
    db = get_database()
    db.users.update_one({"_id": ObjectId(user_id)}, {"$set": {"is_blocked": False}})
    return {"message": "User unblocked"}

@router.get("/internships", dependencies=[Depends(verify_admin)])
async def list_internships():
    db = get_database()
    internships = list(db.internships.find())
    for i in internships:
        i["_id"] = str(i["_id"])
    return internships

@router.post("/internships", dependencies=[Depends(verify_admin)])
async def create_internship(internship: InternshipCreate):
    db = get_database()
    new_internship = internship.model_dump()
    new_internship["created_at"] = datetime.utcnow()
    new_internship["is_active"] = True
    result = db.internships.insert_one(new_internship)
    return {"message": "Internship created", "id": str(result.inserted_id)}

@router.patch("/internships/{id}/status", dependencies=[Depends(verify_admin)])
async def update_internship_status(id: str, status: bool = Body(..., embed=True)):
    db = get_database()
    db.internships.update_one({"_id": ObjectId(id)}, {"$set": {"is_active": status}})
    return {"message": f"Internship {'activated' if status else 'deactivated'}"}

@router.delete("/internships/{id}", dependencies=[Depends(verify_admin)])
async def delete_internship(id: str):
    db = get_database()
    db.internships.delete_one({"_id": ObjectId(id)})
    return {"message": "Internship deleted"}

# --- New PRD v2.1 Analytics Endpoints ---

@router.get("/model-metrics", dependencies=[Depends(verify_admin)])
async def get_model_metrics():
    # Mock data for Evaluator impact
    return {
        "accuracy": 94.2,
        "precision": 91.8,
        "recall": 89.5,
        "f1": 90.6,
        "latency_ms": 124,
        "last_trained": str(datetime.utcnow() - timedelta(days=1))
    }

@router.get("/internships/trend", dependencies=[Depends(verify_admin)])
async def get_internship_trend(range: str = "30d"):
    # Simulated trend data
    labels = ["Week 1", "Week 2", "Week 3", "Week 4"]
    data = [15, 28, 22, 35]
    return {
        "labels": labels,
        "datasets": [{"label": "New Postings", "data": data}]
    }

@router.get("/skill-gap/heatmap", dependencies=[Depends(verify_admin)])
async def get_skill_gap_heatmap():
    # Grid color intensity mockup
    return [
        {"skill": "React", "demand": 85, "supply": 40},
        {"skill": "Python", "demand": 92, "supply": 65},
        {"skill": "Docker", "demand": 78, "supply": 30},
        {"skill": "Node.js", "demand": 70, "supply": 55},
        {"skill": "MongoDB", "demand": 65, "supply": 50},
    ]

@router.get("/model-performance", dependencies=[Depends(verify_admin)])
async def get_model_performance():
    return {
        "precision": 0.92,
        "recall": 0.88,
        "f1_score": 0.90,
        "auc": 0.94
    }

@router.get("/search", dependencies=[Depends(verify_admin)])
async def global_admin_search(q: str = ""):
    db = get_database()
    if not q: return {"users": [], "internships": []}
    
    users = list(db.users.find({"$or": [
        {"email": {"$regex": q, "$options": "i"}},
        {"full_name": {"$regex": q, "$options": "i"}}
    ]}, {"password": 0}).limit(5))
    
    internships = list(db.internships.find({"$or": [
        {"role": {"$regex": q, "$options": "i"}},
        {"company": {"$regex": q, "$options": "i"}}
    ]}).limit(5))
    
    for u in users: u["_id"] = str(u["_id"])
    for i in internships: i["_id"] = str(i["_id"])
    
    return {
        "users": users,
        "internships": internships
    }

@router.post("/model/retrain", dependencies=[Depends(verify_admin)])
async def retrain_model(background_tasks: BackgroundTasks):
    # Simulated retraining
    return {"message": "Retraining initiated", "eta_seconds": 300}

@router.get("/health", dependencies=[Depends(verify_admin)])
async def get_detailed_health():
    return {
        "backend": "Healthy",
        "ml_model": "Loaded (v2.1.0)",
        "db_latency": "14ms",
        "cache_latency": "2ms",
        "status": "online"
    }

@router.get("/settings/language", dependencies=[Depends(verify_admin)])
async def get_language_settings():
    db = get_database()
    settings = db.global_settings.find_one({"_id": "global_settings"})
    if not settings:
        default_settings = {
            "_id": "global_settings",
            "supported_languages": ["en", "hi", "ta"],
            "default_language": "en",
            "fallback_language": "en",
            "roadmap_language_mode": "match_user",
            "admin_selected_language": "en",
            "internship_content_mode": "english_only"
        }
        db.global_settings.insert_one(default_settings)
        return default_settings
    return settings

@router.put("/settings/language", dependencies=[Depends(verify_admin)])
async def update_language_settings(config: LanguageSettingsUpdate):
    db = get_database()
    update_data = {k: v for k, v in config.model_dump().items() if v is not None}
    db.global_settings.update_one(
        {"_id": "global_settings"},
        {"$set": update_data},
        upsert=True
    )
    return {"message": "Language settings updated successfully"}

@router.get("/analytics/languages", dependencies=[Depends(verify_admin)])
async def get_language_analytics():
    db = get_database()
    pipeline = [
        {"$group": {"_id": "$preferred_language", "count": {"$sum": 1}}},
        {"$project": {"language": "$_id", "count": 1, "_id": 0}}
    ]
    stats = list(db.users.aggregate(pipeline))
    return stats

@router.websocket("/ws/logs")
async def websocket_logs(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            import random
            # Determine if we send a log or a system event
            is_event = random.random() < 0.2
            
            if is_event:
                events = [
                    {"type": "INTERNSHIP_CREATED", "message": "New internship deployment detected: Software Engineer @ Meta", "priority": "medium"},
                    {"type": "MODEL_RETRAINED", "message": "ML Model v2.1.2 retraining complete. Accuracy: 94.2%", "priority": "high"},
                    {"type": "USER_FLAGGED", "message": "Suspicious activity detected from User ID: 507f... Isolating account.", "priority": "critical"},
                    {"type": "SYSTEM_ALERT", "message": "Backup synchronization successful across all regional clusters.", "priority": "low"}
                ]
                event = random.choice(events)
                await websocket.send_text(json.dumps({
                    "stream": "events",
                    "timestamp": str(datetime.utcnow()),
                    **event
                }))
            else:
                levels = ["INFO", "WARN", "ERROR"]
                messages = [
                    "User login attempt successful",
                    "Internship recommendation computed in 124ms",
                    "Model retraining pulse detected",
                    "Database backup initiated",
                    "New user registered: user@example.com",
                    "System health check: 100% operational",
                    "API Request: GET /admin/stats",
                    "High latency detected in vector search"
                ]
                log_entry = {
                    "stream": "logs",
                    "timestamp": str(datetime.utcnow()),
                    "level": random.choice(levels),
                    "message": random.choice(messages)
                }
                await websocket.send_text(json.dumps(log_entry))
            
            await asyncio.sleep(random.uniform(0.5, 3.0))
    except WebSocketDisconnect:
        print("Admin disconnected from command center")
