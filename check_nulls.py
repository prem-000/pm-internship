
from app.config import settings
from pymongo import MongoClient

def check_for_nulls():
    client = MongoClient(settings.MONGODB_URI)
    db = client[settings.DATABASE_NAME]
    internships = list(db.internships.find())
    
    fields_to_check = ['title', 'company', 'organization', 'location', 'sector', 'required_skills']
    
    null_counts = {field: 0 for field in fields_to_check}
    missing_counts = {field: 0 for field in fields_to_check}
    
    for doc in internships:
        for field in fields_to_check:
            if field not in doc:
                missing_counts[field] += 1
            elif doc[field] is None:
                null_counts[field] += 1
                
    print(f"Total internships: {len(internships)}")
    print(f"Null counts: {null_counts}")
    print(f"Missing counts: {missing_counts}")

if __name__ == "__main__":
    check_for_nulls()
