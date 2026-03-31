# GameHub Development Guide

This guide provides comprehensive instructions for setting up, running, and testing the GameHub application both locally and on Kubernetes.

## 🏗️ Architecture Overview

GameHub is a microservices-based gaming platform built with:

- **Frontend**: React.js application with Tailwind CSS
- **Auth Service**: Flask-based authentication service with JWT tokens
- **Game Service**: Flask-based game logic service
- **Database**: PostgreSQL for user data and game statistics
- **Monitoring**: Prometheus metrics integration

### Service Communication
```
Frontend (React:3000) 
    ↓
Auth Service (Flask:8080) ← → PostgreSQL (5432)
    ↓
Game Service (Flask:8081) ← → PostgreSQL (5432)
```

## 🚀 Local Development Setup

### Prerequisites

- **Python 3.7+** (with pip)
- **Node.js 16+** (with npm)
- **Docker** (for PostgreSQL)
- **Git**

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kubernetes-course-2025
   ```

2. **Start all services**
   ```bash
   chmod +x start-local.sh
   ./start-local.sh
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Auth Service: http://localhost:8080
   - Game Service: http://localhost:8081

4. **Stop all services**
   ```bash
   ./stop-local.sh
   ```

### Manual Setup (Step by Step)

#### 1. Database Setup
```bash
# Start PostgreSQL with Docker
docker run --name gamehub-postgres \
  -e POSTGRES_DB=gamehub \
  -e POSTGRES_USER=user \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:13

# Wait for PostgreSQL to start
sleep 10

# Initialize database
docker exec -i gamehub-postgres psql -U user -d gamehub < init.sql
```

#### 2. Auth Service Setup
```bash
cd auth-service
