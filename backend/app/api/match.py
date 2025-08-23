# app/routes/match.py
import asyncio
import redis
import uuid
from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect, status, Query
from sqlalchemy.orm import Session
from sqlalchemy.sql.expression import func
from pydantic import BaseModel
import os
from app.db.database import get_db
from app.models.problem import Problem
from app.models.user import User
from app.schemas.problems import ProblemOut
from app.core.websockets import manager
from app.core.security import get_current_user, ALGORITHM, SECRET_KEY
from jose import jwt, JWTError
from dotenv import load_dotenv
load_dotenv()

REDIS_HOST = os.getenv("REDIS_HOST")
REDIS_PORT = os.getenv("REDIS_PORT")
redis_client = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, db=0, decode_responses=True)
MATCHMAKING_QUEUE_KEY = os.getenv("MATCHMAKING_QUEUE_KEY")
router = APIRouter()

class QuitMatchRequest(BaseModel):
    match_id: str

async def get_user_from_token_ws(
    token: str = Query(...), 
    db: Session = Depends(get_db)
) -> User:
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

def get_random_approved_problem(db: Session) -> Problem:
    random_problem = db.query(Problem).filter(Problem.status == 'approved').order_by(func.random()).first()
    if not random_problem:
        print("CRITICAL: No approved problems available for matchmaking.")
        return None
    return random_problem

async def attempt_to_create_match(db: Session):
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
                redis_client.lpush(MATCHMAKING_QUEUE_KEY, player1_id, player2_id)
                error_msg = {"status": "error", "detail": "Matchmaking is temporarily unavailable."}
                await manager.send_personal_message(error_msg, player1_id)
                await manager.send_personal_message(error_msg, player2_id)
                return

            match_id = str(uuid.uuid4())
            match_key = f"match:{match_id}"
            redis_client.hmset(match_key, {"player1": player1_id, "player2": player2_id})
            redis_client.expire(match_key, 7200) # Expire after 2 hours
            
            if isinstance(problem.test_cases, dict):
                problem.test_cases = problem.test_cases.get('sample', [])

            def create_match_payload(p1, p2):
                return {
                    "status": "matched",
                    "match_id": match_id,
                    "problem": ProblemOut.from_orm(problem).model_dump(mode='json'),
                    "opponent_id": p2
                }

            await manager.send_personal_message(create_match_payload(player1_id, player2_id), player1_id)
            await manager.send_personal_message(create_match_payload(player2_id, player1_id), player2_id)

        except redis.exceptions.WatchError:
            return

@router.websocket("/ws/matchmaking")
async def matchmaking_websocket(
    websocket: WebSocket, 
    current_user: User = Depends(get_user_from_token_ws),
    db: Session = Depends(get_db),
    match_id: str | None = Query(None)
):
    user_id = current_user.id
    await manager.connect(websocket, user_id)
    
    try:
        if match_id:
            match_key = f"match:{match_id}"
            match_data = redis_client.hgetall(match_key)
            
            if not match_data:
                await manager.send_personal_message({"status": "error", "detail": "Match not found or has expired."}, user_id)
                manager.disconnect(user_id)
                return

            player1_id = int(match_data['player1'])
            player2_id = int(match_data['player2'])

            if user_id not in [player1_id, player2_id]:
                await manager.send_personal_message({"status": "error", "detail": "You are not part of this match."}, user_id)
                manager.disconnect(user_id)
                return

            opponent_id = player2_id if user_id == player1_id else player1_id
            await manager.send_personal_message({"status": "opponent_reconnected"}, opponent_id)
        else:
            redis_client.lrem(MATCHMAKING_QUEUE_KEY, 0, user_id)
            redis_client.lpush(MATCHMAKING_QUEUE_KEY, user_id)
            await manager.send_personal_message({"status": "waiting"}, user_id)
            await attempt_to_create_match(db)
        
        while True:
            await websocket.receive_text()

    except WebSocketDisconnect:
        redis_client.lrem(MATCHMAKING_QUEUE_KEY, 0, user_id)
        manager.disconnect(user_id)
        print(f"User {user_id} disconnected and was removed from queue.")

@router.post("/quit", status_code=status.HTTP_200_OK)
async def quit_match(request: QuitMatchRequest, current_user: User = Depends(get_current_user)):
    match_key = f"match:{request.match_id}"
    match_data = redis_client.hgetall(match_key)

    if not match_data:
        raise HTTPException(status_code=404, detail="Match not found.")

    player1_id, player2_id = int(match_data.get('player1', 0)), int(match_data.get('player2', 0))

    if current_user.id not in [player1_id, player2_id]:
        raise HTTPException(status_code=403, detail="You are not a participant in this match.")

    opponent_id = player2_id if current_user.id == player1_id else player1_id
    if manager.is_active(opponent_id):
        await manager.send_personal_message({"status": "opponent_quit", "detail": "Your opponent has left the match."}, opponent_id)

    redis_client.delete(match_key)
    return {"status": "success", "detail": "Match has been quit."}