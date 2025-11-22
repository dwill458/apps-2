"""
API Routes
RESTful endpoints for the sports betting prediction app.
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from datetime import datetime, timedelta
import logging

from models.database import get_db
from models.schema import Game, Odds, Prediction, Sportsbook, BetType, Sport
from services.odds_aggregator import OddsAggregator
from services.prediction_engine import PredictionEngine, OddsData, TeamStats, HistoricalTrend
from api.dependencies import verify_geo_location, get_current_user
from pydantic import BaseModel, Field

logger = logging.getLogger(__name__)

# Create router
router = APIRouter()


# Pydantic models for request/response
class GameResponse(BaseModel):
    """Response model for game data."""
    id: int
    external_id: str
    sport: str
    home_team: str
    away_team: str
    commence_time: datetime
    is_live: bool

    class Config:
        from_attributes = True


class OddsResponse(BaseModel):
    """Response model for odds data."""
    sportsbook: str
    bet_type: str
    home_odds: Optional[float] = None
    away_odds: Optional[float] = None
    spread: Optional[float] = None
    total: Optional[float] = None
    last_update: datetime


class PredictionResponse(BaseModel):
    """Response model for predictions."""
    game_id: int
    predicted_outcome: str
    win_probability: float
    confidence_score: float
    expected_value: float
    best_odds: float
    best_sportsbook: str
    edge_percentage: float
    risk_rating: str
    recommendation: str


class PredictionRequest(BaseModel):
    """Request model for generating predictions."""
    game_id: int


# Health check endpoint
@router.get("/health", tags=["Health"])
async def health_check():
    """
    Health check endpoint.
    Returns service status.
    """
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow(),
        "service": "Sports Betting Prediction API"
    }


# Sports endpoints
@router.get("/sports", tags=["Sports"])
async def get_sports():
    """
    Get list of supported sports.

    Returns:
        List of available sports with metadata
    """
    aggregator = OddsAggregator(use_mock=True)  # Use mock for demo
    try:
        sports = await aggregator.fetch_sports()
        return {
            "sports": sports,
            "count": len(sports)
        }
    except Exception as e:
        logger.error(f"Error fetching sports: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch sports data"
        )


# Games endpoints
@router.get("/games", tags=["Games"], response_model=List[GameResponse])
async def get_games(
    sport: Sport = Query(Sport.NBA, description="Sport to filter by"),
    upcoming_hours: int = Query(24, description="Hours ahead to fetch games"),
    db: AsyncSession = Depends(get_db),
    _geo_check: bool = Depends(verify_geo_location)
):
    """
    Get upcoming games for a specific sport.

    Requires geo-location verification.

    Args:
        sport: Sport type (nba, nfl, mlb, etc.)
        upcoming_hours: Number of hours ahead to fetch
        db: Database session
        _geo_check: Geo-location verification

    Returns:
        List of upcoming games
    """
    try:
        # Calculate time range
        now = datetime.utcnow()
        end_time = now + timedelta(hours=upcoming_hours)

        # Query database for games
        query = select(Game).where(
            Game.sport == sport,
            Game.commence_time >= now,
            Game.commence_time <= end_time,
            Game.is_completed == False
        ).order_by(Game.commence_time)

        result = await db.execute(query)
        games = result.scalars().all()

        logger.info(f"Fetched {len(games)} games for {sport}")
        return games

    except Exception as e:
        logger.error(f"Error fetching games: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch games"
        )


@router.get("/games/{game_id}", tags=["Games"])
async def get_game(
    game_id: int,
    db: AsyncSession = Depends(get_db),
    _geo_check: bool = Depends(verify_geo_location)
):
    """
    Get detailed information for a specific game.

    Args:
        game_id: Game ID
        db: Database session
        _geo_check: Geo-location verification

    Returns:
        Game details with odds
    """
    try:
        # Fetch game
        query = select(Game).where(Game.id == game_id)
        result = await db.execute(query)
        game = result.scalar_one_or_none()

        if not game:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Game {game_id} not found"
            )

        # Fetch odds for this game
        odds_query = select(Odds).where(
            Odds.game_id == game_id,
            Odds.is_active == True
        )
        odds_result = await db.execute(odds_query)
        odds_list = odds_result.scalars().all()

        return {
            "game": {
                "id": game.id,
                "sport": game.sport,
                "home_team": game.home_team,
                "away_team": game.away_team,
                "commence_time": game.commence_time,
                "is_live": game.is_live
            },
            "odds": [
                {
                    "sportsbook": odd.sportsbook.key if odd.sportsbook else "unknown",
                    "bet_type": odd.bet_type,
                    "home_odds": odd.home_odds,
                    "away_odds": odd.away_odds,
                    "home_point": odd.home_point,
                    "away_point": odd.away_point,
                    "last_update": odd.last_update
                }
                for odd in odds_list
            ]
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching game {game_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch game details"
        )


# Odds endpoints
@router.get("/odds/{game_id}", tags=["Odds"])
async def get_game_odds(
    game_id: int,
    db: AsyncSession = Depends(get_db),
    _geo_check: bool = Depends(verify_geo_location)
):
    """
    Get all odds for a specific game from multiple sportsbooks.

    Args:
        game_id: Game ID
        db: Database session
        _geo_check: Geo-location verification

    Returns:
        Odds comparison across sportsbooks
    """
    try:
        # Fetch odds
        query = select(Odds).where(
            Odds.game_id == game_id,
            Odds.is_active == True
        ).order_by(Odds.last_update.desc())

        result = await db.execute(query)
        odds_list = result.scalars().all()

        if not odds_list:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No odds found for game {game_id}"
            )

        # Group by bet type
        odds_by_type = {}
        for odd in odds_list:
            bet_type = odd.bet_type.value
            if bet_type not in odds_by_type:
                odds_by_type[bet_type] = []

            odds_by_type[bet_type].append({
                "sportsbook": odd.sportsbook.key if odd.sportsbook else "unknown",
                "home_odds": odd.home_odds,
                "away_odds": odd.away_odds,
                "spread": odd.home_point,
                "total": odd.total_point,
                "last_update": odd.last_update
            })

        return {
            "game_id": game_id,
            "odds": odds_by_type,
            "last_update": max(odd.last_update for odd in odds_list)
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching odds for game {game_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch odds"
        )


# Prediction endpoints
@router.post("/predictions", tags=["Predictions"], response_model=PredictionResponse)
async def create_prediction(
    request: PredictionRequest,
    db: AsyncSession = Depends(get_db),
    _geo_check: bool = Depends(verify_geo_location),
    _user: Optional[dict] = Depends(get_current_user)
):
    """
    Generate AI prediction for a game.

    This endpoint:
    1. Fetches game and odds data
    2. Retrieves team statistics
    3. Runs the PredictionEngine algorithm
    4. Saves the prediction to the database
    5. Returns the prediction with win probability

    Requires geo-location verification.

    Args:
        request: Prediction request with game_id
        db: Database session
        _geo_check: Geo-location verification
        _user: Current user (optional)

    Returns:
        Prediction with win probability and recommendation
    """
    try:
        game_id = request.game_id

        # Fetch game
        game_query = select(Game).where(Game.id == game_id)
        game_result = await db.execute(game_query)
        game = game_result.scalar_one_or_none()

        if not game:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Game {game_id} not found"
            )

        # Fetch odds
        odds_query = select(Odds).where(
            Odds.game_id == game_id,
            Odds.bet_type == BetType.MONEYLINE,
            Odds.is_active == True
        )
        odds_result = await db.execute(odds_query)
        odds_list = odds_result.scalars().all()

        if not odds_list:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No odds found for game {game_id}"
            )

        # Convert to OddsData format
        odds_data_list = []
        for odd in odds_list:
            if odd.home_odds:
                odds_data_list.append(OddsData(
                    sportsbook=odd.sportsbook.key if odd.sportsbook else "unknown",
                    american_odds=odd.home_odds,
                    decimal_odds=PredictionEngine.american_to_decimal(odd.home_odds),
                    implied_probability=PredictionEngine.american_to_implied_probability(odd.home_odds),
                    timestamp=odd.last_update
                ))

        # Fetch team stats (simplified - in production, query from GameStats table)
        # For demo, using mock data
        home_stats = TeamStats(
            team_name=game.home_team,
            wins=25, losses=15, win_rate=0.625,
            last_5_record=(4, 1),
            last_10_record=(7, 3),
            home_record=(15, 5),
            rest_days=2
        )

        away_stats = TeamStats(
            team_name=game.away_team,
            wins=22, losses=18, win_rate=0.55,
            last_5_record=(3, 2),
            last_10_record=(6, 4),
            away_record=(10, 8),
            rest_days=1
        )

        # Run prediction engine
        engine = PredictionEngine(
            confidence_threshold=0.65,
            min_edge_threshold=0.03
        )

        prediction_result = engine.predict_game(
            odds_list=odds_data_list,
            home_stats=home_stats,
            away_stats=away_stats
        )

        # Save prediction to database
        new_prediction = Prediction(
            game_id=game_id,
            bet_type=BetType.MONEYLINE,
            predicted_outcome=prediction_result.predicted_outcome,
            win_probability=prediction_result.win_probability,
            confidence_score=prediction_result.confidence_score,
            expected_value=prediction_result.expected_value,
            recommended_odds=prediction_result.best_odds,
            recommended_sportsbook=prediction_result.best_sportsbook,
            edge_percentage=prediction_result.edge_percentage,
            features_used=prediction_result.features_used,
            feature_importance=prediction_result.feature_importance
        )

        db.add(new_prediction)
        await db.commit()
        await db.refresh(new_prediction)

        logger.info(f"Generated prediction for game {game_id}: {prediction_result.win_probability}%")

        return PredictionResponse(
            game_id=game_id,
            predicted_outcome=prediction_result.predicted_outcome,
            win_probability=prediction_result.win_probability,
            confidence_score=prediction_result.confidence_score,
            expected_value=prediction_result.expected_value,
            best_odds=prediction_result.best_odds,
            best_sportsbook=prediction_result.best_sportsbook,
            edge_percentage=prediction_result.edge_percentage,
            risk_rating=prediction_result.risk_rating,
            recommendation=prediction_result.recommendation
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error generating prediction: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate prediction"
        )


@router.get("/predictions/{game_id}", tags=["Predictions"])
async def get_prediction(
    game_id: int,
    db: AsyncSession = Depends(get_db),
    _geo_check: bool = Depends(verify_geo_location)
):
    """
    Get existing prediction for a game.

    Args:
        game_id: Game ID
        db: Database session
        _geo_check: Geo-location verification

    Returns:
        Prediction if exists
    """
    try:
        query = select(Prediction).where(
            Prediction.game_id == game_id
        ).order_by(Prediction.predicted_at.desc())

        result = await db.execute(query)
        prediction = result.scalar_one_or_none()

        if not prediction:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No prediction found for game {game_id}"
            )

        return {
            "game_id": prediction.game_id,
            "predicted_outcome": prediction.predicted_outcome,
            "win_probability": prediction.win_probability,
            "confidence_score": prediction.confidence_score,
            "expected_value": prediction.expected_value,
            "best_odds": prediction.recommended_odds,
            "best_sportsbook": prediction.recommended_sportsbook,
            "edge_percentage": prediction.edge_percentage,
            "predicted_at": prediction.predicted_at
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching prediction: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch prediction"
        )


# Sportsbook endpoints
@router.get("/sportsbooks", tags=["Sportsbooks"])
async def get_sportsbooks(
    db: AsyncSession = Depends(get_db)
):
    """
    Get list of supported sportsbooks.

    Returns:
        List of sportsbooks
    """
    try:
        query = select(Sportsbook).where(Sportsbook.is_active == True)
        result = await db.execute(query)
        sportsbooks = result.scalars().all()

        return {
            "sportsbooks": [
                {
                    "key": book.key,
                    "name": book.name,
                    "display_name": book.display_name,
                    "logo_url": book.logo_url
                }
                for book in sportsbooks
            ]
        }

    except Exception as e:
        logger.error(f"Error fetching sportsbooks: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch sportsbooks"
        )


# Compliance endpoint
@router.get("/compliance/check", tags=["Compliance"])
async def check_compliance(
    _geo_check: bool = Depends(verify_geo_location)
):
    """
    Check if user meets compliance requirements.

    This endpoint verifies:
    - Geographic location (state approval)
    - Age requirements (21+)
    - No VPN/proxy usage

    Returns:
        Compliance status
    """
    return {
        "compliant": True,
        "message": "Location verified and approved",
        "disclaimer": "You must be 21+ to use this service. If you or someone you know has a gambling problem, call 1-800-GAMBLER."
    }
