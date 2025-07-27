
from pydantic import BaseModel,ConfigDict
from typing import Optional
from datetime import datetime

class SubmissionIn(BaseModel):
    """Schema for a user's code submission."""
    problem_id: int
    language: str
    code: str
    match_id: Optional[str] = None

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