# app/routes/match.py
import asyncio
import redis
import uuid
from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect, status, Query
from sqlalchemy.orm import Session
from sqlalchemy.sql.expression import func

from app.db.database import get_db
from app.models.problem import Problem
from app.models.user import User # Import User model
from app.schemas.problems import ProblemOut
from app.core.websockets import manager
# --- NEW: Import security functions to validate the token ---
from app.core.security import ALGORITHM, SECRET_KEY
from jose import jwt, JWTError


# --- Connection and Redis setup... (no changes here) ---
REDIS_HOST = "localhost"
REDIS_PORT = 6379
redis_client = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, db=0, decode_responses=True)
MATCHMAKING_QUEUE_KEY = "matchmaking:queue"
router = APIRouter()


# --- NEW: Dependency function to authenticate WebSocket connections ---
async def get_user_from_token_ws(
    token: str = Query(...), 
    db: Session = Depends(get_db)
) -> User:
    """
    Decodes the JWT token from a query parameter to authenticate a WebSocket user.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("user_id")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
    return user


# --- Helper Functions (no changes here) ---
def get_random_approved_problem(db: Session) -> Problem:
    random_problem = db.query(Problem).filter(Problem.status == 'approved').order_by(func.random()).first()
    if not random_problem:
        print("CRITICAL: No approved problems available for matchmaking.")
        return None
    return random_problem

async def attempt_to_create_match(db: Session):
    """
    The core matchmaking logic. It now transforms the test case data structure
    to match the updated Pydantic schema before sending it.
    """
    with redis_client.pipeline() as pipe:
        try:
            pipe.watch(MATCHMAKING_QUEUE_KEY)
            queue_length = pipe.llen(MATCHMAKING_QUEUE_KEY)
            
            if queue_length < 2:
                pipe.unwatch()
                return

            pipe.multi()
            pipe.rpop(MATCHMAKING_QUEUE_KEY)
            pipe.rpop(MATCHMAKING_QUEUE_KEY)
            result = pipe.execute()
            
            if not result:
                return

            player1_id = int(result[0])
            player2_id = int(result[1])

            problem = get_random_approved_problem(db)
            if not problem:
                # Handle case where no problems are available
                redis_client.lpush(MATCHMAKING_QUEUE_KEY, player1_id, player2_id)
                error_msg = {"status": "error", "detail": "Matchmaking is temporarily unavailable."}
                await manager.send_personal_message(error_msg, player1_id)
                await manager.send_personal_message(error_msg, player2_id)
                return

            match_id = str(uuid.uuid4())
            
            # --- FIX DATA STRUCTURE MISMATCH ---
            # The database might store test_cases as {'sample': [...]}.
            # The ProblemOut schema now expects a simple list [...].
            # This check converts the old format to the new one before validation.
            if isinstance(problem.test_cases, dict):
                # For the coding challenge, we only send the sample cases.
                # The full set is used only during final submission.
                problem.test_cases = problem.test_cases.get('sample', [])

            # Prepare match details for each player
            def create_match_payload(p1, p2):
                return {
                    "status": "matched",
                    "match_id": match_id,
                    "problem": ProblemOut.from_orm(problem).model_dump(mode='json'),
                    "opponent_id": p2
                }

            # Notify both players with the match details
            await manager.send_personal_message(create_match_payload(player1_id, player2_id), player1_id)
            await manager.send_personal_message(create_match_payload(player2_id, player1_id), player2_id)

        except redis.exceptions.WatchError:
            return


# --- MODIFIED: WebSocket Endpoint with Authentication ---
@router.websocket("/ws/matchmaking")
async def matchmaking_websocket(
    websocket: WebSocket, 
    # The new dependency will handle authentication
    current_user: User = Depends(get_user_from_token_ws),
    db: Session = Depends(get_db)
):
    # The 'user_id' from the path is gone, we use the authenticated 'current_user.id'
    user_id = current_user.id
    await manager.connect(websocket, user_id)
    
    try:
        redis_client.lpush(MATCHMAKING_QUEUE_KEY, user_id)
        await manager.send_personal_message({"status": "waiting"}, user_id)
        await attempt_to_create_match(db)
        
        while True:
            # Keep the connection alive
            await websocket.receive_text()

    except WebSocketDisconnect:
        redis_client.lrem(MATCHMAKING_QUEUE_KEY, 0, user_id)
        manager.disconnect(user_id)
        print(f"User {user_id} disconnected and was removed from queue.")