"""
Application settings loaded from environment variables using Pydantic.
"""
from pathlib import Path
from typing import Optional

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings."""
    
    # OpenAI
    openai_api_key: str
    
    # Database
    database_url: str = "sqlite:///inbox_helper.db"
    
    # Gmail
    gmail_credentials_path: Path = Path.home() / ".credentials" / "gmail.json"
    
    # App settings
    debug: bool = False
    
    model_config = SettingsConfigDict(env_file=".env")


settings = Settings() 