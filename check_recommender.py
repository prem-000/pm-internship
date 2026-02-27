
from app.recommender import recommender
from app.database import connect_to_mongo, get_database
import pandas as pd

def check_recommender():
    connect_to_mongo()
    db = get_database()
    internships = list(db.internships.find())
    print(f"Fitting recommender with {len(internships)} internships")
    recommender.fit(internships)
    
    print(f"internships_df is None: {recommender.internships_df is None}")
    if recommender.internships_df is not None:
        print(f"internships_df shape: {recommender.internships_df.shape}")
        
    print(f"internship_vectors is None: {recommender.internship_vectors is None}")
    if recommender.internship_vectors is not None:
        print(f"internship_vectors shape: {recommender.internship_vectors.shape}")

    # Test recommendation for a dummy user
    dummy_user = {
        "email": "dummy@gmail.com",
        "skills": ["react", "python"],
        "target_role": "Software Engineer",
        "preferred_sector": "cse",
        "preferred_location": "remote"
    }
    
    res = recommender.recommend(dummy_user)
    print(f"Recommendation count: {len(res)}")
    if len(res) > 0:
        print(f"First recommendation: {res[0]}")
    else:
        print("NO RECOMMENDATIONS RETURNED")

if __name__ == "__main__":
    check_recommender()
