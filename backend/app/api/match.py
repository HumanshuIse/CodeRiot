# app/routes/match.py
import asyncio
import redis
import uuid
import json
from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from sqlalchemy.sql.expression import func

from app.db.database import get_db
from app.models.problem import Problem
from app.schemas.problems import ProblemOut

# --- WebSocket Connection Manager ---
class ConnectionManager:
    def __init__(self):
        # Maps user_id to their active WebSocket
        self.active_connections: dict[int, WebSocket] = {}

    async def connect(self, websocket: WebSocket, user_id: int):
        await websocket.accept()
        self.active_connections[user_id] = websocket

    def disconnect(self, user_id: int):
        if user_id in self.active_connections:
            del self.active_connections[user_id]

    async def send_personal_message(self, message: dict, user_id: int):
        if user_id in self.active_connections:
            websocket = self.active_connections[user_id]
            await websocket.send_json(message)

manager = ConnectionManager()


# --- Redis Connection ---
REDIS_HOST = "localhost"
REDIS_PORT = 6379
redis_client = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, db=0, decode_responses=True)

# --- Redis Keys ---
MATCHMAKING_QUEUE_KEY = "matchmaking:queue"
# We no longer need USER_STATUS_KEY_PREFIX as we push updates directly

# --- FastAPI Router ---
router = APIRouter()

# --- Helper Functions ---
def get_random_approved_problem(db: Session) -> Problem:
    random_problem = db.query(Problem).filter(Problem.status == 'approved').order_by(func.random()).first()
    if not random_problem:
        # This is a server configuration issue, so we should handle it gracefully
        print("CRITICAL: No approved problems available for matchmaking.")
        return None
    return random_problem

async def attempt_to_create_match(db: Session):
    """
    The core matchmaking logic, now decoupled from a specific request.
    This function checks the queue and creates a match if possible.
    If a match is made, it notifies the two players via WebSockets.
    """
    with redis_client.pipeline() as pipe:
        try:
            pipe.watch(MATCHMAKING_QUEUE_KEY)
            queue_length = pipe.llen(MATCHMAKING_QUEUE_KEY)
            
            if queue_length < 2:
                pipe.unwatch()
                return

            pipe.multi()
            pipe.rpop(MATCHMAKING_QUEUE_KEY) # Player 1
            pipe.rpop(MATCHMAKING_QUEUE_KEY) # Player 2
            result = pipe.execute()
            
            if not result:
                return # WatchError, another process handled it.

            player1_id = int(result[0])
            player2_id = int(result[1])

            problem = get_random_approved_problem(db)
            if not problem:
                # If no problems, put users back in queue and notify them of server error
                redis_client.lpush(MATCHMAKING_QUEUE_KEY, player1_id, player2_id)
                error_msg = {"status": "error", "detail": "Matchmaking is temporarily unavailable."}
                await manager.send_personal_message(error_msg, player1_id)
                await manager.send_personal_message(error_msg, player2_id)
                return

            match_id = str(uuid.uuid4())
            
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
            # Another process handled the matchmaking, which is fine.
            return


# --- WebSocket Endpoint ---
# This single endpoint replaces both /join and /status
@router.websocket("/ws/matchmaking/{user_id}")
async def matchmaking_websocket(websocket: WebSocket, user_id: int, db: Session = Depends(get_db)):
    await manager.connect(websocket, user_id)
    
    try:
        # Add user to the Redis queue
        redis_client.lpush(MATCHMAKING_QUEUE_KEY, user_id)
        
        # Notify the user that they are in the queue
        await manager.send_personal_message({"status": "waiting"}, user_id)
        
        # Immediately attempt to create a match
        await attempt_to_create_match(db)
        
        # Keep the connection alive to receive disconnect messages
        while True:
            await websocket.receive_text()

    except WebSocketDisconnect:
        # If user disconnects, remove them from the queue and the connection manager
        redis_client.lrem(MATCHMAKING_QUEUE_KEY, 0, user_id)
        manager.disconnect(user_id)
        print(f"User {user_id} disconnected and was removed from queue.")