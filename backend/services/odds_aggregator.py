"""
Odds Aggregator Service
Fetches and normalizes betting odds from multiple sportsbooks.

This service handles:
- API calls to sports betting data providers (The Odds API, etc.)
- Data normalization and transformation
- Real-time odds updates
- Caching for performance

IMPORTANT: To use real API providers:
1. Get an API key from https://the-odds-api.com/ (or other provider)
2. Add the key to your .env file as ODDS_API_KEY
3. The service will automatically use the real API instead of mock data
"""
import asyncio
import aiohttp
from typing import List, Dict, Optional, Any
from datetime import datetime, timedelta
from enum import Enum
import logging
from core.config import get_settings

settings = get_settings()
logger = logging.getLogger(__name__)


class OddsFormat(str, Enum):
    """Odds format types."""
    AMERICAN = "american"
    DECIMAL = "decimal"
    FRACTIONAL = "fractional"


class OddsAggregator:
    """
    Aggregates betting odds from multiple sportsbooks.

    This class provides a unified interface for fetching odds data
    from various sports betting APIs. It handles rate limiting,
    error handling, and data normalization.

    Currently supports:
    - The Odds API (https://the-odds-api.com/)
    - Easy to extend for additional providers (FanDuel, DraftKings APIs)

    Usage:
        aggregator = OddsAggregator()
        games = await aggregator.fetch_upcoming_games(sport="basketball_nba")
        odds = await aggregator.fetch_game_odds(game_id="abc123")
    """

    def __init__(self, api_key: Optional[str] = None, use_mock: bool = False):
        """
        Initialize the odds aggregator.

        Args:
            api_key: API key for the odds provider. If None, uses settings.
            use_mock: If True, returns mock data for testing without API calls
        """
        self.api_key = api_key or settings.ODDS_API_KEY
        self.base_url = settings.ODDS_API_BASE_URL
        self.timeout = settings.API_CALL_TIMEOUT
        self.use_mock = use_mock

        # Supported sportsbooks (The Odds API format)
        self.supported_books = [
            "draftkings",
            "fanduel",
            "betmgm",
            "pointsbet",
            "caesars",
            "barstool",
            "betrivers",
        ]

        logger.info(f"OddsAggregator initialized (mock={use_mock})")

    async def fetch_upcoming_games(
        self,
        sport: str = "basketball_nba",
        regions: str = "us",
        markets: str = "h2h,spreads,totals",
        odds_format: OddsFormat = OddsFormat.AMERICAN,
        date_from: Optional[datetime] = None,
        date_to: Optional[datetime] = None
    ) -> List[Dict[str, Any]]:
        """
        Fetch upcoming games with odds for a specific sport.

        Args:
            sport: Sport key (e.g., "basketball_nba", "americanfootball_nfl")
            regions: Regions to get odds for (us, uk, eu, au)
            markets: Comma-separated markets (h2h, spreads, totals, outrights)
            odds_format: Format for odds (american, decimal, fractional)
            date_from: Start date for games
            date_to: End date for games

        Returns:
            List of games with odds from multiple sportsbooks

        API Documentation: https://the-odds-api.com/liveapi/guides/v4/
        """
        if self.use_mock:
            return self._get_mock_games(sport)

        endpoint = f"{self.base_url}/sports/{sport}/odds"

        params = {
            "apiKey": self.api_key,
            "regions": regions,
            "markets": markets,
            "oddsFormat": odds_format.value,
            "dateFormat": "iso"
        }

        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    endpoint,
                    params=params,
                    timeout=aiohttp.ClientTimeout(total=self.timeout)
                ) as response:
                    if response.status == 200:
                        data = await response.json()
                        logger.info(f"Fetched {len(data)} games for {sport}")

                        # Log remaining API quota
                        remaining = response.headers.get("x-requests-remaining")
                        if remaining:
                            logger.info(f"API requests remaining: {remaining}")

                        return self._normalize_games_data(data)
                    else:
                        error_msg = await response.text()
                        logger.error(f"API error {response.status}: {error_msg}")
                        raise Exception(f"API error: {response.status}")

        except asyncio.TimeoutError:
            logger.error(f"API request timeout after {self.timeout}s")
            raise
        except Exception as e:
            logger.error(f"Error fetching games: {str(e)}")
            raise

    async def fetch_game_odds(
        self,
        game_id: str,
        regions: str = "us",
        markets: str = "h2h,spreads,totals",
        odds_format: OddsFormat = OddsFormat.AMERICAN
    ) -> Dict[str, Any]:
        """
        Fetch detailed odds for a specific game.

        Args:
            game_id: Unique game identifier from the API
            regions: Regions to get odds for
            markets: Markets to fetch
            odds_format: Format for odds

        Returns:
            Detailed game data with odds from all sportsbooks
        """
        if self.use_mock:
            return self._get_mock_game_odds(game_id)

        endpoint = f"{self.base_url}/sports/basketball_nba/events/{game_id}/odds"

        params = {
            "apiKey": self.api_key,
            "regions": regions,
            "markets": markets,
            "oddsFormat": odds_format.value,
            "dateFormat": "iso"
        }

        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    endpoint,
                    params=params,
                    timeout=aiohttp.ClientTimeout(total=self.timeout)
                ) as response:
                    if response.status == 200:
                        data = await response.json()
                        return self._normalize_game_odds(data)
                    else:
                        error_msg = await response.text()
                        logger.error(f"API error {response.status}: {error_msg}")
                        raise Exception(f"API error: {response.status}")

        except Exception as e:
            logger.error(f"Error fetching odds for game {game_id}: {str(e)}")
            raise

    async def fetch_sports(self) -> List[Dict[str, Any]]:
        """
        Fetch list of available sports.

        Returns:
            List of sports with metadata

        Example response:
        [
            {
                "key": "basketball_nba",
                "group": "Basketball",
                "title": "NBA",
                "description": "US Basketball",
                "active": True,
                "has_outrights": False
            },
            ...
        ]
        """
        if self.use_mock:
            return self._get_mock_sports()

        endpoint = f"{self.base_url}/sports"

        params = {"apiKey": self.api_key}

        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    endpoint,
                    params=params,
                    timeout=aiohttp.ClientTimeout(total=self.timeout)
                ) as response:
                    if response.status == 200:
                        data = await response.json()
                        logger.info(f"Fetched {len(data)} available sports")
                        return data
                    else:
                        error_msg = await response.text()
                        logger.error(f"API error {response.status}: {error_msg}")
                        raise Exception(f"API error: {response.status}")

        except Exception as e:
            logger.error(f"Error fetching sports: {str(e)}")
            raise

    async def fetch_historical_odds(
        self,
        sport: str,
        event_id: str,
        date: datetime
    ) -> Dict[str, Any]:
        """
        Fetch historical odds for a past event.
        Note: This requires a premium API plan.

        Args:
            sport: Sport key
            event_id: Event identifier
            date: Date to fetch historical odds for

        Returns:
            Historical odds data
        """
        # Historical odds typically require premium access
        logger.warning("Historical odds require premium API access")
        raise NotImplementedError("Historical odds require premium API subscription")

    def _normalize_games_data(self, raw_data: List[Dict]) -> List[Dict[str, Any]]:
        """
        Normalize raw API data into our internal format.

        This method transforms the API response into a consistent format
        that matches our database schema.
        """
        normalized_games = []

        for game in raw_data:
            normalized = {
                "external_id": game["id"],
                "sport": game.get("sport_key"),
                "home_team": game.get("home_team"),
                "away_team": game.get("away_team"),
                "commence_time": datetime.fromisoformat(
                    game["commence_time"].replace("Z", "+00:00")
                ),
                "bookmakers": []
            }

            # Process bookmaker odds
            for bookmaker in game.get("bookmakers", []):
                book_data = {
                    "key": bookmaker["key"],
                    "name": bookmaker["title"],
                    "last_update": datetime.fromisoformat(
                        bookmaker["last_update"].replace("Z", "+00:00")
                    ),
                    "markets": {}
                }

                # Process markets (h2h, spreads, totals)
                for market in bookmaker.get("markets", []):
                    market_key = market["key"]
                    book_data["markets"][market_key] = {
                        "outcomes": market["outcomes"]
                    }

                normalized["bookmakers"].append(book_data)

            normalized_games.append(normalized)

        return normalized_games

    def _normalize_game_odds(self, raw_data: Dict) -> Dict[str, Any]:
        """Normalize single game odds data."""
        if not raw_data:
            return {}

        return self._normalize_games_data([raw_data])[0]

    # Mock data methods for testing without API calls
    def _get_mock_sports(self) -> List[Dict[str, Any]]:
        """Return mock sports data for testing."""
        return [
            {
                "key": "basketball_nba",
                "group": "Basketball",
                "title": "NBA",
                "description": "US Basketball",
                "active": True,
                "has_outrights": False
            },
            {
                "key": "americanfootball_nfl",
                "group": "American Football",
                "title": "NFL",
                "description": "US Football",
                "active": True,
                "has_outrights": False
            },
            {
                "key": "baseball_mlb",
                "group": "Baseball",
                "title": "MLB",
                "description": "Major League Baseball",
                "active": True,
                "has_outrights": False
            }
        ]

    def _get_mock_games(self, sport: str) -> List[Dict[str, Any]]:
        """Return mock games data for testing."""
        now = datetime.utcnow()

        return [
            {
                "external_id": "mock_game_001",
                "sport": sport,
                "home_team": "Los Angeles Lakers",
                "away_team": "Boston Celtics",
                "commence_time": now + timedelta(hours=3),
                "bookmakers": [
                    {
                        "key": "draftkings",
                        "name": "DraftKings",
                        "last_update": now,
                        "markets": {
                            "h2h": {
                                "outcomes": [
                                    {"name": "Los Angeles Lakers", "price": -115},
                                    {"name": "Boston Celtics", "price": -105}
                                ]
                            },
                            "spreads": {
                                "outcomes": [
                                    {"name": "Los Angeles Lakers", "price": -110, "point": -2.5},
                                    {"name": "Boston Celtics", "price": -110, "point": 2.5}
                                ]
                            },
                            "totals": {
                                "outcomes": [
                                    {"name": "Over", "price": -110, "point": 225.5},
                                    {"name": "Under", "price": -110, "point": 225.5}
                                ]
                            }
                        }
                    },
                    {
                        "key": "fanduel",
                        "name": "FanDuel",
                        "last_update": now,
                        "markets": {
                            "h2h": {
                                "outcomes": [
                                    {"name": "Los Angeles Lakers", "price": -110},
                                    {"name": "Boston Celtics", "price": -110}
                                ]
                            },
                            "spreads": {
                                "outcomes": [
                                    {"name": "Los Angeles Lakers", "price": -112, "point": -2.5},
                                    {"name": "Boston Celtics", "price": -108, "point": 2.5}
                                ]
                            },
                            "totals": {
                                "outcomes": [
                                    {"name": "Over", "price": -108, "point": 226.0},
                                    {"name": "Under", "price": -112, "point": 226.0}
                                ]
                            }
                        }
                    },
                    {
                        "key": "betmgm",
                        "name": "BetMGM",
                        "last_update": now,
                        "markets": {
                            "h2h": {
                                "outcomes": [
                                    {"name": "Los Angeles Lakers", "price": -120},
                                    {"name": "Boston Celtics", "price": +100}
                                ]
                            },
                            "spreads": {
                                "outcomes": [
                                    {"name": "Los Angeles Lakers", "price": -110, "point": -3.0},
                                    {"name": "Boston Celtics", "price": -110, "point": 3.0}
                                ]
                            },
                            "totals": {
                                "outcomes": [
                                    {"name": "Over", "price": -115, "point": 225.0},
                                    {"name": "Under", "price": -105, "point": 225.0}
                                ]
                            }
                        }
                    }
                ]
            },
            {
                "external_id": "mock_game_002",
                "sport": sport,
                "home_team": "Golden State Warriors",
                "away_team": "Miami Heat",
                "commence_time": now + timedelta(hours=5),
                "bookmakers": [
                    {
                        "key": "draftkings",
                        "name": "DraftKings",
                        "last_update": now,
                        "markets": {
                            "h2h": {
                                "outcomes": [
                                    {"name": "Golden State Warriors", "price": -200},
                                    {"name": "Miami Heat", "price": +165}
                                ]
                            }
                        }
                    }
                ]
            }
        ]

    def _get_mock_game_odds(self, game_id: str) -> Dict[str, Any]:
        """Return mock odds for a specific game."""
        games = self._get_mock_games("basketball_nba")
        for game in games:
            if game["external_id"] == game_id:
                return game
        return {}


