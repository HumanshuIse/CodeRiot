# app/routes/user.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.user import User
from app.schemas.user import UserPublicOut # Import the new schema

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