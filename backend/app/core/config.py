from functools import lru_cache
from pydantic import BaseModel
from pydantic_settings import BaseSettings, SettingsConfigDict
from dotenv import load_dotenv

load_dotenv()


class Settings(BaseSettings):
    GROQ_API_KEY: str | None = None
    ENV: str = "development"
    DATABASE_URL: str | None = None
    REDIS_URL: str | None = None

    model_config = SettingsConfigDict(env_file=".env", env_ignore_empty=True, extra="ignore")


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()  # type: ignore[call-arg]


class Info(BaseModel):
    name: str = "juapesa-backend"
    version: str = "0.1.0"
    env: str = get_settings().ENV
