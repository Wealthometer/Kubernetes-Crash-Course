#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 GameHub Service Status Check${NC}"
echo "=================================="

# Check Docker
echo -e "\n${BLUE}Docker Status:${NC}"
if command -v docker >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Docker is installed${NC}"
    if docker ps >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Docker is running${NC}"
    else
        echo -e "${RED}❌ Docker is not running${NC}"
        echo -e "${YELLOW}💡 Please start Docker Desktop${NC}"
    fi
else
    echo -e "${RED}❌ Docker is not installed${NC}"
fi

# Check PostgreSQL Container
echo -e "\n${BLUE}PostgreSQL Status:${NC}"
