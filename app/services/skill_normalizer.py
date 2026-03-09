from rapidfuzz import process, fuzz
from typing import List
try:
    from sentence_transformers import SentenceTransformer, util
    import torch
    HAS_SENTENCE_TRANSFORMERS = True
except ImportError:
    HAS_SENTENCE_TRANSFORMERS = False

class SkillNormalizer:
    def __init__(self):
        # A curated list of standardized skill names
        self.skill_db = [
            "python", "javascript", "react", "nodejs", "mongodb", "postgresql", 
            "flask", "fastapi", "docker", "kubernetes", "aws", "azure", "git",
            "java", "spring boot", "c++", "c#", ".net", "typescript", "angular",
            "vuejs", "tailwind css", "bootstrap", "machine learning", "deep learning",
            "nlp", "data analysis", "sql", "redis", "graphql", "rest api",
            "html5", "css3", "flutter", "react native", "swift", "kotlin", "tensorflow", "pytorch",
            "scikit-learn", "opencv", "golang", "ruby", "rust", "php"
        ]
        self.threshold = 80
        self.semantic_threshold = 0.75
        
        if HAS_SENTENCE_TRANSFORMERS:
            # Load model for semantic similarity
            self.model = SentenceTransformer('all-MiniLM-L6-v2')
            # Pre-compute embeddings for the skill database
            self.skill_embeddings = self.model.encode(self.skill_db, convert_to_tensor=True)

    def normalize(self, raw_skills: List[str]) -> List[str]:
        normalized_skills = []
        
        # 1. Dictionary mapping (JS -> JavaScript, etc.)
        synonyms = {
            "js": "javascript",
            "ml": "machine learning",
            "py": "python",
            "ts": "typescript",
            "cv": "opencv",
            "ai": "artificial intelligence",
            "dl": "deep learning",
            "reactjs": "react",
            "vue": "vuejs",
            "node": "nodejs"
        }
        
        for raw_skill in raw_skills:
            skill_lower = raw_skill.lower().strip()
            
            # Apply synonym mapping
            skill_lower = synonyms.get(skill_lower, skill_lower)
            
            # Step A: Fuzzy matching (Fast and deterministic)
            match = process.extractOne(
                skill_lower, 
                self.skill_db, 
                scorer=fuzz.token_sort_ratio
            )
            
            if match and match[1] >= self.threshold:
                normalized_skills.append(match[0])
                continue

            # Step B: Semantic matching if fuzzy match is weak
            if HAS_SENTENCE_TRANSFORMERS:
                query_embedding = self.model.encode(skill_lower, convert_to_tensor=True)
                cosine_scores = util.cos_sim(query_embedding, self.skill_embeddings)[0]
                best_idx = torch.argmax(cosine_scores).item()
                best_score = cosine_scores[best_idx].item()
                
                if best_score >= self.semantic_threshold:
                    normalized_skills.append(self.skill_db[best_idx])
                    continue
            
            # Fallback: keep it as is if no match found
            normalized_skills.append(skill_lower)
        
        return list(set(normalized_skills))
