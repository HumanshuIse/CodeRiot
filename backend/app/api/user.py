# app/routes/user.py

from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.user import User
from app.models.submission import Submission
from sqlalchemy.orm import joinedload
from app.schemas.user import UserPublicOut,LeaderboardEntry # Import the new schema
from app.schemas.submission import ProblemInfo, SubmissionHistoryOut
from app.core.security import get_current_user
router = APIRouter()

@router.get("/users/{user_id}", response_model=UserPublicOut)
def get_user_by_id(user_id: int, db: Session = Depends(get_db)):
    """
    Fetches a user's public profile by their ID.
    """
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail=f"User with id {user_id} not found")

    return user

@router.get("/users/me/submissions", response_model=list[SubmissionHistoryOut])
def get_user_submissions(current_user : User = Depends(get_current_user), db: Session = Depends(get_db)):

    submissions = (
        db.query(Submission)
        .filter(Submission.user_id == current_user.id)
        .filter(Submission.status == "Accepted") 
        .options(joinedload(Submission.problem)) # Efficiently loads problem data in one query
        .order_by(Submission.submitted_at.desc()) # Show most recent first
        .all()
    )
    return submissions

@router.get("/leaderboard", response_model=List[LeaderboardEntry])
async def get_leaderboard(
    limit: int = Query(default=10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """
    Get top users ranked by problems solved.
    """
    users = db.query(User)\
        .filter(User.problem_solved_cnt > 0)\
        .order_by(User.problem_solved_cnt.desc())\
        .limit(limit)\
        .all()
    
    leaderboard = []
    for rank, user in enumerate(users, start=1):
        leaderboard.append(LeaderboardEntry(
            rank=rank,
            user_id=user.id,
            username=user.username,
            problems_solved=user.problem_solved_cnt
        ))
    
    return leaderboard