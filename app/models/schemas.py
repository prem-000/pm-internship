from pydantic import BaseModel, EmailStr, Field, HttpUrl
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

class ProfileUpdateRequest(BaseModel):
    full_name: Optional[str] = None
    education: Optional[str] = None
    university: Optional[str] = None
    graduation_year: Optional[int] = None
    skills: Optional[List[str]] = None
    preferred_sector: Optional[str] = None
    preferred_location: Optional[str] = None
    target_roles: Optional[List[str]] = None
    bio: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    portfolio_url: Optional[str] = None

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
    base_score: float
    behavior_bonus: float

class MatchDetails(BaseModel):
    matched_skills: List[str]
    missing_skills: List[str]
    skill_match_percentage: float

class GapImpact(BaseModel):
    skill: str
    estimated_score_gain: float
    internships_unlocked: int

class UserFeedbackCreate(BaseModel):
    internship_id: str
    action: str  # viewed | applied | saved | rejected

class GapAnalysis(BaseModel):
    missing_skills: List[str] = []
    skill_impact_score: float = 0.0
    semantic_gap_score: float = 0.0
    estimated_score_if_completed: float = 0.0
    recommended_focus_order: List[str] = []

class RecommendationResponse(BaseModel):
    internship_id: str
    title: str
    organization: Optional[str] = None
    apply_url: Optional[str] = None
    department_page: Optional[str] = None
    location: Optional[str] = None
    score: float
    score_breakdown: dict
    match_details: dict
    gap_analysis: GapAnalysis
    learning_roadmap: Optional[str] = None

    class Config:
        extra = "allow"
