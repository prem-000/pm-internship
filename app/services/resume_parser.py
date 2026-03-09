import spacy
import re
from typing import List, Dict, Any

# Load spaCy model (Requirement 8.0: en_core_web_trf)
try:
    nlp = spacy.load("en_core_web_trf")
except OSError:
    try:
        # Fallback to sm if trf is not available yet (installation might still be running)
        nlp = spacy.load("en_core_web_sm")
    except OSError:
        import spacy.cli
        spacy.cli.download("en_core_web_sm")
        nlp = spacy.load("en_core_web_sm")

class ResumeParser:
    def __init__(self):
        self.section_headers = {
            "education": [r"education", r"academic", r"university", r"college", r"school", r"qualification"],
            "experience": [r"experience", r"work", r"employment", r"history", r"professional", r"career"],
            "skills": [r"skills", r"technical", r"abilities", r"technologies", r"tools", r"expertise"],
            "projects": [r"projects", r"personal projects", r"academic projects", r"portfolio"],
            "certifications": [r"certifications", r"certs", r"achievements", r"awards"]
        }
        
        # Skill keywords for rule-based mining
        self.skill_keywords = [
            "python", "javascript", "java", "c++", "c#", "typescript", "swift", "kotlin", "go", "ruby", "rust",
            "fastapi", "flask", "django", "node.js", "express", "spring boot", "laravel", "jwt", "rest api",
            "machine learning", "deep learning", "nlp", "ai", "tensorflow", "pytorch", "scikit-learn", "opencv",
            "mongodb", "postgresql", "sql", "mysql", "redis", "firebase", "elasticsearch",
            "aws", "azure", "gcp", "docker", "kubernetes", "terraform", "github actions",
            "react", "vue", "angular", "tailwind", "bootstrap", "html", "css", "next.js",
            "git", "postman", "jira", "figma", "unity", "power bi", "tableau", "spark", "hadoop"
        ]

    def parse(self, text: str) -> Dict[str, Any]:
        doc = nlp(text)
        
        # 1. Contact Info Extraction (Regex - Requirement 8.0)
        contacts = self._extract_contacts(text)
        
        # 2. Name Extraction (NER - Requirement 8.0)
        name = self._extract_name(doc)
        
        # 3. Section Detection & Extraction
        sections = {}
        for section in self.section_headers.keys():
            sections[section] = self._get_section_text(text, section)
        
        # 4. Skill Detection (Dictionary Skill Mining & Rule-based)
        skills = self._mine_skills_from_text(text)
        
        parsed_data = {
            "full_name": name,
            "email": contacts.get("email"),
            "linkedin_url": contacts.get("linkedin_url"),
            "github_url": contacts.get("github_url"),
            "portfolio_url": contacts.get("portfolio_url"),
            "skills": list(set(skills)),
            "education": sections.get("education", ""),
            "projects": self._get_projects_list(sections.get("projects", "")),
            "experience": sections.get("experience", ""),
            "certifications": self._get_list_from_content(sections.get("certifications", ""))
        }
        
        return parsed_data

    def _extract_contacts(self, text: str) -> Dict[str, str]:
        contacts = {}
        
        # Email
        email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', text)
        if email_match:
            contacts["email"] = email_match.group(0)
            
        # LinkedIn
        linkedin_match = re.search(r'(linkedin\.com/in/[\w\.-]+)', text)
        if linkedin_match:
            contacts["linkedin_url"] = "https://" + linkedin_match.group(0)
            
        # GitHub
        github_match = re.search(r'(github\.com/[\w\.-]+)', text)
        if github_match:
            contacts["github_url"] = "https://" + github_match.group(0)
            
        # Portfolio
        portfolio_match = re.search(r'([\w\.-]+\.(?:dev|io|me|github\.io|vercel\.app)[\w\.-]*)', text)
        if portfolio_match:
            contacts["portfolio_url"] = "https://" + portfolio_match.group(0)
            
        return contacts

    def _extract_name(self, doc) -> str:
        # Look for PERSON entity in the beginning of the doc
        for ent in doc.ents:
            if ent.label_ == "PERSON" and ent.start_char < 200:
                name = ent.text.strip().split('\n')[0].strip()
                if len(name.split()) >= 2: # Likely a full name
                    return name
        
        # Fallback: First non-empty line
        lines = [l.strip() for l in doc.text.split('\n') if l.strip()]
        if lines:
            first_line = lines[0]
            if len(first_line.split()) <= 4: # Reasonable name length
                return first_line
        return "Unknown"

    def _mine_skills_from_text(self, text: str) -> List[str]:
        found_skills = []
        text_lower = text.lower()
        
        for skill in self.skill_keywords:
            # Use word boundaries to avoid partial matches (e.g., 'go' in 'google')
            pattern = rf"\b{re.escape(skill)}\b"
            if re.search(pattern, text_lower):
                found_skills.append(skill)
        return found_skills

    def _get_section_text(self, text: str, section_key: str) -> str:
        lines = text.split('\n')
        start_line = -1
        
        for i, line in enumerate(lines):
            line_lower = line.lower().strip()
            # Check if line matches any header for the current section
            if any(re.search(rf"^\b{h}\b", line_lower) for h in self.section_headers[section_key]):
                start_line = i + 1
                break
        
        if start_line == -1: return ""
        
        content = []
        for line in lines[start_line:]:
            line_lower = line.lower().strip()
            # Stop if we hit another section header
            is_another_header = False
            for sk, headers in self.section_headers.items():
                if sk != section_key and any(re.search(rf"^\b{h}\b", line_lower) for h in headers):
                    is_another_header = True
                    break
            if is_another_header: break
            content.append(line.strip())
            
        return "\n".join([c for c in content if c])

    def _get_projects_list(self, project_text: str) -> List[str]:
        if not project_text: return []
        # Split by bullets or standard separators
        items = re.split(r'\n(?=[•\-\*])|\n\n', project_text)
        return [i.strip() for i in items if len(i.strip()) > 10][:5]

    def _get_list_from_content(self, content: str) -> List[str]:
        if not content: return []
        return [l.strip() for l in content.split('\n') if l.strip()]
