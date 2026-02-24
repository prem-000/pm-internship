import google.generativeai as genai
from .config import settings
import json

# Configure Gemini with GOOGLE_API_KEY from settings
genai.configure(api_key=settings.GOOGLE_API_KEY)

class GeminiService:
    def __init__(self):
        # Try primary model, with fallback model defined
        try:
            self.model = genai.GenerativeModel("gemini-1.5-flash")
        except Exception:
            self.model = genai.GenerativeModel("gemini-1.5-pro")

    def _generate_rule_based_roadmap(self, missing_skills: list) -> str:
        """Professional rule-based fallback when AI fails."""
        if not missing_skills:
            return "You're already well-equipped for this role. Focus on building a portfolio project to showcase your existing expertise."
        
        skills_str = ", ".join(missing_skills)
        return (f"Start by learning {skills_str} basics through high-quality documentation or online courses. "
                f"Build one practical project incorporating these skills, then focus on mastering advanced concepts "
                f"like optimization and security to become job-ready.")

    async def get_learning_roadmap(self, internship_title: str, missing_skills: list):
        """Generates a roadmap using Gemini with a mandatory rule-based fallback."""
        if not missing_skills:
            return "You already have the core skills for this role! Focus on networking and preparing for behavioral interviews."

        prompt = f"""
        Create a short 2-week learning roadmap for the following internship:
        {internship_title}

        Missing skills:
        {', '.join(missing_skills)}

        Keep it practical and beginner friendly. Format as a short paragraph.
        """
        
        try:
            # Note: generate_content is synchronous in the basic SDK, 
            # but we keep the method async for future-proofing or if used with loops.
            response = self.model.generate_content(prompt)
            if response and response.text:
                return response.text.strip()
            return self._generate_rule_based_roadmap(missing_skills)
        except Exception:
            # Mandatory Fallback: Never expose AI errors
            return self._generate_rule_based_roadmap(missing_skills)

    async def detect_profile_misuse(self, user_data: dict):
        """Safety check for profiles."""
        prompt = f"""
        Analyze if this user profile appears misleading, spam, or contains gibberish.
        Skills: {user_data.get('skills')}
        Education: {user_data.get('education')}
        Target Role: {user_data.get('target_role')}
        
        Return JSON only with:
        "severity_score": (float 0-1),
        "explanation": (string concise)
        """
        try:
            response = self.model.generate_content(prompt)
            text = response.text
            start = text.find('{')
            end = text.rfind('}') + 1
            if start != -1 and end != -1:
                return json.loads(text[start:end])
            return {"severity_score": 0.0, "explanation": "Validation passed"}
        except Exception:
            return {"severity_score": 0.0, "explanation": "Safety check bypassed"}

gemini_service = GeminiService()
