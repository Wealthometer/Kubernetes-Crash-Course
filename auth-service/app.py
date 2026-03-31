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
