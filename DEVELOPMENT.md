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

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
export POSTGRES_HOST=localhost
export POSTGRES_DB=gamehub
export POSTGRES_USER=user
export POSTGRES_PASSWORD=password

# Start the service
python app.py
```

#### 3. Game Service Setup
```bash
cd game-service

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables (same as auth service)
export POSTGRES_HOST=localhost
export POSTGRES_DB=gamehub
export POSTGRES_USER=user
export POSTGRES_PASSWORD=password

# Start the service
python app.py
```

#### 4. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

## 🧪 Testing the Application

### 1. Health Checks

Test if all services are running:

```bash
# Check Auth Service
curl http://localhost:8080/health || echo "Auth service not responding"

# Check Game Service  
curl http://localhost:8081/health || echo "Game service not responding"

# Check Frontend
curl http://localhost:3000 || echo "Frontend not responding"

# Check Database
docker exec gamehub-postgres pg_isready -U user -d gamehub
```

### 2. API Testing

#### Register a new user:
```bash
curl -X POST http://localhost:8080/register \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "testpass123"}'
```

#### Login:
```bash
curl -X POST http://localhost:8080/login \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "testpass123"}'
```

#### Test Game Service (requires JWT token from login):
```bash
# Replace YOUR_JWT_TOKEN with actual token from login response
curl -X GET http://localhost:8081/games \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 3. Database Testing

```bash
# Connect to database
docker exec -it gamehub-postgres psql -U user -d gamehub

# Check tables
\dt

# View users
SELECT * FROM users;

# Exit
\q
```

### 4. Frontend Testing

1. Open http://localhost:3000
2. Register a new account
3. Login with your credentials
4. Test game functionality
5. Check browser console for any errors

## 🐛 Troubleshooting

### Common Issues

#### PostgreSQL Connection Issues
```bash
# Check if PostgreSQL container is running
docker ps | grep gamehub-postgres

# Check PostgreSQL logs
docker logs gamehub-postgres

# Restart PostgreSQL
docker restart gamehub-postgres
```

#### Python Service Issues
```bash
# Check if virtual environment is activated
which python  # Should point to venv/bin/python

# Check environment variables
env | grep POSTGRES

# Check service logs
tail -f auth-service/app.log  # if logging is configured
```

#### Frontend Issues
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check for port conflicts
lsof -i :3000
```

#### Port Conflicts
```bash
# Check what's using the ports
lsof -i :3000  # Frontend
lsof -i :8080  # Auth Service
lsof -i :8081  # Game Service
lsof -i :5432  # PostgreSQL

# Kill processes if needed
kill -9 <PID>
```

## 🔧 Development Workflow

### Making Changes

1. **Backend Changes** (Python services):
   - Edit the code
   - Restart the service (Ctrl+C and run `python app.py` again)
   - Test the changes

2. **Frontend Changes** (React):
   - Edit the code
   - Changes are automatically reloaded in development mode
   - Check browser for updates

3. **Database Changes**:
   - Edit `init.sql`
   - Recreate the database:
     ```bash
     docker stop gamehub-postgres
     docker rm gamehub-postgres
     # Run the database setup again
     ```

### Environment Variables

The application uses these environment variables:

```bash
# Database Configuration
POSTGRES_HOST=localhost
POSTGRES_DB=gamehub
POSTGRES_USER=user
POSTGRES_PASSWORD=password

# Service Ports (default values)
AUTH_SERVICE_PORT=8080
GAME_SERVICE_PORT=8081
FRONTEND_PORT=3000
```

You can modify these in the `.env` file or export them directly.

## 📊 Monitoring and Metrics

The services include Prometheus metrics endpoints:

- Auth Service metrics: http://localhost:8080/metrics
- Game Service metrics: http://localhost:8081/metrics

## 🔄 CI/CD and Production

For production deployment, see the main [README.md](README.md) which covers:
- Docker image building
- Kubernetes deployment
- HTTPS setup with cert-manager
- Monitoring with kube-prometheus-stack

## 📝 Additional Resources

- [Kubernetes Course README](README.md) - Main course documentation
- [Module1/](Module1/) - Kubernetes basics and core concepts
- [manifests/](manifests/) - Kubernetes deployment manifests
- [configmaps/](configmaps/) - ConfigMap examples
- [volumes/](volumes/) - Volume examples
- [rbac/](rbac/) - RBAC examples

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally using this guide
5. Submit a pull request

For questions or issues, refer to the main course documentation or create an issue in the repository.