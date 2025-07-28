# app/routes/new_problems.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.problem import Problem
from app.schemas.problems import ProblemSubmitIn, ProblemOut
from app.core.security import get_current_user
from app.models.user import User
from datetime import datetime
import pytz

router = APIRouter()
IST = pytz.timezone('Asia/Kolkata')

@router.post("/submit-problem", response_model=ProblemOut)
def submit_problem(
    problem_data: ProblemSubmitIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Allows an authenticated user to submit a new problem idea,
    including sample and hidden test cases.
    """
    
    # Convert the Pydantic TestCases model to a dictionary for JSON storage
    test_cases_dict = problem_data.test_cases.model_dump()
    
    new_problem = Problem(
        title=problem_data.title,
        description=problem_data.description,
        difficulty=problem_data.difficulty,
        tags=problem_data.tags,
        constraints=problem_data.constraints,
        test_cases=test_cases_dict,  # Store the dict in the JSONB field
        contributor_id=current_user.id,
        submitted_at=datetime.now(IST),
        status="pending"
    )

    db.add(new_problem)
    db.commit()
    db.refresh(new_problem)
    
    return new_problem