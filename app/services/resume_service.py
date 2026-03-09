from .text_extractor import TextExtractor
from .resume_parser import ResumeParser
from .skill_normalizer import SkillNormalizer
from typing import Dict, Any

class ResumeService:
    def __init__(self):
        self.parser = ResumeParser()
        self.normalizer = SkillNormalizer()

    async def process_resume(self, file_content: bytes, filename: str) -> Dict[str, Any]:
        """
        Orchestrates the resume parsing workflow:
        1. Extract text
        2. Parse sections and entities
        3. Normalize skills
        """
        # 1. Extract Text
        raw_text = TextExtractor.extract(file_content, filename)
        if not raw_text:
            return None
            
        # 2. Parse Resume
        parsed_data = self.parser.parse(raw_text)
        
        # 3. Normalize Skills
        if parsed_data.get("skills"):
            parsed_data["skills"] = self.normalizer.normalize(parsed_data["skills"])
            
        return parsed_data
