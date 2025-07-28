# app/schemas/problems.py

from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime

# A schema to represent a single test case
class TestCase(BaseModel):
    input: str
    expected_output: str

# A schema for the structured test cases object
class TestCases(BaseModel):
    sample: List[TestCase] = []
    hidden: List[TestCase] = []

# Schema for incoming problem submissions, now including test cases
class ProblemSubmitIn(BaseModel):
    title: str
    description: str
    difficulty: Optional[str] = None
    tags: Optional[List[str]] = None
    constraints: Optional[str] = None
    test_cases: TestCases # This will hold the sample and hidden cases

# Schema for returning a problem, also updated
class ProblemOut(BaseModel):
    id: int
    title: str
    description: str
    difficulty: Optional[str] = None
    tags: Optional[List[str]] = None
    constraints: Optional[str] = None
    contributor_id: int
    status: str
    submitted_at: datetime
    test_cases: Optional[TestCases] = None

    class Config:
        from_attributes = True