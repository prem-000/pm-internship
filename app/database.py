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

def close_mongo_connection():
    if db_instance.client:
        db_instance.client.close()
        print("🛑 MongoDB connection closed.")

def get_database():
    return db_instance.db