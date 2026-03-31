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

    if not username or len(username) < 3:
        return jsonify({"error": "Username must be at least 3 characters long"}), 400
    if not password or len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters long"}), 400

    password_bytes = password.encode('utf-8')
    hashed = bcrypt.hashpw(password_bytes, bcrypt.gensalt())

    try:
        conn = connect_to_db()
        with conn:
            with conn.cursor() as cur:
                cur.execute(
                    "INSERT INTO users (username, password_hash) VALUES (%s, %s)",
                    (username, hashed)
                )
        return jsonify({"message": "User registered successfully"}), 201

    except psycopg2.IntegrityError:
        return jsonify({"error": "Username already exists"}), 409
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    password_bytes = password.encode('utf-8')

    try:
        conn = connect_to_db()
        with conn:
            with conn.cursor() as cur:
                cur.execute("SELECT * FROM users WHERE username = %s", (username,))
                user = cur.fetchone()
                if user:
                    stored_hash = user[2]
                    if isinstance(stored_hash, memoryview):
                        stored_hash = stored_hash.tobytes()
                    if bcrypt.checkpw(password_bytes, stored_hash):
                        token = jwt.encode({
                            'username': username,
                            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
                        }, SECRET_KEY, algorithm="HS256")
                        if isinstance(token, bytes):
                            token = token.decode('utf-8')
                        return jsonify({"token": token}), 200
                    else:
                        return jsonify({"error": "Invalid credentials"}), 401
                else:
                    return jsonify({"error": "User not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)

