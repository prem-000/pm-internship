from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from .database import connect_to_mongo, close_mongo_connection, get_database
from .recommender import recommender
from .routers import auth_router, user_router, recommendation_router, admin_router, interaction_router as feedback_router, internship_router
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from .utils.limiter import limiter

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Connect to DB
    connect_to_mongo()
    db = get_database()
    
    # Check if collection exists and has data
    if db is not None:
        count = db.internships.count_documents({})
        print(f"📡 Startup Check: {count} internships found in '{db.name}.internships'")
        
        # Load all internships and fit recommender
        internships = list(db.internships.find())
        recommender.fit(internships)
    else:
        print("❌ Startup Error: Database connection failed.")
    
    yield
    # Shutdown
    close_mongo_connection()

app = FastAPI(
    title="AI-Based Internship Recommendation Engine",
    description="Secure, Scalable Backend with TF-IDF Matching & Gemini Analysis",
    version="2.1.0",
    lifespan=lifespan
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal system error occurred. Our engineers have been notified."}
    )

# Include Routers with /api prefix
app.include_router(auth_router.router, prefix="/api")
app.include_router(user_router.router, prefix="/api")
app.include_router(recommendation_router.router, prefix="/api")
app.include_router(admin_router.router, prefix="/api")
app.include_router(feedback_router.router, prefix="/api")
app.include_router(internship_router.router, prefix="/api")

@app.get("/", tags=["Health"])
async def health_check():
    return {
        "status": "active",
        "system": "AI Internship Recommendation Engine",
        "version": "2.1.0"
    }

@app.get("/debug/internships-count", tags=["Debug"])
async def debug_internships():
    db = get_database()
    if db is None:
        return {"error": "Database not connected"}
        
    total = db.internships.count_documents({})
    # Try to get roles from 'role' field, or fallback to 'title' if 'role' doesn't exist
    roles = db.internships.distinct("role")
    titles = db.internships.distinct("title")
    
    return {
        "database_name": db.name,
        "total_internships": total,
        "distinct_roles": roles,
        "example_titles": titles[:10] if titles else []
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)