"""
AI Prediction Engine
Sophisticated algorithm for analyzing betting value and generating win probability scores.

This engine uses a weighted feature approach combining:
- Odds analysis and value detection
- Team performance metrics
- Historical trends
- Market efficiency analysis
- Risk-adjusted probability calculations
"""
import numpy as np
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
from datetime import datetime, timedelta
from scipy import stats
import logging

logger = logging.getLogger(__name__)


@dataclass
class OddsData:
    """Normalized odds data from a sportsbook."""
    sportsbook: str
    american_odds: float  # American odds format (e.g., -110, +150)
    decimal_odds: float
    implied_probability: float
    timestamp: datetime


@dataclass
class TeamStats:
    """Team performance statistics."""
    team_name: str
    wins: int
    losses: int
    win_rate: float
    last_5_record: Tuple[int, int]  # (wins, losses)
    last_10_record: Tuple[int, int]
    home_record: Optional[Tuple[int, int]] = None
    away_record: Optional[Tuple[int, int]] = None
    head_to_head_record: Optional[Tuple[int, int]] = None

    # Advanced metrics (sport-specific, can be None)
    offensive_rating: Optional[float] = None
    defensive_rating: Optional[float] = None
    pace: Optional[float] = None
    rest_days: Optional[int] = None
    injuries_impact: Optional[float] = None  # 0-1 scale


@dataclass
class HistoricalTrend:
    """Historical betting performance data."""
    similar_matchups: int  # Number of similar historical games
    home_win_rate: float
    away_win_rate: float
    average_margin: float
    over_under_trend: Optional[float] = None


@dataclass
class PredictionResult:
    """Complete prediction output."""
    predicted_outcome: str
    win_probability: float  # 0-100
    confidence_score: float  # 0-100
    expected_value: float  # EV calculation
    best_odds: float
    best_sportsbook: str
    market_efficiency_score: float
    edge_percentage: float
    features_used: Dict[str, float]
    feature_importance: Dict[str, float]
    risk_rating: str  # "low", "medium", "high"
    recommendation: str  # Human-readable recommendation


