from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.problem import Problem
from app.schemas.problems import ProblemSubmission, ProblemOut
from app.core.security import get_current_user
from app.models.user import User

router = APIRouter()

@router.post("/submit-problem", response_model=ProblemOut)
def submit_problem(
    problem: ProblemSubmission,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_problem = Problem(
        title=problem.title,
        description=problem.description,
        difficulty=problem.difficulty,
        tags=problem.tags,
        constraints=problem.constraints,  # ✅ Add constraints here
        contributor_id=current_user.id,
        status="pending"
    )
    db.add(new_problem)
    db.commit()
    db.refresh(new_problem)
    return new_problem
