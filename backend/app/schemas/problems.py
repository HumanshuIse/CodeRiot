# app/schemas/problems.py

from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ProblemSubmitIn(BaseModel):
    title: str
    description: str
    difficulty: Optional[str] = None
    tags: Optional[List[str]] = None
    constraints: Optional[str] = None

class ProblemOut(ProblemSubmitIn):
    id: int
    contributor_id: int
    status: str
    submitted_at: datetime

    # ✅ THIS IS THE FIX:
    # This nested class tells Pydantic how to behave.
    # `from_attributes = True` allows it to be created from a database object.
    class Config:
        from_attributes = True