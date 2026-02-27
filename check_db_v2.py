
import asyncio
from app.config import settings
from pymongo import MongoClient

def check_db():
    print(f"Connecting to: {settings.MONGODB_URI}")
    client = MongoClient(settings.MONGODB_URI)
    db = client[settings.DATABASE_NAME]
    
    print(f"Checking database: {db.name}")
    
    internships_count = db.internships.count_documents({})
    print(f"Internships count: {internships_count}")
    
    if internships_count > 0:
        sample = db.internships.find_one()
        print(f"Sample internship: {sample}")
    
    users_count = db.users.count_documents({})
    print(f"Users count: {users_count}")
    
    if users_count > 0:
        sample_user = db.users.find_one()
        print(f"Sample user: {sample_user}")

if __name__ == "__main__":
    check_db()
