import os
from dotenv import load_dotenv
from pydantic_settings import BaseSettings

load_dotenv()

class Settings(BaseSettings):
    # ── Required in production — set these in Render Dashboard ──
    MONGODB_URI: str = os.getenv("MONGO_URI", "")          # Render uses MONGO_URI
    DATABASE_NAME: str = os.getenv("DATABASE_NAME", "pm_recommender")

    JWT_SECRET: str = os.getenv("JWT_SECRET_KEY", "")      # must be set in production
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    JWT_EXPIRE_MINUTES: int = int(os.getenv("JWT_EXPIRE_MINUTES", "60"))

    GOOGLE_API_KEY: str = os.getenv("GEMINI_API_KEY", "")  # Render env var name

    ADMIN_DEFAULT_EMAIL: str = os.getenv("ADMIN_DEFAULT_EMAIL", "admin@gmail.com")
    ADMIN_DEFAULT_PASSWORD: str = os.getenv("ADMIN_DEFAULT_PASSWORD", "strongpassword")

    class Config:
        env_file = ".env"

settings = Settings()
