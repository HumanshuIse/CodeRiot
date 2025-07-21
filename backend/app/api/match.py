import redis
import uuid
import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.sql.expression import func

# Adjust these imports to match your project structure
from app.db.database import get_db
from app.models.problem import Problem  # Your existing Problem model
from app.schemas.problems import ProblemOut # Your existing Pydantic schema

# --- Redis Connection ---
# In a real app, configure these from environment variables
REDIS_HOST = "localhost"
REDIS_PORT = 6379
redis_client = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, db=0, decode_responses=True)

# --- Redis Keys (using constants is good practice) ---
MATCHMAKING_QUEUE_KEY = "matchmaking:queue"
USER_STATUS_KEY_PREFIX = "user:status:"
MATCH_DETAILS_KEY_PREFIX = "match:details:"

# --- FastAPI Router ---
router = APIRouter()

# --- Pydantic Models ---
from pydantic import BaseModel
from typing import Optional

class MatchStatusResponse(BaseModel):
    status: str # e.g., "waiting", "matched", "not_in_queue"
    match_id: Optional[str] = None
    problem: Optional[ProblemOut] = None # Uses your existing ProblemOut schema
    opponent_id: Optional[int] = None

# --- Helper Function ---
def get_random_approved_problem(db: Session) -> Problem:
    """
    Fetches a random problem from PostgreSQL that has the status 'approved'.
    This is the crucial link to your seeded data.
    """
    random_problem = db.query(Problem).filter(Problem.status == 'approved').order_by(func.random()).first()
    
    if not random_problem:
        raise HTTPException(status_code=500, detail="No approved problems available for matchmaking.")
    return random_problem


# --- API Endpoints ---

@router.post("/join/{user_id}")
async def join_matchmaking_queue(user_id: int, db: Session = Depends(get_db)):
    """
    Adds a user to the matchmaking queue and attempts to create a match.
    """
    try:
        # 1. Add user to the left of the list (acting as a queue)
        redis_client.lpush(MATCHMAKING_QUEUE_KEY, user_id)
        
        # 2. Set the user's status to 'waiting' in a separate key
        redis_client.set(f"{USER_STATUS_KEY_PREFIX}{user_id}", json.dumps({"status": "waiting"}))

        # 3. Check if there are enough players to form a match
        if redis_client.llen(MATCHMAKING_QUEUE_KEY) >= 2:
            # 4. Atomically pop two players from the right of the list (FIFO)
            player2_id = int(redis_client.rpop(MATCHMAKING_QUEUE_KEY))
            player1_id = int(redis_client.rpop(MATCHMAKING_QUEUE_KEY))

            # 5. Create a new match
            match_id = str(uuid.uuid4())
            problem = get_random_approved_problem(db)

            match_details = {
                "match_id": match_id,
                "player1_id": player1_id,
                "player2_id": player2_id,
                "problem_id": problem.id,
                "status": "active"
            }
            
            # 6. Store the match details in a Redis Hash for quick lookup
            redis_client.set(f"{MATCH_DETAILS_KEY_PREFIX}{match_id}", json.dumps(match_details))

            # 7. Update the status for both matched players
            player1_status = {"status": "matched", "match_id": match_id}
            player2_status = {"status": "matched", "match_id": match_id}
            redis_client.set(f"{USER_STATUS_KEY_PREFIX}{player1_id}", json.dumps(player1_status))
            redis_client.set(f"{USER_STATUS_KEY_PREFIX}{player2_id}", json.dumps(player2_status))
            
            return {"status": "match_created", "match_id": match_id}

        return {"status": "waiting_in_queue"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred during matchmaking: {str(e)}")


@router.get("/status/{user_id}", response_model=MatchStatusResponse)
async def get_match_status(user_id: int, db: Session = Depends(get_db)):
    """
    A pollable endpoint for the frontend to check a user's matchmaking status.
    """
    user_status_raw = redis_client.get(f"{USER_STATUS_KEY_PREFIX}{user_id}")
    
    if not user_status_raw:
        return {"status": "not_in_queue"}

    user_status = json.loads(user_status_raw)

    if user_status["status"] == "waiting":
        return {"status": "waiting"}
    
    if user_status["status"] == "matched":
        match_id = user_status.get("match_id")
        if not match_id:
            return {"status": "error_finding_match_details"}

        match_details_raw = redis_client.get(f"{MATCH_DETAILS_KEY_PREFIX}{match_id}")
        if not match_details_raw:
            return {"status": "error_finding_match_details"}
        
        match_details = json.loads(match_details_raw)
        
        # Fetch full problem details from PostgreSQL
        problem = db.query(Problem).filter(Problem.id == match_details["problem_id"]).first()
        if not problem:
             return {"status": "error_finding_problem_details"}

        # Determine who the opponent is
        opponent_id = match_details['player1_id'] if user_id == match_details['player2_id'] else match_details['player2_id']

        return {
            "status": "matched",
            "match_id": match_id,
            "problem": problem, # FastAPI automatically converts the model to your ProblemOut schema
            "opponent_id": opponent_id
        }
    
    return {"status": "unknown"}
