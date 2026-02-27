
from app.database import connect_to_mongo, get_database
from datetime import datetime, timedelta
import random

def seed_analytics_data():
    connect_to_mongo()
    db = get_database()
    
    # Target all users
    users = list(db.users.find({}))
    if not users:
        print("No users found. Please register first.")
        return
    
    for test_user in users:
        print(f"Seeding data for user: {test_user['email']}")
        user_id = str(test_user["_id"])
        
        # 1. Seed Match Scores (for trend)
        db.match_scores.delete_many({"user_id": user_id})
        months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
        scores = [64, 68, 71, 69, 78, 82]
        
        for i, month in enumerate(months):
            db.match_scores.insert_one({
                "user_id": user_id,
                "month": month,
                "year": 2024,
                "match_percentage": scores[i],
                "created_at": datetime.utcnow() - timedelta(days=(5-i)*30)
            })
        print("✅ Seeded match_scores")

        # 2. Seed Skills (for timeline)
        db.skills.delete_many({"user_id": user_id})
        skills_data = [
            {"skill_name": "UI/UX Component Design", "description": "Core foundational skill verified by AIRE automated portfolio scan.", "acquired_date": datetime(2024, 1, 15), "verified": True},
            {"skill_name": "Product Strategy (FinTech)", "description": "Recognized for project leadership in high-growth startup.", "acquired_date": datetime(2024, 2, 20), "verified": True},
            {"skill_name": "Advanced Python for Data Science", "description": "Skill validation completed via technical assessment.", "acquired_date": datetime(2024, 4, 10), "verified": True},
            {"skill_name": "Generative AI Prompt Engineering", "description": "Acquired via AIRE Labs advanced certification program.", "acquired_date": datetime(2024, 6, 5), "verified": True}
        ]
        for skill in skills_data:
            skill["user_id"] = user_id
            db.skills.insert_one(skill)
        print("✅ Seeded skills timeline")

        # 3. Seed Feedback (for heatmap and distribution)
        # Clear some old feedback to make it look "relevant"
        db.user_feedback.delete_many({"user_id": user_id})
        sectors = ["FinTech", "SaaS", "HealthTech", "Web3 / Crypto"]
        actions = ["viewed", "applied", "saved"]
        
        # Add random interactions
        for _ in range(50):
            sector = random.choice(sectors)
            action = random.choices(actions, weights=[0.6, 0.3, 0.1])[0]
            db.user_feedback.insert_one({
                "user_id": user_id,
                "action": action,
                "sector": sector,
                "timestamp": datetime.utcnow() - timedelta(days=random.randint(0, 180))
            })
        print("✅ Seeded feedback for heatmap")
        print(f"✅ Seeding fully completed for {test_user['email']}")

if __name__ == "__main__":
    seed_analytics_data()
