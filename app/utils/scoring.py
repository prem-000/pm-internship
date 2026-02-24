from rapidfuzz import fuzz

def calculate_role_similarity(target_role: str, internship_title: str) -> float:
    if not target_role or not internship_title:
        return 0.0
    return fuzz.token_sort_ratio(target_role.lower(), internship_title.lower()) / 100.0

def calculate_education_match(user_edu: str, required_edu: str) -> float:
    if not required_edu: return 1.0
    user_edu = user_edu.lower()
    required_edu = required_edu.lower()
    
    if user_edu == required_edu: return 1.0
    # Simple hierarchy if needed, for now exact or partial
    if required_edu in user_edu: return 0.5
    return 0.0

def calculate_location_match(user_loc: str, internship_loc: str) -> float:
    if not user_loc or not internship_loc: return 0.5 # Neutral
    user_loc = user_loc.lower()
    internship_loc = internship_loc.lower()
    
    if user_loc == internship_loc: return 1.0
    if "remote" in internship_loc: return 0.8
    return 0.0

def calculate_sector_match(user_sector: str, internship_sector: str) -> float:
    if not user_sector or not internship_sector: return 0.0
    return 1.0 if user_sector.lower() == internship_sector.lower() else 0.0
