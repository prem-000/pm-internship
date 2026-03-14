from typing import List, Dict
from ..utils.skill_gap import analyze_skill_gap
from ..gemini_service import gemini_service

class SkillGapService:
    def __init__(self):
        pass

    def calculate_missing_skills(self, user_skills: List[str], required_skills: List[str]) -> List[str]:
        """
        Computes missing skills by comparing user skills with required skills.
        Uses the specialized matching algorithm from utils.
        """
        if not required_skills:
            return []

        return analyze_skill_gap(user_skills, required_skills)

    async def generate_gemini_explanation(self, internship_title: str, missing_skills: List[str]) -> str:
        """
        Calls Gemini to explain why missing skills are important.
        """
        return await gemini_service.generate_skill_explanation(internship_title, missing_skills)

    def calculate_impact_score(self, current_score: float, missing_skills_count: int, total_required_count: int) -> float:
        """
        Calculates how much the score would increase if all missing skills were completed.
        Follows v2.1 PRD logic: (0.5 * (1.0 / total_req) * 100) per skill.
        """
        if total_required_count == 0:
            return current_score
            
        impact_per_skill = (0.5 * (1.0 / total_required_count) * 100)
        potential_increase = missing_skills_count * impact_per_skill
        
        return min(100.0, current_score + potential_increase)

skill_gap_service = SkillGapService()
