# In app/api/new_problems.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.problem import Problem
from app.schemas.problems import ProblemSubmitIn, ProblemOut
from app.core.security import get_current_user
from app.models.user import User

from app.core.code_generators import (
    create_py_template,
    create_cpp_template
)

router = APIRouter()

@router.post("/submit-problem", response_model=ProblemOut)
def submit_problem(
    problem_data: ProblemSubmitIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Accepts simplified problem metadata and generates basic templates
    before saving to the database.
    """
    
    meta = problem_data.model_dump()
    
    try:
        frontend_py = create_py_template(meta)
        frontend_cpp = create_cpp_template(meta)
        
        new_problem = Problem(
            title=problem_data.title,
            description=problem_data.description,
            difficulty=problem_data.difficulty,
            tags=problem_data.tags,
            constraints=problem_data.constraints,
            # MODIFIED: Directly save the list of test cases after converting to dicts
            test_cases=[tc.model_dump() for tc in problem_data.test_cases],
            contributor_id=current_user.id,
            status="pending",
            frontend_template_python=frontend_py,
            frontend_template_cpp=frontend_cpp,
        )

        db.add(new_problem)
        db.commit()
        db.refresh(new_problem)

        return new_problem

    except Exception as e:
        db.rollback()
        print(f"Error during problem creation: {e}")
        raise HTTPException(
            status_code=500,
            detail="An internal error occurred while creating the problem."
        )
