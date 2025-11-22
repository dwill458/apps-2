"""
Main FastAPI Application
Sports Betting Prediction Engine - Backend API

This is the entry point for the FastAPI application.
Run with: uvicorn main:app --reload
"""
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import logging
import sys
from datetime import datetime

from core.config import get_settings
from api.routes import router as api_router
from models.database import init_db, close_db

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for startup and shutdown events.
    """
    # Startup
    logger.info("=" * 60)
    logger.info("🚀 Starting Sports Betting Prediction Engine")
    logger.info("=" * 60)
    logger.info(f"Environment: {settings.ENVIRONMENT}")
    logger.info(f"Debug Mode: {settings.DEBUG}")
    logger.info(f"Geo-Fencing: {'Enabled' if settings.ENABLE_GEO_FENCING else 'Disabled'}")

    # Initialize database
    try:
        logger.info("Initializing database...")
        await init_db()
        logger.info("✓ Database initialized")
    except Exception as e:
        logger.error(f"✗ Database initialization failed: {e}")

    logger.info("=" * 60)
    logger.info("✓ Application startup complete")
    logger.info("=" * 60)

    yield

    # Shutdown
    logger.info("Shutting down application...")
    await close_db()
    logger.info("✓ Application shutdown complete")


# Create FastAPI app
app = FastAPI(
    title="Sports Betting Prediction API",
    description="""
    🎯 **Sports Betting Prediction Engine**

    An AI-powered sports betting analysis platform that aggregates odds from
    major sportsbooks and provides data-driven predictions with win probabilities.

    ## Features

    * **Odds Aggregation**: Real-time odds from DraftKings, FanDuel, BetMGM, and more
    * **AI Predictions**: Sophisticated ML algorithm analyzing team stats, trends, and value
    * **Expected Value (EV)**: Identifies +EV betting opportunities
    * **Geo-Fencing**: Compliance with state-specific sports betting laws
    * **Responsible Gaming**: Built-in safeguards and resources

    ## Legal Disclaimer

    This service is for informational and entertainment purposes only. Users must
    be 21+ and located in approved states. Always gamble responsibly.

    ## Getting Started

    1. Check `/health` to verify service status
    2. Use `/sports` to see available sports
    3. Fetch `/games` to see upcoming matchups
    4. Generate `/predictions` for AI analysis

    **Problem Gambling Help**: 1-800-GAMBLER
    """,
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add GZip compression
app.add_middleware(GZipMiddleware, minimum_size=1000)


# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """
    Global exception handler for unexpected errors.
    """
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "message": "An unexpected error occurred",
            "timestamp": datetime.utcnow().isoformat()
        }
    )


# Include API routes
app.include_router(api_router, prefix="/api/v1")


# Root endpoint
@app.get("/", tags=["Root"])
async def root():
    """
    Root endpoint with API information.
    """
    return {
        "service": "Sports Betting Prediction Engine",
        "version": "1.0.0",
        "status": "operational",
        "documentation": "/docs",
        "api_base": "/api/v1",
        "disclaimer": "Must be 21+. For problem gambling help, call 1-800-GAMBLER.",
        "timestamp": datetime.utcnow().isoformat()
    }


# Additional endpoints
@app.get("/disclaimer", tags=["Legal"])
async def legal_disclaimer():
    """
    Legal disclaimer and responsible gaming information.
    """
    return {
        "disclaimer": """
        LEGAL DISCLAIMER

        This service provides sports betting analysis and predictions for
        informational and entertainment purposes only.

        REQUIREMENTS:
        - You must be 21 years or older
        - You must be located in an approved state
        - Sports betting involves risk

        RESPONSIBLE GAMING:
        - Never bet more than you can afford to lose
        - Set limits and stick to them
        - If you have a gambling problem, get help

        RESOURCES:
        - National Council on Problem Gambling: 1-800-522-4700
        - NCPGambling.org
        - Gamblers Anonymous: gamblersanonymous.org

        ACCURACY:
        - Predictions are based on historical data and statistical models
        - Past performance does not guarantee future results
        - No prediction is guaranteed to be accurate

        LEGAL:
        - This service does not place bets on your behalf
        - Users are responsible for complying with local laws
        - Consult legal counsel for specific legal questions
        """,
        "minimum_age": 21,
        "help_line": "1-800-GAMBLER",
        "approved_states": settings.allowed_states_list
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
        log_level="info"
    )
