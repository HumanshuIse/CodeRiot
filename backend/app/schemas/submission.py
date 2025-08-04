
from pydantic import BaseModel,ConfigDict
from typing import Optional
from datetime import datetime

class SubmissionIn(BaseModel):
    """Schema for a user's code submission."""
    problem_id: int
    language: str
    code: str
    match_id: Optional[str] = None
    opponent_id: int | None = None # Add this field

class SubmissionOut(BaseModel):
    """Schema for returning the result of a submission."""
    id: int
    user_id: int
    problem_id: int
    language: str
    status: str
    submitted_at: datetime

    class Config:
         from_attributes = True