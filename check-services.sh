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
if docker ps | grep -q gamehub-postgres; then
    echo -e "${GREEN}✅ PostgreSQL container is running${NC}"
    
    if docker exec gamehub-postgres pg_isready -U user -d gamehub >/dev/null 2>&1; then
        echo -e "${GREEN}✅ PostgreSQL is accepting connections${NC}"
    else
        echo -e "${YELLOW}⚠️  PostgreSQL is starting up...${NC}"
    fi
else
    echo -e "${RED}❌ PostgreSQL container not found${NC}"
    echo -e "${YELLOW}💡 Run './start-local.sh' to start services${NC}"
fi

# Check Ports
echo -e "\n${BLUE}Port Status:${NC}"
check_port() {
    local port=$1
    local service=$2
    
    if lsof -i :$port >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Port $port ($service) is in use${NC}"
    else
        echo -e "${RED}❌ Port $port ($service) is free${NC}"
    fi
}

check_port 3000 "Frontend"
check_port 8080 "Auth Service"
check_port 8081 "Game Service"
check_port 5432 "PostgreSQL"

# Check Service Responses
echo -e "\n${BLUE}Service Response Check:${NC}"
check_service() {
    local name=$1
    local url=$2
    
