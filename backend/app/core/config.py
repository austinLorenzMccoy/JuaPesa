from functools import lru_cache
from pydantic import BaseModel
from pydantic_settings import BaseSettings, SettingsConfigDict
from dotenv import load_dotenv
import os

load_dotenv()


class Settings(BaseSettings):
    GROQ_API_KEY: str | None = None
    ENV: str = "development"
    DATABASE_URL: str | None = None
    REDIS_URL: str | None = None
    # Comma-separated list of allowed origins for CORS, e.g. "http://localhost:5173,https://app.example.com"
    ALLOWED_ORIGINS: str | None = None

    model_config = SettingsConfigDict(env_file=".env", env_ignore_empty=True, extra="ignore")


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()  # type: ignore[call-arg]


class Info(BaseModel):
    name: str = "juapesa-backend"
    version: str = "0.1.0"
    env: str = get_settings().ENV

    @property
    def allowed_origins(self) -> list[str]:
        # Read dynamically from environment to avoid stale cached settings in tests
        s = os.environ.get("ALLOWED_ORIGINS")
        if not s:
            return []
        return [o.strip() for o in s.split(",") if o.strip()]
