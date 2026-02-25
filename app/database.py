from pymongo import MongoClient
from .config import settings

class Database:
    client: MongoClient = None
    db = None

db_instance = Database()

def connect_to_mongo():
    db_instance.client = MongoClient(settings.MONGODB_URI)
    # Trigger a ping to verify connection
    db_instance.client.admin.command('ping')
    db_instance.db = db_instance.client[settings.DATABASE_NAME]
    print(f"✅ Connected to MongoDB: {settings.DATABASE_NAME}")
    
    # Create Indexes
    db = db_instance.db
    db.user_feedback.create_index("user_id")
    db.user_feedback.create_index("internship_id")
    db.user_feedback.create_index("action")
    db.user_feedback.create_index("timestamp")
    
    db.user_behavior_profiles.create_index("user_id", unique=True)
    db.internships.create_index("sector")
    print("🚀 MongoDB Indexes initialized.")

def close_mongo_connection():
    if db_instance.client:
        db_instance.client.close()
        print("🛑 MongoDB connection closed.")

def get_database():
    return db_instance.db