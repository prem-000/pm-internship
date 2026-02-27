def calculate_profile_strength(user_data: dict) -> int:
    """
    Calculates profile strength as a percentage based on filled fields.
    Fields included:
    - full_name (10%)
    - bio (10%)
    - education (10%)
    - university (10%)
    - graduation_year (10%)
    - skills (10%) - must not be empty
    - target_roles (10%) - must not be empty
    - preferred_sector (10%)
    - preferred_location (10%)
    - linkedin_url (10%)
    """
    core_fields = [
        "full_name",
        "bio",
        "education", 
        "university",
        "graduation_year",
        "preferred_sector",
        "preferred_location",
        "linkedin_url",
        "github_url",
        "portfolio_url"
    ]
    
    filled_count = 0
    total_fields = len(core_fields) + 2 # +2 for skills and target_roles
    
    # Check simple fields
    for field in core_fields:
        val = user_data.get(field)
        if val is not None:
            if isinstance(val, str) and val.strip() == "":
                continue
            filled_count += 1
            
    # Check list fields
    if user_data.get("skills") and len(user_data.get("skills")) > 0:
        filled_count += 1
        
    if (user_data.get("target_roles") and len(user_data.get("target_roles")) > 0) or user_data.get("target_role"):
        filled_count += 1
        
    # Calculate percentage
    strength = int((filled_count / total_fields) * 100)
    return min(strength, 100)

