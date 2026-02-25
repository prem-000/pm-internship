import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from .utils.scoring import (
    calculate_education_match, 
    calculate_location_match, 
    calculate_sector_match
)
from .utils.skill_gap import analyze_skill_gap
from .database import get_database
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
        
        # Ensure 'job_description' exists to avoid KeyError
        if 'job_description' not in self.internships_df.columns:
            print("ℹ️ 'job_description' column missing. Synthesizing from available fields.")
            self.internships_df['job_description'] = self.internships_df.apply(
                lambda row: f"{row.get('title', '')} {row.get('sector', '')} {' '.join(row.get('required_skills', []))}" if isinstance(row.get('required_skills'), list) else f"{row.get('title', '')} {row.get('sector', '')}",
                axis=1
            )

        # Precompute TF-IDF vectors for internship descriptions
        descriptions = self.internships_df['job_description'].fillna("").tolist()
        if descriptions and any(d.strip() for d in descriptions):
            self.internship_vectors = self.tfidf_vectorizer.fit_transform(descriptions)
            print(f"📊 Recommender fitted with {len(internships)} internships and TF-IDF vectors.")
        else:
            print("⚠️ No valid job descriptions found for vectorization.")

    def calculate_skill_match(self, user_skills: list, required_skills: list):
        if not required_skills:
            return 1.0, [], []
            
        user_skills_norm = {self.normalize_skill(s) for s in user_skills}
        req_skills_norm = {self.normalize_skill(s) for s in required_skills}
        
        matched = user_skills_norm.intersection(req_skills_norm)
        missing = req_skills_norm - user_skills_norm
        
        match_percentage = len(matched) / len(req_skills_norm) if req_skills_norm else 0
        return match_percentage, list(matched), list(missing)

    def get_user_behavior_profile(self, user_id: str):
        db = get_database()
        if db is None: return {}
        return db.user_behavior_profiles.find_one({"user_id": user_id}) or {}

    def calculate_feedback_boost(self, row: dict, behavior_profile: dict):
        boost = 0.0
        sector = row.get("sector")
        
        # Feedback Boost logic: +15 (applied), +10 (saved), +5 (viewed), -10 (rejected)
        # We aggregate these in the interaction_router under 'feedback_boosts'
        if sector and "feedback_boosts" in behavior_profile:
            boost = float(behavior_profile["feedback_boosts"].get(sector, 0))
        
        # Cap feedback influence at ±20 to prevent bias explosion
        return max(-20.0, min(20.0, boost))

    def calculate_match_gap(self, user_skills: list, row: dict, base_score: float, semantic_score: float):
        required_skills = row.get('required_skills', [])
        _, _, missing = self.calculate_skill_match(user_skills, required_skills)
        
        if not missing:
            return {
                "missing_skills": [],
                "skill_impact_score": 0.0,
                "semantic_gap_score": 0.0,
                "estimated_score_if_completed": round(base_score, 2),
                "recommended_focus_order": []
            }
            
        # Skill impact analysis
        # How much would the score increase if each missing skill was added?
        # Current skill_match = matched / total
        total_req = len(required_skills)
        impact_per_skill = (0.5 * (1.0 / total_req) * 100) if total_req > 0 else 0
        
        # Rank skills by impact (mocking specific skill rarity impact if needed, 
        # but here we follow the "impact on score" rule from PRD)
        focus_order = sorted(missing, key=lambda x: impact_per_skill, reverse=True)
        
        # Estimated score if ALL missing skills were completed
        # If skills completed, skill_match becomes 100%
        # New base_score = (0.5 * 1.0) + (0.3 * semantic) + (0.1 * sector) + (0.1 * location)
        # For simplicity, we can estimate it as base_score + (missing_count * impact_per_skill)
        estimated_final = min(100, base_score + (len(missing) * impact_per_skill))
        
        return {
            "missing_skills": missing,
            "skill_impact_score": round(len(missing) * impact_per_skill, 2),
            "semantic_gap_score": round((1.0 - semantic_score) * 10, 2), # Heuristic
            "estimated_score_if_completed": round(estimated_final, 2),
            "recommended_focus_order": focus_order
        }

    def recommend(self, user_profile: dict, filters: dict = None):
        if self.internships_df is None or self.internships_df.empty or self.internship_vectors is None:
            print("⚠️ Recommender not ready or no internships available.")
            return []

        # Extract filters
        filters = filters or {}
        limit = filters.get('limit', 30)
        min_score_filter = filters.get('min_score', 0)
        location_filter = str(filters.get('location', 'all') or 'all').lower()

        user_skills = user_profile.get('skills', [])
        target_role = str(user_profile.get('target_role', '')).lower().strip()
        preferred_sector = str(user_profile.get('preferred_sector', '')).lower().strip()
        preferred_location = str(user_profile.get('preferred_location', '')).lower().strip()

        print(f"📊 Recommendation Filter: {location_filter}, min_score: {min_score_filter}, limit: {limit}")
        print(f"📊 User Profile: roles={target_role}, skills={len(user_skills)}")

        # Step 1: Precompute User semantic vector
        user_text = target_role + " " + " ".join(user_skills)
        user_vector = self.tfidf_vectorizer.transform([user_text])
        
        # Step 2: Calculate Semantic Similarity
        semantic_similarities = cosine_similarity(user_vector, self.internship_vectors).flatten()

        # Step 3: Fetch Behavior Profile
        user_id = str(user_profile.get('_id', ''))
        behavior_profile = self.get_user_behavior_profile(user_id) if user_id else {}

        results = []
        print(f"📊 Scanning {len(self.internships_df)} internships...")
        for i, row in self.internships_df.iterrows():
            # Location Filtering (Hard Filter)
            internship_loc = str(row.get('location', '')).lower()
            if location_filter != 'all':
                if location_filter == 'remote' and 'remote' not in internship_loc:
                    continue
                if location_filter == 'onsite' and 'remote' in internship_loc:
                    continue
                # Add more specific logic if needed for hybrid

            skill_match_pct, matched, missing = self.calculate_skill_match(user_skills, row.get('required_skills', []))
            
            # Minimum threshold
            if skill_match_pct < 0.05:
                continue
                
            semantic_score = float(semantic_similarities[i])
            sector_score = calculate_sector_match(preferred_sector, row.get('sector'))
            location_score = calculate_location_match(preferred_location, row.get('location'))
            
            # PRD Base Score (Updated Formula):
            # 0.5 * skill_match + 0.3 * semantic_similarity + 0.1 * sector_alignment + 0.1 * location_match
            base_score = (
                0.5 * skill_match_pct +
                0.3 * semantic_score +
                0.1 * sector_score +
                0.1 * location_score
            ) * 100
            
            # Feedback Boost Layer
            feedback_boost = self.calculate_feedback_boost(row, behavior_profile)
            
            # Final Score
            final_score = base_score + feedback_boost

            # Structure response as per PART 4
            internship_data = {
                "internship_id": str(row.get('_id', '')),
                "title": row.get('title') or "Untitled Internship",
                "company": row.get('company') or row.get('organization') or "N/A",

                "apply_url": row.get('apply_url') or "#",
                "department_page": row.get('department_page') or "#",
                "location": row.get('location') or "Remote",
                "score": round(float(final_score), 2),
                "score_breakdown": {
                    "skill_match": round(skill_match_pct * 100, 2),
                    "semantic_similarity": round(semantic_score * 100, 2),
                    "sector_alignment": round(sector_score * 100, 2),
                    "location_match": round(location_score * 100, 2),
                    "base_score": round(base_score, 2),
                    "feedback_boost": round(feedback_boost, 2)
                },
                "match_details": {
                    "matched_skills": matched,
                    "missing_skills": missing,
                    "skill_match_percentage": round(skill_match_pct * 100, 2)
                },
                "gap_analysis": self.calculate_match_gap(user_skills, row, base_score, semantic_score)
            }
            
            # Filter by min_score if provided
            if final_score >= min_score_filter:
                results.append(internship_data)


        print(f"✅ Final recommendations found: {len(results)}")
        # Round all scores and results
        results.sort(key=lambda x: x['score'], reverse=True)
        return results[:limit]

recommender = InternshipRecommender()
