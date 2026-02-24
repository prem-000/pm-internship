import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from .utils.scoring import (
    calculate_education_match, 
    calculate_location_match, 
    calculate_sector_match
)
from .utils.skill_gap import analyze_skill_gap
import numpy as np

class InternshipRecommender:
    def __init__(self):
        self.internships_df = None
        self.tfidf_vectorizer = TfidfVectorizer(
            stop_words='english',
            ngram_range=(1, 2),
            max_features=5000
        )
        self.internship_vectors = None
        self.synonyms = {
            "js": "javascript",
            "ml": "machine learning",
            "node": "node.js",
            "python": "python",
            "react": "react"
        }

    def normalize_skill(self, skill: str) -> str:
        s = skill.lower().strip()
        return self.synonyms.get(s, s)

    def fit(self, internships: list):
        if not internships:
            print("⚠️ No internships found to fit the recommender.")
            return
        
        self.internships_df = pd.DataFrame(internships)
        
        # Precompute TF-IDF vectors for internship descriptions
        # Using job_description for semantic matching
        descriptions = self.internships_df['job_description'].fillna("").tolist()
        if descriptions:
            self.internship_vectors = self.tfidf_vectorizer.fit_transform(descriptions)
            print(f"📊 Recommender fitted with {len(internships)} internships and TF-IDF vectors.")
        else:
            print("⚠️ No job descriptions found for vectorization.")

    def calculate_skill_match(self, user_skills: list, required_skills: list):
        if not required_skills:
            return 1.0, [], []
            
        user_skills_norm = {self.normalize_skill(s) for s in user_skills}
        req_skills_norm = {self.normalize_skill(s) for s in required_skills}
        
        matched = user_skills_norm.intersection(req_skills_norm)
        missing = req_skills_norm - user_skills_norm
        
        match_percentage = len(matched) / len(req_skills_norm) if req_skills_norm else 0
        return match_percentage, list(matched), list(missing)

    def recommend(self, user_profile: dict, top_n=5):
        if self.internships_df is None or self.internships_df.empty:
            return []

        user_skills = user_profile.get('skills', [])
        target_role = str(user_profile.get('target_role', '')).lower().strip()
        preferred_sector = str(user_profile.get('preferred_sector', '')).lower().strip()
        preferred_location = str(user_profile.get('preferred_location', '')).lower().strip()

        # Step 1: Precompute User semantic vector
        user_text = target_role + " " + " ".join(user_skills)
        user_vector = self.tfidf_vectorizer.transform([user_text])
        
        # Step 2: Calculate Semantic Similarity for all internships
        semantic_similarities = cosine_similarity(user_vector, self.internship_vectors).flatten()

        # Step 3: Filter by sector (optional - currently keeping original logic)
        filtered_df = self.internships_df.copy()
        # Note: If we filter, we need to track indices for similarities. 
        # For simplicity in this iteration, we iterate through all and apply sector matching in score.

        results = []
        for i, row in self.internships_df.iterrows():
            skill_match_pct, matched, missing = self.calculate_skill_match(user_skills, row['required_skills'])
            
            # Minimum threshold: If skill overlap < 10% → discard (lowered from 25% since we have TF-IDF now)
            if skill_match_pct < 0.10:
                continue
                
            semantic_score = float(semantic_similarities[i])
            sector_score = calculate_sector_match(preferred_sector, row['sector'])
            location_score = calculate_location_match(preferred_location, row['location'])
            
            # New Hybrid Scoring Formula (PRD Updated):
            # Skill Match: 35%
            # Semantic Similarity: 35%
            # Sector Alignment: 20%
            # Location: 10%
            final_score = (
                0.35 * skill_match_pct +
                0.35 * semantic_score +
                0.20 * sector_score +
                0.10 * location_score
            ) * 100
            
            results.append({
                "internship_id": str(row['_id']),
                "title": row['title'],
                "score": round(float(final_score), 2),
                "match_details": {
                    "matched_skills": matched,
                    "missing_skills": missing,
                    "skill_match_percentage": round(skill_match_pct * 100, 2)
                },
                "score_breakdown": {
                    "skill_match": round(skill_match_pct * 100, 2),
                    "semantic_similarity": round(semantic_score * 100, 2),
                    "sector_alignment": round(sector_score * 100, 2),
                    "location_match": round(location_score * 100, 2)
                },
                "apply_url": row.get('apply_url'),
                "platform": row.get('platform')
            })

        results.sort(key=lambda x: x['score'], reverse=True)
        return results[:top_n]

recommender = InternshipRecommender()
