from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ProblemSubmitIn(BaseModel):
    """Schema for user-submitted problem data."""
    title: str
    description: str
    difficulty: Optional[str] = None  # e.g., "Easy", "Medium", "Hard"
    tags: Optional[List[str]] = None  # e.g., ["array", "dp", "brainteaser"]
    constraints: Optional[str] = None  # Constraints for the problem

class ProblemSubmission(ProblemSubmitIn):
    """Internal schema for storing problem submission data with backend-managed fields."""
    contributor_id: int                      # User ID of the submitter
    submitted_at: Optional[datetime] = None  # Will be set by backend
    status: Optional[str] = "pending"        # "pending", "approved", "rejected"
    # reviewer_id removed

class ProblemOut(ProblemSubmitIn):
    """Schema for outputting problem data, including generated fields."""
    id: int
    contributor_id: int
    status: str
    # reviewer_id removed
    submitted_at: datetime

    class Config:
        orm_mode = True