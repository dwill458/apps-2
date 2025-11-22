"""
Application Configuration Module
Handles all environment variables and application settings.
"""
from functools import lru_cache
from typing import List, Optional
from pydantic_settings import BaseSettings
from pydantic import Field, PostgresDsn, RedisDsn


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.
    Uses pydantic for validation and type safety.
    """

    # Application
    APP_NAME: str = "Sports Betting Prediction Engine"
    APP_VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    DEBUG: bool = False
    SECRET_KEY: str = Field(..., min_length=32)

    # Database
    DATABASE_URL: str
    DATABASE_POOL_SIZE: int = 20
    DATABASE_MAX_OVERFLOW: int = 0

    # Redis
    REDIS_URL: str
    REDIS_CACHE_TTL: int = 300

    # API Keys
    ODDS_API_KEY: str
    ODDS_API_BASE_URL: str = "https://api.the-odds-api.com/v4"

    # Security
    CORS_ORIGINS: str = "http://localhost:3000"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60
    API_CALL_TIMEOUT: int = 30

    # Geo-Fencing
    ENABLE_GEO_FENCING: bool = True
    ALLOWED_STATES: str = "NJ,PA,IN,WV,CO,TN,VA,IA,IL,MI,AZ,LA,NY,CT,KS,MD,OH,WY,MA"
    GEOIP_DATABASE_PATH: str = "./data/GeoLite2-City.mmdb"

    # AI Model Configuration
    MODEL_CONFIDENCE_THRESHOLD: float = 0.65
    PREDICTION_HISTORY_DAYS: int = 90
    MIN_HISTORICAL_SAMPLES: int = 50

    # Data Refresh
    ODDS_REFRESH_INTERVAL: int = 300  # 5 minutes
    STATS_REFRESH_INTERVAL: int = 3600  # 1 hour
    HISTORICAL_DATA_REFRESH_INTERVAL: int = 86400  # 24 hours

    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "json"

    # Monitoring
    SENTRY_DSN: Optional[str] = None
    ENABLE_METRICS: bool = True

    @property
    def cors_origins_list(self) -> List[str]:
        """Parse CORS origins into a list."""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]

    @property
    def allowed_states_list(self) -> List[str]:
        """Parse allowed states into a list."""
        return [state.strip().upper() for state in self.ALLOWED_STATES.split(",")]

    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    """
    Cached settings instance.
    Uses lru_cache to ensure settings are loaded only once.
    """
    return Settings()
