# app/schemas/problems.py

from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# A schema to represent a single test case
class TestCase(BaseModel):
    input: str
    expected_output: str

# REMOVED: The TestCases class is no longer needed.

# MODIFIED: Schema for incoming problems now takes a simple list of test cases.
class ProblemSubmitIn(BaseModel):
    title: str
    description: str
    difficulty: Optional[str] = None
    tags: Optional[List[str]] = None
    constraints: Optional[str] = None
    test_cases: List[TestCase] # This is now a simple list

# MODIFIED: Schema for returning a problem is also simplified.
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
    test_cases: Optional[List[TestCase]] = None # This is now a simple list

    # --- MODIFIED: Dynamic fields for problem retrieval ---
    frontend_template_python: Optional[str] = None
    frontend_template_cpp: Optional[str] = None
    frontend_template_javascript: Optional[str] = None
    frontend_template_java: Optional[str] = None

    class Config:
        from_attributes = True
