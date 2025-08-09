from pydantic_settings import BaseSettings
from pydantic import field_validator, HttpUrl
from dotenv import load_dotenv
from typing import List
import os

env_file = ".env.production" if os.getenv("ENV") == "production" else ".env.local"
load_dotenv(env_file)

class Settings(BaseSettings):
    DATABASE_URL: str
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    DEBUG: bool = False
    CORS_ORIGINS: List[HttpUrl] = []
    OPENAI_API_KEY: str
    RAG_EMBEDDING_MODEL: str = "text-embedding-small"
    RAG_EMBEDDING_DIM: int = 1536

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def split_origins(cls, v):
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",")]
        return v
    
    model_config = {
        "env_file": env_file,
        "case_sensitive": True,
    }

settings = Settings()