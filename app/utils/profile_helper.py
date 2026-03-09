def calculate_profile_strength(user_data: dict) -> int:
    """
    Calculates profile strength as a percentage based on weighted categories.
    - Skills: 30%
    - Education: 20%
    - Bio: 10%
    - Target Roles: 10%
    - Projects: 20%
    - External Links: 10% (LinkedIn, GitHub, or Portfolio)
    """
    score = 0
    
    # Skills (30%)
    if user_data.get("skills") and len(user_data["skills"]) > 0:
        score += 30
        
    # Education (20%) - requires both education and (university or graduation_year)
    if user_data.get("education") and (user_data.get("university") or user_data.get("graduation_year")):
        score += 20
    elif user_data.get("education"):
        score += 10 # Partial
        
    # Bio (10%)
    bio = user_data.get("bio")
    if bio and len(bio.strip()) > 10:
        score += 10
        
    # Target Roles (10%)
    if user_data.get("target_roles") or user_data.get("target_role"):
        score += 10
        
    # Projects (20%)
    if user_data.get("projects") and len(user_data["projects"]) > 0:
        score += 20
        
    # External Links (10%)
    if user_data.get("linkedin_url") or user_data.get("github_url") or user_data.get("portfolio_url"):
        score += 10
        
    return min(score, 100)

