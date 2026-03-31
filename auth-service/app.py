from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
import os
import bcrypt
import jwt
import datetime
import time
from prometheus_flask_exporter import PrometheusMetrics

app = Flask(__name__)
CORS(app)
metrics = PrometheusMetrics(app)

# JWT Secret Key
SECRET_KEY = "your-secret-key"

# Function to establish DB connection with retry logic
def connect_to_db():
    db_user = os.getenv('POSTGRES_USER')
    db_password = os.getenv('POSTGRES_PASSWORD')
    db_host = os.getenv('POSTGRES_HOST')
    db_name = os.getenv('POSTGRES_DB')

    if not all([db_user, db_password, db_host, db_name]):
        raise Exception("Database environment variables are not fully set.")

    database_url = f"postgresql://{db_user}:{db_password}@{db_host}:5432/{db_name}"

    max_retries = 10
    retry_delay = 5  # seconds
    for attempt in range(max_retries):
        try:
            conn = psycopg2.connect(database_url)
            print("✅ Successfully connected to the database")
            return conn
        except psycopg2.OperationalError as e:
            print(f"❌ Failed to connect to DB (attempt {attempt + 1}/{max_retries}): {e}")
            if attempt < max_retries - 1:
                time.sleep(retry_delay)
            else:
                raise Exception("Could not connect to the database after maximum retries")

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
