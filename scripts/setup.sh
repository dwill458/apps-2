#!/bin/bash

# Sports Betting Prediction App - Setup Script
# This script helps you get started quickly

set -e

echo "=========================================="
echo "Sports Betting Prediction App - Setup"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed${NC}"
    echo "Please install Docker first: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Error: Docker Compose is not installed${NC}"
    echo "Please install Docker Compose first: https://docs.docker.com/compose/install/"
    exit 1
fi

echo -e "${GREEN}✓ Docker is installed${NC}"
echo -e "${GREEN}✓ Docker Compose is installed${NC}"
echo ""

# Create .env file if it doesn't exist
if [ ! -f backend/.env ]; then
    echo -e "${YELLOW}Creating .env file from template...${NC}"
    cp backend/.env.example backend/.env
    echo -e "${GREEN}✓ .env file created${NC}"
    echo ""
    echo -e "${YELLOW}IMPORTANT: Edit backend/.env and add your API keys!${NC}"
    echo "Get an API key from: https://the-odds-api.com/"
    echo ""
    read -p "Press Enter to continue..."
else
    echo -e "${GREEN}✓ .env file already exists${NC}"
fi

echo ""
echo "=========================================="
echo "Starting Services"
echo "=========================================="
echo ""

# Build and start services
echo "Building Docker containers..."
docker-compose build

echo ""
echo "Starting services..."
docker-compose up -d

echo ""
echo "Waiting for services to be ready..."
sleep 10

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo -e "${GREEN}✓ Services are running${NC}"
else
    echo -e "${RED}✗ Some services failed to start${NC}"
    echo "Check logs with: docker-compose logs"
    exit 1
fi

echo ""
echo "=========================================="
echo "Setup Complete!"
echo "=========================================="
echo ""
echo -e "${GREEN}Your Sports Betting Prediction App is running!${NC}"
echo ""
echo "Access points:"
echo "  - API Documentation: http://localhost:8000/docs"
echo "  - API Root: http://localhost:8000/"
echo "  - Health Check: http://localhost:8000/health"
echo ""
echo "Useful commands:"
echo "  - View logs: docker-compose logs -f"
echo "  - Stop services: docker-compose down"
echo "  - Restart: docker-compose restart"
echo ""
echo "Next steps:"
echo "  1. Visit http://localhost:8000/docs to explore the API"
echo "  2. Try GET /api/v1/sports to see available sports"
echo "  3. Try GET /api/v1/games?sport=nba to see games"
echo "  4. Generate predictions with POST /api/v1/predictions"
echo ""
echo -e "${YELLOW}Remember: Update backend/.env with your real API key for production data${NC}"
echo ""
