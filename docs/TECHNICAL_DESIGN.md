# Sports Betting Prediction App - Technical Design Document

## Executive Summary

This document outlines the technical architecture for a production-ready sports betting prediction application that aggregates odds from major sportsbooks and provides AI-driven betting analysis with win probability scores.

**Version**: 1.0.0
**Date**: November 2024
**Status**: Phase 1 Implementation Complete

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture Design](#architecture-design)
4. [Database Schema](#database-schema)
5. [AI Prediction Engine](#ai-prediction-engine)
6. [Data Ingestion Pipeline](#data-ingestion-pipeline)
7. [API Specification](#api-specification)
8. [Compliance & Security](#compliance--security)
9. [Deployment Strategy](#deployment-strategy)
10. [Scalability & Performance](#scalability--performance)

---

## 1. System Overview

### 1.1 Purpose

The Sports Betting Prediction App is an intelligent platform that:
- Aggregates real-time betting odds from multiple sportsbooks
- Analyzes odds value, team statistics, and historical trends
- Generates AI-powered predictions with win probability scores (0-100)
- Identifies positive expected value (+EV) betting opportunities
- Ensures regulatory compliance with geo-fencing

### 1.2 Key Features

- **Multi-Source Odds Aggregation**: DraftKings, FanDuel, BetMGM, Caesars, etc.
- **AI Scoring Algorithm**: Sophisticated prediction engine using weighted features
- **Real-Time Updates**: Odds refresh every 5 minutes
- **Bet Types Supported**: Moneyline, Spreads, Totals, Player Props, Parlays
- **Sports Coverage**: NBA, NFL, MLB, NHL, NCAAF, NCAAB, Soccer, UFC
- **Compliance**: Geo-fencing, age verification, responsible gaming tools
- **Modern UI**: Dark mode, glassmorphism design (frontend - Phase 2)

### 1.3 User Personas

- **Casual Bettors**: Seeking value picks and data-driven insights
- **Sharp Bettors**: Looking for +EV opportunities and line shopping
- **Daily Fantasy Players**: Transitioning to sports betting
- **Data Analysts**: Interested in trends and statistical analysis

---

## 2. Technology Stack

### 2.1 Backend Stack

| Component | Technology | Rationale |
|-----------|-----------|-----------|
| **Web Framework** | FastAPI 0.104+ | Modern, async, automatic API docs, type safety |
| **Language** | Python 3.11+ | Rich ecosystem for ML/data processing |
| **ORM** | SQLAlchemy 2.0 (async) | Industry standard, async support |
| **Database** | PostgreSQL 15+ | ACID compliance, JSON support, performance |
| **Caching** | Redis 7+ | Real-time odds caching, session management |
| **Task Queue** | Celery + Redis | Background jobs (data refresh, calculations) |
| **HTTP Client** | aiohttp | Async API calls to odds providers |

### 2.2 Data & AI Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Data Processing** | Pandas, NumPy | Statistical analysis, feature engineering |
| **Machine Learning** | scikit-learn | Prediction models, probability calculations |
| **Statistical Analysis** | SciPy | Advanced statistics, distributions |

### 2.3 Frontend Stack (Phase 2)

| Component | Technology |
|-----------|-----------|
| **Framework** | React 18+ with TypeScript |
| **Styling** | Tailwind CSS + Framer Motion |
| **State Management** | Zustand or React Query |
| **UI Design** | Dark mode with glassmorphism |

### 2.4 Infrastructure & DevOps

| Component | Technology |
|-----------|-----------|
| **Containerization** | Docker + Docker Compose |
| **Orchestration** | Kubernetes (production) |
| **CI/CD** | GitHub Actions |
| **Monitoring** | Sentry, Prometheus, Grafana |
| **Cloud Provider** | AWS / GCP / Azure |

---

## 3. Architecture Design

### 3.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│  (React SPA with Dark Mode + Glassmorphism)                 │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTPS/REST
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    API GATEWAY / LOAD BALANCER               │
│              (NGINX / AWS ALB + Rate Limiting)               │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                     FASTAPI BACKEND                          │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │  API       │  │  Services  │  │  Utils     │            │
│  │  Routes    │──│  - Odds    │──│  - Geo     │            │
│  │            │  │  - AI      │  │  - Auth    │            │
│  └────────────┘  └────────────┘  └────────────┘            │
└──────────────┬───────────────────────────────┬──────────────┘
               │                               │
               ▼                               ▼
┌──────────────────────────┐    ┌──────────────────────────┐
│   PostgreSQL Database    │    │     Redis Cache          │
│  - Games                 │    │  - Odds (5 min TTL)      │
│  - Odds                  │    │  - Sessions              │
│  - Predictions           │    │  - Rate Limiting         │
│  - Users                 │    │                          │
└──────────────────────────┘    └──────────────────────────┘
               ▲
               │
┌──────────────┴───────────────────────────────────────────┐
│              BACKGROUND WORKERS (Celery)                  │
│  - Odds Refresh (every 5 min)                            │
│  - Stats Update (hourly)                                 │
│  - Historical Data (daily)                               │
│  - Model Retraining (weekly)                             │
└──────────────┬────────────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────────────┐
│               EXTERNAL DATA SOURCES                          │
│  - The Odds API (primary)                                   │
│  - Sportradar (alternative)                                 │
│  - Team Stats APIs                                          │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Request Flow

**User Prediction Request:**
1. Client sends GET /api/v1/games?sport=nba
2. API Gateway checks rate limits
3. FastAPI validates geo-location (state approval)
4. Backend queries Redis cache for games
5. If cache miss, query PostgreSQL
6. Return games with odds from multiple books
7. User selects game → POST /api/v1/predictions
8. Backend fetches odds + team stats
9. PredictionEngine runs algorithm
10. Save prediction to DB
11. Return JSON response with win probability

### 3.3 Data Flow

**Odds Aggregation Pipeline:**
```
External API → OddsAggregator → Normalization → PostgreSQL → Redis Cache
     ↓                                                          ↓
  5-minute                                              Client API
  Refresh                                               Requests
```

---

## 4. Database Schema

### 4.1 Schema Overview

The database uses PostgreSQL with the following core tables:

- **sportsbooks**: Bookmaker information
- **games**: Sporting events
- **odds**: Betting odds from each book
- **game_stats**: Team statistics
- **predictions**: AI-generated predictions
- **parlays**: Multi-leg bet combinations
- **users**: User accounts and preferences

### 4.2 Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│ Sportsbooks │       │    Games    │       │  GameStats  │
│─────────────│       │─────────────│       │─────────────│
│ id (PK)     │       │ id (PK)     │       │ id (PK)     │
│ key         │       │ external_id │       │ game_id (FK)│
│ name        │◄─────┐│ sport       │───────►│ team        │
│ is_active   │      ││ home_team   │       │ wins/losses │
└─────────────┘      ││ away_team   │       │ advanced_stats│
                     ││ commence_time│       └─────────────┘
                     │└─────────────┘
                     │       │
                     │       │
                ┌────▼───────▼──┐
                │     Odds      │
                │───────────────│
                │ id (PK)       │
                │ game_id (FK)  │
                │ sportsbook_id │
                │ bet_type      │
                │ home_odds     │
                │ away_odds     │
                │ spread/total  │
                └───────┬───────┘
                        │
                        │
                ┌───────▼────────┐
                │  Predictions   │
                │────────────────│
                │ id (PK)        │
                │ game_id (FK)   │
                │ win_probability│
                │ confidence     │
                │ expected_value │
                │ recommendation │
                └────────────────┘
```

### 4.3 Key Tables

#### sportsbooks
```sql
CREATE TABLE sportsbooks (
    id SERIAL PRIMARY KEY,
    key VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    logo_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### games
```sql
CREATE TABLE games (
    id SERIAL PRIMARY KEY,
    external_id VARCHAR(100) UNIQUE NOT NULL,
    sport VARCHAR(20) NOT NULL,
    home_team VARCHAR(100) NOT NULL,
    away_team VARCHAR(100) NOT NULL,
    commence_time TIMESTAMP NOT NULL,
    is_live BOOLEAN DEFAULT FALSE,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    INDEX idx_sport_time (sport, commence_time)
);
```

#### odds
```sql
CREATE TABLE odds (
    id SERIAL PRIMARY KEY,
    game_id INT REFERENCES games(id) ON DELETE CASCADE,
    sportsbook_id INT REFERENCES sportsbooks(id) ON DELETE CASCADE,
    bet_type VARCHAR(20) NOT NULL,
    home_odds FLOAT,
    away_odds FLOAT,
    home_point FLOAT,  -- Spread
    total_point FLOAT, -- O/U line
    last_update TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE(game_id, sportsbook_id, bet_type, market)
);
```

#### predictions
```sql
CREATE TABLE predictions (
    id SERIAL PRIMARY KEY,
    game_id INT REFERENCES games(id) ON DELETE CASCADE,
    predicted_outcome VARCHAR(200) NOT NULL,
    win_probability FLOAT NOT NULL,
    confidence_score FLOAT NOT NULL,
    expected_value FLOAT,
    recommended_odds FLOAT,
    recommended_sportsbook VARCHAR(50),
    edge_percentage FLOAT,
    features_used JSONB,
    predicted_at TIMESTAMP DEFAULT NOW(),
    INDEX idx_game_probability (game_id, win_probability)
);
```

### 4.4 Indexes

Critical indexes for performance:
- `idx_game_sport_time` on games(sport, commence_time)
- `idx_odds_game_book` on odds(game_id, sportsbook_id)
- `idx_odds_active` on odds(is_active, last_update)
- `idx_prediction_game_type` on predictions(game_id, bet_type)

---

## 5. AI Prediction Engine

### 5.1 Algorithm Overview

The `PredictionEngine` class implements a sophisticated multi-factor model that generates win probabilities by analyzing:

1. **Odds Value Analysis** (25% weight)
2. **Team Performance** (20% weight)
3. **Home/Away Advantage** (15% weight)
4. **Head-to-Head History** (12% weight)
5. **Advanced Metrics** (13% weight)
6. **Market Efficiency** (10% weight)
7. **Rest & Injuries** (5% weight)

### 5.2 Core Algorithm

**Input:**
- List of odds from multiple sportsbooks
- Home team statistics
- Away team statistics
- Historical trends (optional)

**Process:**
```python
1. Analyze Odds
   - Find best odds across books
   - Remove bookmaker vig/juice
   - Calculate market implied probability
   - Measure odds variance (market disagreement)

2. Analyze Teams
   - Calculate recent form scores (exponentially weighted)
   - Compute home/away advantage
   - Factor in head-to-head history
   - Analyze advanced metrics (offensive/defensive ratings)
   - Consider rest days and injury impact

3. Compute Probability
   - Start with market probability as baseline
   - Apply weighted adjustments from team analysis
   - Clamp to valid range [5%, 95%]

4. Calculate Confidence
   - More sportsbooks = higher confidence
   - Tighter odds (efficient market) = higher confidence
   - Strong form differential = higher confidence
   - Historical data available = higher confidence

5. Calculate Expected Value (EV)
   EV = (True Probability × Decimal Odds) - 1
   Positive EV indicates +EV bet

6. Assess Risk
   - Low confidence = higher risk
   - Small edge = higher risk
   - High variance = higher risk

7. Generate Recommendation
   - PASS if confidence < threshold
   - PASS if negative EV
   - PASS if edge < minimum
   - STRONG BET / RECOMMENDED / SLIGHT LEAN based on EV and edge
```

**Output:**
```python
{
    "predicted_outcome": "Los Angeles Lakers Win",
    "win_probability": 62.5,  # 0-100 scale
    "confidence_score": 78.3,  # Model confidence
    "expected_value": 0.087,  # +8.7% EV
    "best_odds": -110,
    "best_sportsbook": "FanDuel",
    "edge_percentage": 5.2,  # 5.2% edge over market
    "risk_rating": "low",
    "recommendation": "RECOMMENDED - Moderate value, +8.7% EV, 5.2% edge"
}
```

### 5.3 Key Methods

**PredictionEngine class:**

```python
class PredictionEngine:
    def predict_game(odds_list, home_stats, away_stats, historical)
        # Main prediction method

    def _analyze_odds(odds_list)
        # Remove vig, find best odds

    def _analyze_teams(home_stats, away_stats, historical)
        # Calculate team strength differential

    def _compute_probability(odds_analysis, team_analysis)
        # Weighted feature model

    def _calculate_confidence(odds_analysis, team_analysis)
        # Confidence scoring

    def _calculate_expected_value(probability, odds)
        # EV calculation

    def _assess_risk(confidence, edge, variance)
        # Risk rating
```

### 5.4 Feature Engineering

**Team Form Score:**
```python
form_score = (
    overall_win_rate * 0.3 +
    last_5_win_rate * 0.5 +
    last_10_win_rate * 0.2
)
```

**Home Advantage:**
```python
home_advantage = (
    home_team_home_performance - home_team_avg +
    away_team_avg - away_team_away_performance
) / 2
```

**Probability Adjustment:**
```python
adjusted_prob = market_prob + (
    form_diff * 0.20 +
    home_adv * 0.15 +
    h2h_factor * 0.12 +
    advanced_diff * 0.13 +
    rest_injury * 0.05
)
```

### 5.5 Model Validation

**Backtesting Strategy:**
- Test on 90 days of historical data
- Compare predicted probabilities to actual outcomes
- Calculate Brier Score for calibration
- Measure ROI on recommended bets
- Adjust feature weights based on performance

**Success Metrics:**
- Brier Score < 0.20 (well-calibrated)
- Recommended bets: >52.4% win rate (to beat -110 juice)
- +EV bets: Positive long-term ROI
- Confidence correlation: High confidence = higher accuracy

---

## 6. Data Ingestion Pipeline

### 6.1 OddsAggregator Service

**Purpose**: Fetch and normalize odds from multiple providers

**Primary Provider**: The Odds API (https://the-odds-api.com/)

**Key Features:**
- Async API calls with aiohttp
- Rate limiting and quota management
- Automatic retry with exponential backoff
- Data normalization to internal format
- Error handling and fallback mechanisms

### 6.2 API Integration

**The Odds API Endpoints:**

```python
# Fetch available sports
GET /sports
Response: List of sports with keys

# Fetch upcoming games with odds
GET /sports/{sport}/odds
Params:
  - regions: us, uk, eu, au
  - markets: h2h, spreads, totals
  - oddsFormat: american, decimal
  - apiKey: your_api_key

Response: Games with bookmaker odds
```

**Example Usage:**

```python
aggregator = OddsAggregator(api_key="your_key")

# Fetch NBA games
games = await aggregator.fetch_upcoming_games(
    sport="basketball_nba",
    regions="us",
    markets="h2h,spreads,totals"
)

# Returns normalized format:
{
    "external_id": "abc123",
    "home_team": "Lakers",
    "away_team": "Celtics",
    "commence_time": "2024-01-15T19:00:00Z",
    "bookmakers": [
        {
            "key": "draftkings",
            "name": "DraftKings",
            "markets": {
                "h2h": {
                    "outcomes": [
                        {"name": "Lakers", "price": -110},
                        {"name": "Celtics", "price": -110}
                    ]
                }
            }
        }
    ]
}
```

### 6.3 Data Refresh Strategy

**Background Tasks (Celery):**

| Task | Frequency | Purpose |
|------|-----------|---------|
| `refresh_odds` | 5 minutes | Update real-time odds |
| `refresh_games` | 1 hour | Fetch new upcoming games |
| `update_stats` | 1 hour | Update team statistics |
| `historical_sync` | 24 hours | Sync completed games |
| `cleanup_old_data` | 24 hours | Archive old predictions |

**Celery Configuration:**

```python
# celery_app.py
from celery import Celery
from celery.schedules import crontab

app = Celery('sports_betting')

app.conf.beat_schedule = {
    'refresh-odds': {
        'task': 'tasks.refresh_odds',
        'schedule': 300.0,  # 5 minutes
    },
    'refresh-games': {
        'task': 'tasks.refresh_games',
        'schedule': 3600.0,  # 1 hour
    },
}
```

### 6.4 Switching to Real API

**Steps to use real data:**

1. Sign up at https://the-odds-api.com/
2. Get API key (free tier: 500 requests/month)
3. Add to `.env` file:
   ```
   ODDS_API_KEY=your_actual_api_key_here
   ```
4. Update OddsAggregator initialization:
   ```python
   aggregator = OddsAggregator(use_mock=False)
   ```

**Alternative Providers:**

- **Sportradar**: Enterprise-grade, very comprehensive
- **Odds Shark API**: Consumer-friendly
- **RapidAPI Sports Odds**: Multiple providers aggregated

---

## 7. API Specification

### 7.1 Base URL

```
Production: https://api.sportspredictions.com/api/v1
Development: http://localhost:8000/api/v1
```

### 7.2 Authentication

Phase 1: No auth required for read-only endpoints
Phase 2: JWT tokens for authenticated users

```http
Authorization: Bearer {jwt_token}
```

### 7.3 Core Endpoints

#### Get Available Sports
```http
GET /sports

Response 200:
{
    "sports": [
        {
            "key": "basketball_nba",
            "title": "NBA",
            "group": "Basketball",
            "active": true
        }
    ],
    "count": 8
}
```

#### Get Upcoming Games
```http
GET /games?sport=nba&upcoming_hours=24

Response 200:
[
    {
        "id": 1,
        "external_id": "game_abc123",
        "sport": "nba",
        "home_team": "Los Angeles Lakers",
        "away_team": "Boston Celtics",
        "commence_time": "2024-01-15T19:00:00Z",
        "is_live": false
    }
]
```

#### Get Game Odds
```http
GET /odds/{game_id}

Response 200:
{
    "game_id": 1,
    "odds": {
        "moneyline": [
            {
                "sportsbook": "draftkings",
                "home_odds": -115,
                "away_odds": -105
            },
            {
                "sportsbook": "fanduel",
                "home_odds": -110,
                "away_odds": -110
            }
        ],
        "spreads": [...],
        "totals": [...]
    },
    "last_update": "2024-01-15T18:30:00Z"
}
```

#### Generate Prediction
```http
POST /predictions
Content-Type: application/json

{
    "game_id": 1
}

Response 200:
{
    "game_id": 1,
    "predicted_outcome": "Los Angeles Lakers Win",
    "win_probability": 62.5,
    "confidence_score": 78.3,
    "expected_value": 0.087,
    "best_odds": -110,
    "best_sportsbook": "fanduel",
    "edge_percentage": 5.2,
    "risk_rating": "low",
    "recommendation": "RECOMMENDED - Moderate value, +8.7% EV"
}
```

#### Get Sportsbooks
```http
GET /sportsbooks

Response 200:
{
    "sportsbooks": [
        {
            "key": "draftkings",
            "name": "DraftKings",
            "logo_url": "https://..."
        }
    ]
}
```

#### Check Compliance
```http
GET /compliance/check

Response 200:
{
    "compliant": true,
    "message": "Location verified",
    "disclaimer": "Must be 21+..."
}

Response 451 (Unavailable For Legal Reasons):
{
    "error": "Location not approved",
    "message": "Service not available in CA",
    "approved_states": ["NJ", "PA", ...]
}
```

### 7.4 Error Responses

```json
{
    "error": "Error type",
    "message": "Human-readable message",
    "details": {...},
    "timestamp": "2024-01-15T19:00:00Z"
}
```

**Status Codes:**
- 200: Success
- 400: Bad Request
- 404: Not Found
- 451: Unavailable For Legal Reasons (geo-blocked)
- 429: Too Many Requests (rate limited)
- 500: Internal Server Error

---

## 8. Compliance & Security

### 8.1 Geo-Fencing

**Purpose**: Ensure users are in states where online sports betting is legal

**Implementation:**
- IP-based geolocation (MaxMind GeoIP2)
- State code verification
- VPN/Proxy detection
- Middleware enforcement on all betting endpoints

**Approved States (2024):**
NJ, PA, IN, WV, CO, TN, VA, IA, IL, MI, AZ, LA, NY, CT, KS, MD, OH, WY, MA

**Code Implementation:**

```python
@router.get("/games")
async def get_games(
    _geo_check: bool = Depends(verify_geo_location)
):
    # If user not in approved state, raises 451 error
    # before reaching this code
    ...
```

### 8.2 Age Verification

**Requirements:**
- Must be 21+ to access betting features
- Identity verification through third-party service
- Document upload (driver's license, etc.)

**Providers:**
- Jumio
- Onfido
- Trulioo

### 8.3 Responsible Gaming

**Features:**
- Deposit limits
- Time limits
- Self-exclusion options
- Problem gambling resources
- Cool-down periods

**Resources Displayed:**
- 1-800-GAMBLER helpline
- NCPGambling.org links
- Gamblers Anonymous information

### 8.4 Security Measures

**Data Protection:**
- HTTPS/TLS 1.3 for all connections
- Passwords hashed with bcrypt
- JWT tokens for authentication
- API rate limiting (60 requests/minute)
- SQL injection prevention (parameterized queries)
- XSS protection (input sanitization)

**Privacy:**
- GDPR compliance
- CCPA compliance
- Data retention policies
- User data deletion on request

---

## 9. Deployment Strategy

### 9.1 Docker Deployment

**docker-compose.yml:**

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql+asyncpg://user:pass@db:5432/sports_betting
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - db
      - redis

  db:
    image: postgres:15
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: sports_betting
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  celery_worker:
    build: ./backend
    command: celery -A celery_app worker -l info
    depends_on:
      - db
      - redis

  celery_beat:
    build: ./backend
    command: celery -A celery_app beat -l info
    depends_on:
      - redis

volumes:
  postgres_data:
```

### 9.2 Production Deployment

**Environment**: AWS / GCP / Azure

**Services Required:**
- EC2 / Compute Engine (API servers)
- RDS / Cloud SQL (PostgreSQL)
- ElastiCache (Redis)
- ALB / Load Balancer
- S3 / Cloud Storage (static assets)
- CloudWatch / Stackdriver (monitoring)

**Kubernetes Configuration:**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: sports-betting-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: sports-betting-api
  template:
    metadata:
      labels:
        app: sports-betting-api
    spec:
      containers:
      - name: api
        image: your-registry/sports-betting-api:latest
        ports:
        - containerPort: 8000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secrets
              key: url
```

### 9.3 CI/CD Pipeline

**GitHub Actions Workflow:**

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run tests
        run: pytest

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Build Docker image
        run: docker build -t api:latest .
      - name: Push to registry
        run: docker push your-registry/api:latest
      - name: Deploy to k8s
        run: kubectl apply -f k8s/
```

---

## 10. Scalability & Performance

### 10.1 Performance Targets

| Metric | Target |
|--------|--------|
| API Response Time | < 200ms (p95) |
| Database Query Time | < 50ms (p95) |
| Odds Refresh Latency | < 5 seconds |
| Concurrent Users | 10,000+ |
| Requests per Second | 1,000+ |

### 10.2 Caching Strategy

**Redis Cache Layers:**

1. **Odds Cache** (TTL: 5 minutes)
   - Key: `odds:{game_id}`
   - Value: JSON of all odds

2. **Games Cache** (TTL: 1 hour)
   - Key: `games:{sport}:{date}`
   - Value: List of games

3. **Predictions Cache** (TTL: 10 minutes)
   - Key: `prediction:{game_id}`
   - Value: Latest prediction

### 10.3 Database Optimization

**Strategies:**
- Connection pooling (20 connections)
- Read replicas for analytics queries
- Partitioning by date for odds/predictions tables
- Materialized views for aggregate statistics
- Periodic VACUUM and ANALYZE

### 10.4 Horizontal Scaling

**Stateless Design:**
- API servers are stateless
- Session data in Redis
- Easy to add more API instances
- Load balancer distributes traffic

**Auto-Scaling:**
- Scale API pods based on CPU (>70%)
- Scale Celery workers based on queue length
- Scale read replicas based on query load

---

## 11. Future Enhancements (Phase 2+)

### 11.1 Phase 2 Features

- [ ] Live betting odds and predictions
- [ ] Parlay builder with AI optimization
- [ ] User account system with JWT auth
- [ ] Bet tracking and portfolio management
- [ ] Email/SMS notifications for predictions
- [ ] Mobile app (React Native)

### 11.2 Phase 3 Features

- [ ] Machine learning model retraining pipeline
- [ ] Real-time WebSocket updates
- [ ] Social features (share predictions)
- [ ] Premium subscription tier
- [ ] White-label solution for sportsbooks
- [ ] Advanced analytics dashboard

### 11.3 Phase 4 Features

- [ ] AI chatbot for betting advice
- [ ] Integration with sportsbook APIs (direct betting)
- [ ] Predictive injury analysis
- [ ] Weather impact modeling
- [ ] Referee tendency analysis
- [ ] Arbitrage opportunity detection

---

## Appendix

### A. Glossary

- **American Odds**: Odds format with + and - (e.g., -110, +150)
- **Decimal Odds**: European format (e.g., 1.91, 2.50)
- **Vig/Juice**: Bookmaker's commission (typically ~4-5%)
- **Expected Value (EV)**: Average profit/loss per bet
- **+EV**: Positive expected value (profitable long-term)
- **Sharp**: Professional/experienced bettor
- **Public**: Casual/recreational bettor
- **Line Shopping**: Comparing odds across sportsbooks
- **Parlay**: Multi-leg bet (all must win)
- **Prop Bet**: Proposition bet on specific event

### B. API Provider Comparison

| Provider | Cost | Coverage | Data Quality | Rate Limits |
|----------|------|----------|--------------|-------------|
| The Odds API | $0-499/mo | Excellent | High | 500-10,000/mo |
| Sportradar | Enterprise | Extensive | Very High | Custom |
| BetConstruct | Enterprise | Global | High | Custom |

### C. Legal Resources

- **American Gaming Association**: https://www.americangaming.org/
- **Legal Sports Report**: https://www.legalsportsreport.com/
- **State Gambling Laws**: https://www.gambling.com/us/online-casinos/laws

### D. Responsible Gaming Organizations

- **National Council on Problem Gambling**: https://www.ncpgambling.org/
- **Gamblers Anonymous**: https://www.gamblersanonymous.org/
- **National Problem Gambling Helpline**: 1-800-522-4700

---

**End of Technical Design Document**

*This document is subject to updates as the system evolves. Last updated: November 2024*
