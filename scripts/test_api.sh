#!/bin/bash

# API Testing Script
# Quick tests to verify the API is working

API_URL="http://localhost:8000"

echo "=========================================="
echo "API Testing Script"
echo "=========================================="
echo ""

# Test 1: Health Check
echo "Test 1: Health Check"
echo "GET $API_URL/health"
curl -s $API_URL/health | python3 -m json.tool
echo ""
echo ""

# Test 2: Get Sports
echo "Test 2: Get Available Sports"
echo "GET $API_URL/api/v1/sports"
curl -s $API_URL/api/v1/sports | python3 -m json.tool
echo ""
echo ""

# Test 3: Get Games
echo "Test 3: Get Upcoming NBA Games"
echo "GET $API_URL/api/v1/games?sport=nba"
curl -s "$API_URL/api/v1/games?sport=nba" | python3 -m json.tool
echo ""
echo ""

# Test 4: Get Sportsbooks
echo "Test 4: Get Sportsbooks"
echo "GET $API_URL/api/v1/sportsbooks"
curl -s $API_URL/api/v1/sportsbooks | python3 -m json.tool
echo ""
echo ""

# Test 5: Compliance Check
echo "Test 5: Compliance Check"
echo "GET $API_URL/api/v1/compliance/check"
curl -s $API_URL/api/v1/compliance/check | python3 -m json.tool
echo ""
echo ""

# Test 6: Legal Disclaimer
echo "Test 6: Legal Disclaimer"
echo "GET $API_URL/disclaimer"
curl -s $API_URL/disclaimer | python3 -m json.tool
echo ""
echo ""

echo "=========================================="
echo "All tests complete!"
echo "=========================================="
echo ""
echo "Visit http://localhost:8000/docs for interactive API documentation"
echo ""
