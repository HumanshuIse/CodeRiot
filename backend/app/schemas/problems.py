from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ProblemIn(BaseModel):
    title: str
    description: str
    difficulty: Optional[str] = None  # e.g., "Easy", "Medium", "Hard"
    tags: Optional[List[str]] = None  # e.g., ["array", "dp", "brainteaser"]
    constraints: Optional[str] = None  # ✅ New field

class ProblemSubmission(ProblemIn):
    contributor_id: int                      # User ID of the submitter
    submitted_at: Optional[datetime] = None
    status: Optional[str] = "pending"        # "pending", "approved", "rejected"
    reviewer_id: Optional[int] = None        # Admin/Moderator who reviews

class ProblemOut(ProblemIn):
    id: int
    contributor_id: int
    status: str
    reviewer_id: Optional[int] = None
    submitted_at: datetime

    class Config:
        orm_mode = True
