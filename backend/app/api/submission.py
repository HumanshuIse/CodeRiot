# app/routes/submission.py

import httpx
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.problem import Problem
from app.models.submission import Submission
from app.models.user import User
from app.core.security import get_current_user
from app.schemas.submission import SubmissionIn, SubmissionOut

router = APIRouter()

JUDGE_SERVER_URL = "http://localhost:8001/execute"

@router.post("/submission", response_model=SubmissionOut, tags=["Submissions"])
async def create_submission(
    submission_data: SubmissionIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    problem = db.query(Problem).filter(Problem.id == submission_data.problem_id).first()
    if not problem or not problem.test_cases:
        raise HTTPException(status_code=404, detail="Problem or its test cases not found.")

    # ✅ UPDATED: Combine sample and hidden test cases for final judging.
    sample_cases = problem.test_cases.get('sample', [])
    hidden_cases = problem.test_cases.get('hidden', [])
    all_test_cases = sample_cases + hidden_cases

    if not all_test_cases:
        raise HTTPException(status_code=404, detail="No test cases found for this problem.")

    final_status = "Accepted"
    total_cases = len(all_test_cases)

    # Loop through the combined list of all test cases
    for i, case in enumerate(all_test_cases):
        payload = {
            "code": submission_data.code,
            "language": submission_data.language,
            "input": case.get("input", "")
        }

        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.post(JUDGE_SERVER_URL, json=payload)
                response.raise_for_status()
            
            result = response.json()
            
            actual_output = result.get("output", "").strip().replace('\r\n', '\n')
            expected_output = case.get("expected_output", "").strip().replace('\r\n', '\n')

            if result.get("exitCode") != 0 or result.get("error"):
                final_status = f"Runtime Error on Test {i+1}"
                break
            if actual_output != expected_output:
                final_status = f"Wrong Answer on Test {i+1}"
                break
        except httpx.TimeoutException:
            final_status = f"Time Limit Exceeded on Test {i+1}"
            break
        except Exception:
            final_status = f"Judge Error on Test {i+1}"
            break

    if final_status == "Accepted":
        final_status = f"Accepted ({total_cases}/{total_cases})"

    # Save the final result to the database
    new_submission = Submission(
        user_id=current_user.id,
        problem_id=submission_data.problem_id,
        match_id=submission_data.match_id,
        language=submission_data.language,
        code=submission_data.code,
        status=final_status
    )
    db.add(new_submission)
    db.commit()
    db.refresh(new_submission)

    return new_submission