from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.problem import Problem
from app.schemas.problems import ProblemSubmitIn, ProblemOut # Changed ProblemSubmission to ProblemSubmitIn
from app.core.security import get_current_user # Import get_current_user to ensure authorization
from app.models.user import User # Import User model
from datetime import datetime
import pytz # For timezone awareness

router = APIRouter()

# Define the Indian timezone
IST = pytz.timezone('Asia/Kolkata')

@router.post("/submit-problem", response_model=ProblemOut)
def submit_problem(
    problem_data: ProblemSubmitIn, # Changed parameter name for clarity
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user) # Ensures only authorized users can submit
):
    """
    Allows an authenticated user to submit a new problem idea for review.
    The contributor ID and submission timestamp are automatically set by the backend.
    """
    
    # Create the new Problem object
    new_problem = Problem(
        title=problem_data.title,
        description=problem_data.description,
        difficulty=problem_data.difficulty,
        tags=problem_data.tags,  # This assumes tags are stored as ARRAY in DB, otherwise join them
        constraints=problem_data.constraints,
        contributor_id=current_user.id, # Automatically set from the authenticated user
        submitted_at=datetime.now(IST), # Automatically set to current Indian time
        status="pending" # Default status for new submissions
        # reviewer_id is intentionally not set here, as it's for review process
    )

    db.add(new_problem)
    db.commit()
    db.refresh(new_problem)
    
    return new_problem