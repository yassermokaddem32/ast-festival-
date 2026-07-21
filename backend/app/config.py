import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    # Google Sheets Configuration
    GOOGLE_SHEET_ID: str = ""
    GOOGLE_SHEET_NAME: str = "Sheet1"
    GOOGLE_CREDENTIALS_FILE: str = "credentials.json"
    
    # CORS Origins (Comma-separated string in env, parsed as list)
    CORS_ORIGINS_RAW: str = "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,https://ast-festival.vercel.app,https://ast-festival-production.up.railway.app,*"
    
    @property
    def cors_origins(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS_RAW.split(",") if origin.strip()]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