class PredictionEngine:
    """
    Advanced AI Prediction Engine for sports betting analysis.

    This class implements a sophisticated multi-factor model that:
    1. Normalizes odds from multiple sportsbooks
    2. Calculates true probabilities adjusted for vig/juice
    3. Analyzes team performance and trends
    4. Computes expected value (EV) for value betting
    5. Generates confidence-weighted predictions

    Usage:
        engine = PredictionEngine(confidence_threshold=0.65)
        prediction = engine.predict_game(odds_list, home_stats, away_stats, historical)
    """

    def __init__(
        self,
        confidence_threshold: float = 0.65,
        min_edge_threshold: float = 0.03,  # Minimum 3% edge
        vig_adjustment: bool = True
    ):
        """
        Initialize the prediction engine.

        Args:
            confidence_threshold: Minimum confidence to recommend a bet (0-1)
            min_edge_threshold: Minimum edge over market to consider +EV
            vig_adjustment: Whether to remove bookmaker vig from probabilities
        """
        self.confidence_threshold = confidence_threshold
        self.min_edge_threshold = min_edge_threshold
        self.vig_adjustment = vig_adjustment

        # Feature weights (tuned through backtesting)
        # These can be adjusted based on historical performance
        self.feature_weights = {
            "odds_value": 0.25,          # Odds comparison across books
            "team_performance": 0.20,     # Recent form and win rate
            "home_advantage": 0.15,       # Home/away splits
            "head_to_head": 0.12,         # H2H historical record
            "advanced_metrics": 0.13,     # Sport-specific analytics
            "market_efficiency": 0.10,    # How efficient the market is
            "rest_injuries": 0.05         # Rest days and injuries
        }

        logger.info(f"PredictionEngine initialized with threshold={confidence_threshold}")

    def predict_game(
        self,
        odds_list: List[OddsData],
        home_stats: TeamStats,
        away_stats: TeamStats,
        historical: Optional[HistoricalTrend] = None,
        bet_type: str = "moneyline"
    ) -> PredictionResult:
        """
        Generate a complete prediction for a game.

        Args:
            odds_list: List of odds from different sportsbooks
            home_stats: Home team statistics
            away_stats: Away team statistics
            historical: Historical trend data
            bet_type: Type of bet ("moneyline", "spread", "totals")

        Returns:
            PredictionResult with win probability and recommendation
        """
        if not odds_list:
            raise ValueError("At least one odds source is required")

        # Step 1: Analyze odds and find best value
        odds_analysis = self._analyze_odds(odds_list)

        # Step 2: Calculate team strength differential
        team_analysis = self._analyze_teams(home_stats, away_stats, historical)

        # Step 3: Compute raw probability
        raw_probability = self._compute_probability(odds_analysis, team_analysis)

        # Step 4: Calculate confidence and expected value
        confidence = self._calculate_confidence(odds_analysis, team_analysis)
        ev = self._calculate_expected_value(raw_probability, odds_analysis["best_decimal_odds"])

        # Step 5: Determine market edge
        edge = raw_probability - odds_analysis["market_implied_probability"]

        # Step 6: Risk assessment
        risk_rating = self._assess_risk(confidence, edge, odds_analysis["odds_variance"])

        # Step 7: Generate recommendation
        recommendation = self._generate_recommendation(
            raw_probability, confidence, ev, edge, risk_rating
        )

        # Determine predicted outcome
        predicted_outcome = f"{home_stats.team_name} Win" if raw_probability > 50 else f"{away_stats.team_name} Win"

        # Compile features used
        features_used = {
            "home_win_rate": home_stats.win_rate,
            "away_win_rate": away_stats.win_rate,
            "home_last_5": home_stats.last_5_record[0] / 5,
            "away_last_5": away_stats.last_5_record[0] / 5,
            "odds_average": odds_analysis["average_american_odds"],
            "market_probability": odds_analysis["market_implied_probability"],
            "odds_variance": odds_analysis["odds_variance"],
        }

        return PredictionResult(
            predicted_outcome=predicted_outcome,
            win_probability=round(raw_probability, 2),
            confidence_score=round(confidence * 100, 2),
            expected_value=round(ev, 4),
            best_odds=odds_analysis["best_american_odds"],
            best_sportsbook=odds_analysis["best_sportsbook"],
            market_efficiency_score=round(odds_analysis["market_efficiency"], 2),
            edge_percentage=round(edge * 100, 2),
            features_used=features_used,
            feature_importance=self.feature_weights,
            risk_rating=risk_rating,
            recommendation=recommendation
        )

    def _analyze_odds(self, odds_list: List[OddsData]) -> Dict:
        """
        Analyze odds from multiple sportsbooks.
        Removes vig and identifies best value.
        """
        if not odds_list:
            raise ValueError("Empty odds list")

        # Find best odds (most favorable)
        best_odds = max(odds_list, key=lambda x: x.decimal_odds)

        # Calculate average market odds
        avg_decimal = np.mean([o.decimal_odds for o in odds_list])
        avg_american = self._decimal_to_american(avg_decimal)

        # Calculate implied probabilities
        implied_probs = [o.implied_probability for o in odds_list]

        # Remove vig if enabled (normalize probabilities)
        if self.vig_adjustment:
            total_prob = sum(implied_probs)
            vig_removed_probs = [p / total_prob for p in implied_probs]
            market_prob = np.mean(vig_removed_probs)
        else:
            market_prob = np.mean(implied_probs)

        # Calculate odds variance (market disagreement)
        odds_variance = np.std([o.decimal_odds for o in odds_list])

        # Market efficiency (lower variance = more efficient)
        # Efficient markets have less exploitable opportunities
        market_efficiency = 1.0 - min(odds_variance / avg_decimal, 0.5)

        return {
            "best_decimal_odds": best_odds.decimal_odds,
            "best_american_odds": best_odds.american_odds,
            "best_sportsbook": best_odds.sportsbook,
            "average_decimal_odds": avg_decimal,
            "average_american_odds": avg_american,
            "market_implied_probability": market_prob,
            "odds_variance": odds_variance,
            "market_efficiency": market_efficiency,
            "num_books": len(odds_list)
        }

    def _analyze_teams(
        self,
        home_stats: TeamStats,
        away_stats: TeamStats,
        historical: Optional[HistoricalTrend]
    ) -> Dict:
        """
        Analyze team performance and calculate strength differential.
        """
        # Recent form analysis (exponentially weighted)
        home_form = self._calculate_form_score(home_stats)
        away_form = self._calculate_form_score(away_stats)

        # Home/Away advantage
        home_advantage = self._calculate_home_advantage(home_stats, away_stats)

        # Head-to-head history
        h2h_factor = 0.5  # Neutral default
        if home_stats.head_to_head_record:
            h2h_wins, h2h_total = home_stats.head_to_head_record
            if h2h_total > 0:
                h2h_factor = h2h_wins / (h2h_wins + h2h_total)

        # Advanced metrics differential
        advanced_diff = 0.0
        if home_stats.offensive_rating and away_stats.defensive_rating:
            # Simplified rating differential
            home_net = (home_stats.offensive_rating or 100) - (away_stats.defensive_rating or 100)
            away_net = (away_stats.offensive_rating or 100) - (home_stats.defensive_rating or 100)
            advanced_diff = (home_net - away_net) / 20  # Normalize

        # Rest and injury factors
        rest_factor = self._calculate_rest_impact(home_stats, away_stats)
        injury_factor = self._calculate_injury_impact(home_stats, away_stats)

        # Historical trends
        historical_factor = 0.5
        if historical and historical.similar_matchups >= 10:
            historical_factor = historical.home_win_rate

        return {
            "home_form": home_form,
            "away_form": away_form,
            "form_differential": home_form - away_form,
            "home_advantage": home_advantage,
            "h2h_factor": h2h_factor,
            "advanced_differential": advanced_diff,
            "rest_factor": rest_factor,
            "injury_factor": injury_factor,
            "historical_factor": historical_factor
        }

    def _compute_probability(self, odds_analysis: Dict, team_analysis: Dict) -> float:
        """
        Compute win probability using weighted feature model.
        Returns probability as percentage (0-100).
        """
        # Start with market probability as baseline
        base_probability = odds_analysis["market_implied_probability"]

        # Adjust based on team analysis features
        adjustments = 0.0

        # Form differential adjustment
        form_adj = team_analysis["form_differential"] * self.feature_weights["team_performance"]
        adjustments += form_adj

        # Home advantage
        home_adj = team_analysis["home_advantage"] * self.feature_weights["home_advantage"]
        adjustments += home_adj

        # Head-to-head
        h2h_adj = (team_analysis["h2h_factor"] - 0.5) * self.feature_weights["head_to_head"]
        adjustments += h2h_adj

        # Advanced metrics
        adv_adj = team_analysis["advanced_differential"] * self.feature_weights["advanced_metrics"]
        adjustments += adv_adj

        # Rest and injuries
        rest_inj_adj = (team_analysis["rest_factor"] + team_analysis["injury_factor"]) * self.feature_weights["rest_injuries"]
        adjustments += rest_inj_adj

        # Historical trends
        hist_adj = (team_analysis["historical_factor"] - 0.5) * 0.1
        adjustments += hist_adj

        # Apply adjustments to base probability
        adjusted_probability = base_probability + adjustments

        # Clamp to valid range [0.05, 0.95] to avoid extreme predictions
        final_probability = np.clip(adjusted_probability, 0.05, 0.95)

        return final_probability * 100  # Convert to percentage

    def _calculate_confidence(self, odds_analysis: Dict, team_analysis: Dict) -> float:
        """
        Calculate confidence score (0-1) based on data quality and agreement.
        """
        confidence_factors = []

        # More sportsbooks = higher confidence in market odds
        book_confidence = min(odds_analysis["num_books"] / 10, 1.0)
        confidence_factors.append(book_confidence)

        # Market efficiency (tighter odds = clearer picture)
        confidence_factors.append(odds_analysis["market_efficiency"])

        # Strong form differential = higher confidence
        form_strength = abs(team_analysis["form_differential"])
        form_confidence = min(form_strength / 0.3, 1.0)  # Cap at 0.3 differential
        confidence_factors.append(form_confidence)

        # Historical data availability
        if team_analysis["historical_factor"] != 0.5:  # Has historical data
            confidence_factors.append(0.8)
        else:
            confidence_factors.append(0.5)

        # Aggregate confidence (weighted average)
        return np.mean(confidence_factors)

    def _calculate_expected_value(self, true_probability: float, decimal_odds: float) -> float:
        """
        Calculate Expected Value (EV).
        EV = (Probability × Decimal Odds) - 1
        Positive EV indicates a +EV bet.
        """
        true_prob_decimal = true_probability / 100
        ev = (true_prob_decimal * decimal_odds) - 1
        return ev

    def _calculate_form_score(self, stats: TeamStats) -> float:
        """
        Calculate recent form score (0-1) with exponential weighting.
        Recent games weighted more heavily.
        """
        # Overall win rate (base)
        overall = stats.win_rate * 0.3

        # Last 5 games (high weight)
        last_5_rate = stats.last_5_record[0] / 5 if stats.last_5_record else stats.win_rate
        last_5 = last_5_rate * 0.5

        # Last 10 games (medium weight)
        last_10_rate = stats.last_10_record[0] / 10 if stats.last_10_record else stats.win_rate
        last_10 = last_10_rate * 0.2

        return overall + last_5 + last_10

    def _calculate_home_advantage(self, home_stats: TeamStats, away_stats: TeamStats) -> float:
        """
        Calculate home court/field advantage.
        Returns value centered around 0 (negative favors away team).
        """
        home_adv = 0.0

        # Home team's home record
        if home_stats.home_record:
            home_wins, home_losses = home_stats.home_record
            if home_wins + home_losses > 0:
                home_rate = home_wins / (home_wins + home_losses)
                home_adv += (home_rate - home_stats.win_rate) * 0.5

        # Away team's away record
        if away_stats.away_record:
            away_wins, away_losses = away_stats.away_record
            if away_wins + away_losses > 0:
                away_rate = away_wins / (away_wins + away_losses)
                home_adv -= (away_rate - away_stats.win_rate) * 0.5

        # Standard home advantage if no data (typically ~3% in most sports)
        if home_adv == 0.0:
            home_adv = 0.03

        return home_adv

    def _calculate_rest_impact(self, home_stats: TeamStats, away_stats: TeamStats) -> float:
        """
        Calculate impact of rest days on performance.
        Returns value centered around 0.
        """
        if home_stats.rest_days is None or away_stats.rest_days is None:
            return 0.0

        # Optimal rest is 2-3 days; more or less can be negative
        def rest_score(days: int) -> float:
            if days < 1:
                return -0.05  # Back-to-back games
            elif days <= 3:
                return 0.02  # Optimal rest
            elif days <= 7:
                return 0.0   # Normal rest
            else:
                return -0.02  # Too much rest (rust)

        home_rest = rest_score(home_stats.rest_days)
        away_rest = rest_score(away_stats.rest_days)

        return home_rest - away_rest

    def _calculate_injury_impact(self, home_stats: TeamStats, away_stats: TeamStats) -> float:
        """
        Calculate impact of injuries on team performance.
        Returns value centered around 0.
        """
        home_impact = home_stats.injuries_impact or 0.0
        away_impact = away_stats.injuries_impact or 0.0

        # Negative injuries_impact means team is hurt
        return away_impact - home_impact  # Positive if home has advantage

    def _assess_risk(self, confidence: float, edge: float, variance: float) -> str:
        """
        Assess overall risk rating for the bet.
        """
        risk_score = 0

        # Low confidence = higher risk
        if confidence < 0.5:
            risk_score += 2
        elif confidence < 0.7:
            risk_score += 1

        # Small edge = higher risk
        if edge < self.min_edge_threshold:
            risk_score += 2
        elif edge < 0.05:
            risk_score += 1

        # High variance = higher risk (market uncertainty)
        if variance > 0.15:
            risk_score += 2
        elif variance > 0.08:
            risk_score += 1

        if risk_score >= 4:
            return "high"
        elif risk_score >= 2:
            return "medium"
        else:
            return "low"

    def _generate_recommendation(
        self,
        probability: float,
        confidence: float,
        ev: float,
        edge: float,
        risk: str
    ) -> str:
        """
        Generate human-readable betting recommendation.
        """
        if confidence < self.confidence_threshold:
            return "PASS - Insufficient confidence in prediction"

        if ev < 0:
            return "PASS - Negative expected value (-EV)"

        if edge < self.min_edge_threshold:
            return "PASS - No significant edge over market"

        # Positive EV and edge, calculate recommendation
        if ev > 0.10 and edge > 0.05 and risk == "low":
            return f"STRONG BET - High confidence ({confidence*100:.1f}%), +{ev*100:.1f}% EV, {edge*100:.1f}% edge"
        elif ev > 0.05 and edge > 0.03:
            return f"RECOMMENDED - Moderate value, +{ev*100:.1f}% EV, {edge*100:.1f}% edge"
        else:
            return f"SLIGHT LEAN - Small edge detected ({edge*100:.1f}%), proceed with caution"

    @staticmethod
    def _decimal_to_american(decimal_odds: float) -> float:
        """Convert decimal odds to American format."""
        if decimal_odds >= 2.0:
            return (decimal_odds - 1) * 100
        else:
            return -100 / (decimal_odds - 1)

    @staticmethod
    def american_to_decimal(american_odds: float) -> float:
        """Convert American odds to decimal format."""
        if american_odds > 0:
            return (american_odds / 100) + 1
        else:
            return (100 / abs(american_odds)) + 1

    @staticmethod
    def american_to_implied_probability(american_odds: float) -> float:
        """Convert American odds to implied probability (0-1)."""
        if american_odds > 0:
            return 100 / (american_odds + 100)
        else:
            return abs(american_odds) / (abs(american_odds) + 100)


