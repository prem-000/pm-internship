from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    role: str = "user"
    education: Optional[str] = None
    skills: List[str] = []
    preferred_sector: Optional[str] = None
    preferred_location: Optional[str] = None
    target_role: Optional[str] = None

class UserRegister(BaseModel):
    email: EmailStr
    password: str

class ProfileUpdate(BaseModel):
    education: str
    skills: List[str]
    preferred_sector: str
    preferred_location: str
    target_role: str

class AdminLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class InternshipCreate(BaseModel):
    title: str
    department: str
    sector: str
    required_skills: List[str]
    education: str
    location: str
    platform: str
    apply_url: str
    role: Optional[str] = None

class ScoreBreakdown(BaseModel):
    skill_match: float
    semantic_similarity: float
    sector_alignment: float
    location_match: float

class MatchDetails(BaseModel):
    matched_skills: List[str]
    missing_skills: List[str]
    skill_match_percentage: float

class GapImpact(BaseModel):
    skill: str
    estimated_score_gain: float
    internships_unlocked: int

class GapAnalysis(BaseModel):
    high_impact_skills: List[GapImpact] = []
    medium_impact_skills: List[GapImpact] = []
    low_impact_skills: List[GapImpact] = []

class RecommendationResponse(BaseModel):
    internship_id: str
    title: str
    organization: Optional[str] = None
    apply_url: Optional[str] = None
    department_page: Optional[str] = None
    location: Optional[str] = None
    score: float
    match_details: MatchDetails
    score_breakdown: ScoreBreakdown
    behavior_bonus: float = 0.0
    gap_analysis: GapAnalysis = Field(default_factory=GapAnalysis)
    learning_roadmap: Optional[str] = None

    class Config:
        extra = "allow"
class UserInteractionCreate(BaseModel):
    internship_id: str
    action: str  # viewed | saved | applied | rejected
