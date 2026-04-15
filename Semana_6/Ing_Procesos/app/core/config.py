import os
from pathlib import Path
from dotenv import load_dotenv
from pydantic import AnyHttpUrl, validators
from pydantic_settings import BaseSettings

# Ruta absoluta al archivo .env
BASE_DIR = Path(__file__).resolve().parent.parent  # Carpeta 'app'
ENV_FILE = BASE_DIR / ".env"
load_dotenv(ENV_FILE)

class Settings(BaseSettings):
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_DURATION: int
    BACKEND_CORS_ORIGINS: list[AnyHttpUrl] = []
    class ModelConfig:
        env_file = str(ENV_FILE)
        env_file_encoding = 'utf-8'

   #@validators("BACKEND_CORS_ORIGINS", pre=True)

class Settings_db(BaseSettings):
    DB_USER: str
    DB_PASSWORD: str
    DB_HOST: str
    class ModelConfig:
        env_file = str(ENV_FILE)
        env_file_encoding = 'utf-8'

settings = Settings() # type: ignore
settings_db = Settings_db() # type: ignore