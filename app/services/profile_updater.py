from ..database import get_database
from ..utils.profile_helper import calculate_profile_strength
from datetime import datetime
from typing import Dict, Any, List

class ProfileUpdater:
    @staticmethod
    async def update_user_profile(email: str, parsed_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Update user profile with validated resume data using HPIS Merge Engine rules (v2.0).
        Rule 1: Deduplication (Skills/Projects)
        Rule 2: Preservation (Manual fields AUTHORITATIVE)
        Rule 3: Append (New projects/experience)
        Rule 4: Conditional Update (Links only if empty)
        """
        db = get_database()
        user = db.users.find_one({"email": email})
        
        if not user:
            raise ValueError("User not found")

        set_data = {
            "updated_at": datetime.utcnow(),
            "resume_uploaded": True
        }
        
        # Rule 2: Preservation (Manual user fields are never overwritten)
        if not user.get("full_name") and parsed_data.get("full_name") and parsed_data.get("full_name") != "Unknown":
            set_data["full_name"] = parsed_data["full_name"]
            
        if not user.get("bio") and parsed_data.get("bio"):
            set_data["bio"] = parsed_data["bio"]

        if not user.get("education") and parsed_data.get("education"):
            set_data["education"] = parsed_data["education"]

        # Rule 4: Conditional Update (Social links updated only if empty)
        link_fields = ["linkedin_url", "github_url", "portfolio_url"]
        for field in link_fields:
            if not user.get(field) and parsed_data.get(field):
                set_data[field] = parsed_data[field]

        # Apply basic sets first
        print(f"📄 Updating basic info for {email}: {set_data}")
        db.users.update_one({"email": email}, {"$set": set_data})

        # Rule 1: Deduplication & $addToSet for Skills
        skills = parsed_data.get("skills")
        if skills and isinstance(skills, list):
            # We use $each with $addToSet to add multiple unique items
            # Ensure skills are strings before lowering
            processed_skills = [str(s).lower() for s in skills if s]
            if processed_skills:
                print(f"🎯 Merging {len(processed_skills)} skills for {email}")
                db.users.update_one(
                    {"email": email},
                    {"$addToSet": {"skills": {"$each": processed_skills}}}
                )

        # Rule 3: Append for Projects, Experience, Certifications
        for field in ["projects", "experience", "certifications"]:
            new_items = parsed_data.get(field, [])
            if new_items:
                # Ensure new_items is a list
                if isinstance(new_items, str):
                    new_items = [new_items]
                
                user_updated = db.users.find_one({"email": email})
                existing_items = user_updated.get(field, []) if user_updated else []
                
                # Simple string-based deduplication for append
                unique_items = [i for i in new_items if i and i not in existing_items]
                if unique_items:
                    print(f"➕ Appending {len(unique_items)} items to {field} for {email}")
                    db.users.update_one(
                        {"email": email},
                        {"$push": {field: {"$each": unique_items}}}
                    )

        # Calculate and update profile completion strength
        user_updated = db.users.find_one({"email": email})
        profile_completion = calculate_profile_strength(user_updated)
        
        db.users.update_one(
            {"email": email},
            {"$set": {"profile_completion": profile_completion}}
        )
        
        return {
            "status": "success",
            "profile_completion": profile_completion
        }
