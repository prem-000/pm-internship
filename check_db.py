
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

async def check_db():
    mongo_uri = os.getenv("MONGO_URI")
    if not mongo_uri:
        print("MONGO_URI not found in environment")
        return
    
    client = AsyncIOMotorClient(mongo_uri)
    db = client.get_database()
    
    print(f"Checking database: {db.name}")
    
    internships_count = await db.internships.count_documents({})
    print(f"Internships count: {internships_count}")
    
    if internships_count > 0:
        sample = await db.internships.find_one()
        print(f"Sample internship: {sample}")
    
    users_count = await db.users.count_documents({})
    print(f"Users count: {users_count}")
    
    if users_count > 0:
        sample_user = await db.users.find_one()
        print(f"Sample user: {sample_user}")

if __name__ == "__main__":
    asyncio.run(check_db())