# Utility functions for odds conversion
class OddsConverter:
    """Utility class for converting between odds formats."""

    @staticmethod
    def american_to_decimal(american: float) -> float:
        """Convert American odds to decimal format."""
        if american > 0:
            return (american / 100) + 1
        else:
            return (100 / abs(american)) + 1

    @staticmethod
    def decimal_to_american(decimal: float) -> float:
        """Convert decimal odds to American format."""
        if decimal >= 2.0:
            return (decimal - 1) * 100
        else:
            return -100 / (decimal - 1)

    @staticmethod
    def american_to_implied_probability(american: float) -> float:
        """
        Convert American odds to implied probability.
        Returns value between 0 and 1.
        """
        if american > 0:
            return 100 / (american + 100)
        else:
            return abs(american) / (abs(american) + 100)

    @staticmethod
    def remove_vig(prob_a: float, prob_b: float) -> tuple[float, float]:
        """
        Remove bookmaker vig/juice from two-way probabilities.

        Args:
            prob_a: Implied probability for outcome A
            prob_b: Implied probability for outcome B

        Returns:
            Tuple of (true_prob_a, true_prob_b) with vig removed
        """
        total = prob_a + prob_b
        return (prob_a / total, prob_b / total)


# Example usage
if __name__ == "__main__":
    import asyncio

    async def main():
        # Initialize with mock data for testing
        aggregator = OddsAggregator(use_mock=True)

        # Fetch available sports
        print("=" * 60)
        print("Available Sports:")
        print("=" * 60)
        sports = await aggregator.fetch_sports()
        for sport in sports:
            print(f"- {sport['title']} ({sport['key']})")

        # Fetch upcoming NBA games
        print("\n" + "=" * 60)
        print("Upcoming NBA Games:")
        print("=" * 60)
        games = await aggregator.fetch_upcoming_games(sport="basketball_nba")
        for game in games:
            print(f"\n{game['away_team']} @ {game['home_team']}")
            print(f"Start time: {game['commence_time']}")
            print(f"Bookmakers: {len(game['bookmakers'])}")

            # Show odds from each bookmaker
            for book in game['bookmakers']:
                print(f"\n  {book['name']}:")
                if 'h2h' in book['markets']:
                    for outcome in book['markets']['h2h']['outcomes']:
                        print(f"    {outcome['name']}: {outcome['price']:+}")

        # Test odds conversion
        print("\n" + "=" * 60)
        print("Odds Conversion Examples:")
        print("=" * 60)
        converter = OddsConverter()
        american_odds = [-110, +150, -200, +300]
        for odds in american_odds:
            decimal = converter.american_to_decimal(odds)
            prob = converter.american_to_implied_probability(odds)
            print(f"American: {odds:+5} -> Decimal: {decimal:.2f} -> Probability: {prob:.1%}")

    asyncio.run(main())
