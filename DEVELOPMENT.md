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