# Example usage and testing
if __name__ == "__main__":
    # Example: Lakers vs Celtics prediction

    # Odds from different sportsbooks
    odds_list = [
        OddsData(
            sportsbook="DraftKings",
            american_odds=-115,
            decimal_odds=1.87,
            implied_probability=0.535,
            timestamp=datetime.now()
        ),
        OddsData(
            sportsbook="FanDuel",
            american_odds=-110,
            decimal_odds=1.91,
            implied_probability=0.524,
            timestamp=datetime.now()
        ),
        OddsData(
            sportsbook="BetMGM",
            american_odds=-120,
            decimal_odds=1.83,
            implied_probability=0.545,
            timestamp=datetime.now()
        ),
    ]

    # Home team (Lakers) stats
    home_stats = TeamStats(
        team_name="Los Angeles Lakers",
        wins=25,
        losses=15,
        win_rate=0.625,
        last_5_record=(4, 1),
        last_10_record=(7, 3),
        home_record=(15, 5),
        away_record=(10, 10),
        head_to_head_record=(2, 1),
        offensive_rating=115.3,
        defensive_rating=110.2,
        rest_days=2,
        injuries_impact=0.0
    )

    # Away team (Celtics) stats
    away_stats = TeamStats(
        team_name="Boston Celtics",
        wins=28,
        losses=12,
        win_rate=0.700,
        last_5_record=(3, 2),
        last_10_record=(6, 4),
        home_record=(16, 4),
        away_record=(12, 8),
        head_to_head_record=(1, 2),
        offensive_rating=118.1,
        defensive_rating=108.5,
        rest_days=1,
        injuries_impact=-0.05  # Key player injured
    )

    # Historical trends
    historical = HistoricalTrend(
        similar_matchups=15,
        home_win_rate=0.60,
        away_win_rate=0.40,
        average_margin=4.2
    )

    # Run prediction
    engine = PredictionEngine(confidence_threshold=0.65)
    result = engine.predict_game(odds_list, home_stats, away_stats, historical)

    print("=" * 60)
    print("PREDICTION RESULT")
    print("=" * 60)
    print(f"Predicted Outcome: {result.predicted_outcome}")
    print(f"Win Probability: {result.win_probability}%")
    print(f"Confidence Score: {result.confidence_score}%")
    print(f"Expected Value: {result.expected_value:+.2%}")
    print(f"Edge Over Market: {result.edge_percentage:+.2f}%")
    print(f"Best Odds: {result.best_odds} ({result.best_sportsbook})")
    print(f"Risk Rating: {result.risk_rating.upper()}")
    print(f"\nRecommendation: {result.recommendation}")
    print("=" * 60)
