# app/api/stats.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import redis
import os
from dotenv import load_dotenv

from app.db.database import get_db
from app.models.user import User
from app.models.problem import Problem

load_dotenv()

# --- Redis Connection ---
# Ensure these environment variables are set in your .env file
REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = os.getenv("REDIS_PORT")
BATTLES_FOUGHT_KEY = os.getenv("BATTLES_FOUGHT_KEY", "battles_fought_counter")

try:
    redis_client = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, db=0, decode_responses=True)
    redis_client.ping()
    print("Successfully connected to Redis for stats.")
except redis.exceptions.ConnectionError as e:
    print(f"Could not connect to Redis: {e}")
    redis_client = None


router = APIRouter()

@router.get("/")
def get_application_stats(db: Session = Depends(get_db)):
    """
    Provides key statistics for the platform's homepage.
    """
    # 1. Get total registered users
    active_coders_count = db.query(User).count()

    # 2. Get total approved DSA problems
    dsa_problems_count = db.query(Problem).filter(Problem.status == 'approved').count()

    # 3. Get total battles fought from Redis
    battles_fought_count = 0
    if redis_client:
        battles_fought_count = int(redis_client.get(BATTLES_FOUGHT_KEY) or 0)

    return {
        "active_coders": active_coders_count,
        "battles_fought": battles_fought_count,
        "dsa_problems": dsa_problems_count,
    }