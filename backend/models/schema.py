"""
Database Schema Models
Defines all SQLAlchemy models for the sports betting prediction app.
"""
from datetime import datetime
from typing import Optional
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, DateTime, Text,
    ForeignKey, Index, UniqueConstraint, JSON, Enum as SQLEnum
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from .database import Base


class BetType(str, enum.Enum):
    """Enumeration of bet types."""
    MONEYLINE = "moneyline"
    SPREAD = "spread"
    TOTALS = "totals"
    PROP = "prop"
    PARLAY = "parlay"


class Sport(str, enum.Enum):
    """Supported sports."""
    NFL = "nfl"
    NBA = "nba"
    MLB = "mlb"
    NHL = "nhl"
    NCAAF = "ncaaf"
    NCAAB = "ncaab"
    SOCCER = "soccer"
    UFC = "ufc"


class BetStatus(str, enum.Enum):
    """Status of a prediction."""
    PENDING = "pending"
    WON = "won"
    LOST = "lost"
    PUSH = "push"
    CANCELLED = "cancelled"


class Sportsbook(Base):
    """
    Represents a sportsbook/bookmaker (DraftKings, FanDuel, etc.).
    """
    __tablename__ = "sportsbooks"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String(50), unique=True, nullable=False, index=True)  # e.g., "draftkings"
    name = Column(String(100), nullable=False)  # e.g., "DraftKings"
    display_name = Column(String(100))
    logo_url = Column(String(255))
    website_url = Column(String(255))
    is_active = Column(Boolean, default=True, index=True)
    priority = Column(Integer, default=0)  # For sorting/display order

    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    odds = relationship("Odds", back_populates="sportsbook", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Sportsbook(id={self.id}, key='{self.key}', name='{self.name}')>"


class Game(Base):
    """
    Represents a sporting event/game.
    """
    __tablename__ = "games"

    id = Column(Integer, primary_key=True, index=True)
    external_id = Column(String(100), unique=True, nullable=False, index=True)  # ID from API
    sport = Column(SQLEnum(Sport), nullable=False, index=True)

    # Teams
    home_team = Column(String(100), nullable=False, index=True)
    away_team = Column(String(100), nullable=False, index=True)

    # Game details
    commence_time = Column(DateTime(timezone=True), nullable=False, index=True)
    venue = Column(String(200))
    league = Column(String(50))  # e.g., "NBA", "Premier League"
    season = Column(String(20))  # e.g., "2023-24"

    # Status
    is_live = Column(Boolean, default=False, index=True)
    is_completed = Column(Boolean, default=False, index=True)

    # Final score (populated after game completes)
    home_score = Column(Integer)
    away_score = Column(Integer)

    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    odds = relationship("Odds", back_populates="game", cascade="all, delete-orphan")
    predictions = relationship("Prediction", back_populates="game", cascade="all, delete-orphan")
    stats = relationship("GameStats", back_populates="game", cascade="all, delete-orphan")

    # Indexes for common queries
    __table_args__ = (
        Index('idx_game_sport_time', 'sport', 'commence_time'),
        Index('idx_game_teams', 'home_team', 'away_team'),
    )

    def __repr__(self):
        return f"<Game(id={self.id}, {self.away_team} @ {self.home_team}, {self.commence_time})>"


class Odds(Base):
    """
    Represents betting odds from a specific sportsbook for a game.
    Stores normalized odds data for different bet types.
    """
    __tablename__ = "odds"

    id = Column(Integer, primary_key=True, index=True)
    game_id = Column(Integer, ForeignKey("games.id", ondelete="CASCADE"), nullable=False, index=True)
    sportsbook_id = Column(Integer, ForeignKey("sportsbooks.id", ondelete="CASCADE"), nullable=False, index=True)

    # Bet type
    bet_type = Column(SQLEnum(BetType), nullable=False, index=True)
    market = Column(String(100), index=True)  # e.g., "h2h", "spreads", "player_props"

    # Odds data (stored as American odds)
    # For moneyline: home_odds, away_odds
    # For spreads: home_odds, away_odds, home_point, away_point
    # For totals: over_odds, under_odds, total_point
    home_odds = Column(Float)
    away_odds = Column(Float)
    draw_odds = Column(Float)  # For soccer

    home_point = Column(Float)  # Spread for home team
    away_point = Column(Float)  # Spread for away team

    total_point = Column(Float)  # Total points line
    over_odds = Column(Float)
    under_odds = Column(Float)

    # Prop bet specific fields
    prop_description = Column(Text)  # e.g., "LeBron James - Points"
    prop_player = Column(String(100))
    prop_line = Column(Float)
    prop_over_odds = Column(Float)
    prop_under_odds = Column(Float)

    # Metadata
    last_update = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    is_active = Column(Boolean, default=True, index=True)

    # Relationships
    game = relationship("Game", back_populates="odds")
    sportsbook = relationship("Sportsbook", back_populates="odds")

    # Ensure unique odds per game/sportsbook/market combination
    __table_args__ = (
        UniqueConstraint('game_id', 'sportsbook_id', 'bet_type', 'market', 'prop_description',
                        name='uq_odds_game_book_market'),
        Index('idx_odds_game_book', 'game_id', 'sportsbook_id'),
        Index('idx_odds_active', 'is_active', 'last_update'),
    )

    def __repr__(self):
        return f"<Odds(id={self.id}, game={self.game_id}, book={self.sportsbook_id}, type={self.bet_type})>"


class GameStats(Base):
    """
    Historical and current statistics for teams in a game.
    Used by the AI prediction engine.
    """
    __tablename__ = "game_stats"

    id = Column(Integer, primary_key=True, index=True)
    game_id = Column(Integer, ForeignKey("games.id", ondelete="CASCADE"), nullable=False, index=True)
    team = Column(String(100), nullable=False)  # Team name

    # General stats
    wins = Column(Integer, default=0)
    losses = Column(Integer, default=0)
    win_percentage = Column(Float)

    # Recent performance
    last_5_wins = Column(Integer, default=0)
    last_5_losses = Column(Integer, default=0)
    last_10_wins = Column(Integer, default=0)
    last_10_losses = Column(Integer, default=0)

    # Head-to-head stats
    h2h_wins = Column(Integer, default=0)
    h2h_losses = Column(Integer, default=0)

    # Sport-specific stats (stored as JSON for flexibility)
    advanced_stats = Column(JSON)  # e.g., {"offensive_rating": 112.5, "defensive_rating": 108.2}

    # Home/Away splits
    is_home = Column(Boolean, default=False)
    home_wins = Column(Integer, default=0)
    home_losses = Column(Integer, default=0)
    away_wins = Column(Integer, default=0)
    away_losses = Column(Integer, default=0)

    # Injuries/absences
    key_players_out = Column(JSON)  # List of injured players

    # Metadata
    stat_date = Column(DateTime(timezone=True), server_default=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    game = relationship("Game", back_populates="stats")

    __table_args__ = (
        Index('idx_stats_game_team', 'game_id', 'team'),
    )

    def __repr__(self):
        return f"<GameStats(id={self.id}, game={self.game_id}, team='{self.team}')>"


class Prediction(Base):
    """
    AI-generated predictions with win probability scores.
    Tracks model performance over time.
    """
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    game_id = Column(Integer, ForeignKey("games.id", ondelete="CASCADE"), nullable=False, index=True)

    # Prediction details
    bet_type = Column(SQLEnum(BetType), nullable=False)
    predicted_outcome = Column(String(200), nullable=False)  # e.g., "Home Win", "Over 225.5"
    win_probability = Column(Float, nullable=False, index=True)  # 0-100 score
    confidence_score = Column(Float, nullable=False)  # Model confidence

    # Recommended bet
    recommended_odds = Column(Float)  # Best odds found
    recommended_sportsbook = Column(String(50))
    expected_value = Column(Float)  # EV calculation

    # Edge analysis
    market_odds_average = Column(Float)  # Average odds across books
    edge_percentage = Column(Float)  # How much better than market

    # Model metadata
    model_version = Column(String(20), default="1.0")
    features_used = Column(JSON)  # Which features were used in prediction
    feature_importance = Column(JSON)  # Feature importance scores

    # Outcome tracking
    status = Column(SQLEnum(BetStatus), default=BetStatus.PENDING, index=True)
    actual_result = Column(String(200))
    profit_loss = Column(Float)  # If bet was made

    # Metadata
    predicted_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    resolved_at = Column(DateTime(timezone=True))

    # Relationships
    game = relationship("Game", back_populates="predictions")
    parlay_bets = relationship("ParlayBet", back_populates="prediction")

    __table_args__ = (
        Index('idx_prediction_game_type', 'game_id', 'bet_type'),
        Index('idx_prediction_probability', 'win_probability'),
        Index('idx_prediction_status_date', 'status', 'predicted_at'),
    )

    def __repr__(self):
        return f"<Prediction(id={self.id}, game={self.game_id}, prob={self.win_probability}%)>"


class Parlay(Base):
    """
    Represents a multi-leg parlay bet.
    """
    __tablename__ = "parlays"

    id = Column(Integer, primary_key=True, index=True)

    # Parlay details
    name = Column(String(200))  # User-defined name
    total_legs = Column(Integer, nullable=False)
    combined_odds = Column(Float, nullable=False)
    combined_probability = Column(Float, nullable=False)  # Product of all leg probabilities

    # Risk assessment
    risk_score = Column(Float)  # Overall risk rating
    expected_value = Column(Float)

    # Status
    status = Column(SQLEnum(BetStatus), default=BetStatus.PENDING, index=True)

    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    resolved_at = Column(DateTime(timezone=True))

    # Relationships
    bets = relationship("ParlayBet", back_populates="parlay", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Parlay(id={self.id}, legs={self.total_legs}, prob={self.combined_probability}%)>"


class ParlayBet(Base):
    """
    Individual leg within a parlay.
    Links predictions to parlays.
    """
    __tablename__ = "parlay_bets"

    id = Column(Integer, primary_key=True, index=True)
    parlay_id = Column(Integer, ForeignKey("parlays.id", ondelete="CASCADE"), nullable=False, index=True)
    prediction_id = Column(Integer, ForeignKey("predictions.id", ondelete="CASCADE"), nullable=False, index=True)

    leg_number = Column(Integer, nullable=False)  # Order in parlay

    # Relationships
    parlay = relationship("Parlay", back_populates="bets")
    prediction = relationship("Prediction", back_populates="parlay_bets")

    __table_args__ = (
        UniqueConstraint('parlay_id', 'prediction_id', name='uq_parlay_prediction'),
        Index('idx_parlay_leg', 'parlay_id', 'leg_number'),
    )

    def __repr__(self):
        return f"<ParlayBet(id={self.id}, parlay={self.parlay_id}, leg={self.leg_number})>"


class User(Base):
    """
    User model for authentication and personalization.
    Stores user preferences and location for geo-fencing.
    """
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    username = Column(String(100), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)

    # Profile
    full_name = Column(String(200))
    avatar_url = Column(String(255))

    # Geo-fencing & compliance
    state = Column(String(2), index=True)  # US state code
    ip_address = Column(String(45))  # For geo-verification
    is_verified = Column(Boolean, default=False)
    is_geo_approved = Column(Boolean, default=False, index=True)

    # Preferences
    favorite_sports = Column(JSON)  # List of preferred sports
    favorite_teams = Column(JSON)  # List of favorite teams
    risk_tolerance = Column(String(20), default="medium")  # low, medium, high

    # Account status
    is_active = Column(Boolean, default=True, index=True)
    is_superuser = Column(Boolean, default=False)

    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_login = Column(DateTime(timezone=True))

    def __repr__(self):
        return f"<User(id={self.id}, email='{self.email}', state='{self.state}')>"
