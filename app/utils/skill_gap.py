from rapidfuzz import process, fuzz

def analyze_skill_gap(user_skills: list, required_skills: list):
    missing_skills = []
    
    for req in required_skills:
        # Check if skill exists in user skills using fuzzy matching
        match = process.extractOne(req, user_skills, scorer=fuzz.token_sort_ratio, score_cutoff=80)
        if not match:
            missing_skills.append(req)
            
    return missing_skills
