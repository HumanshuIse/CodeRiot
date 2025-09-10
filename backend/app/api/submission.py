# app/routes/submission.py
import asyncio
import httpx
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.problem import Problem
from app.models.submission import Submission
from app.models.user import User
from app.core.security import get_current_user
from app.schemas.submission import SubmissionIn, SubmissionOut
# --- MODIFIED: Import the global connection manager ---
from app.core.websockets import manager
import os
from dotenv import load_dotenv
load_dotenv()

router = APIRouter()

JUDGE_BATCH_URL = os.getenv("JUDGE_SERVER_URL") + "/execute-batch"
JUDGE_SINGLE_URL = os.getenv("JUDGE_SERVER_URL") + "/execute"

@router.post("/submission", response_model=SubmissionOut, tags=["Submissions"])
async def create_submission(
    submission_data: SubmissionIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    problem = db.query(Problem).filter(Problem.id == submission_data.problem_id).first()
    if not problem or not problem.test_cases:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Problem or its test cases not found.")

    # Prepare test cases in the format the judge expects
    if isinstance(problem.test_cases, dict):
        all_test_cases = problem.test_cases.get('sample', []) + problem.test_cases.get('hidden', [])
    else:
        all_test_cases = problem.test_cases

    if not all_test_cases:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No test cases found for this problem.")

    # Re-format test cases to match the Pydantic model in the judge
    formatted_test_cases = [
        {"input": tc.get("input", ""), "expected_output": tc.get("expected_output", "")}
        for tc in all_test_cases
    ]

    # Create a single payload for the batch request
    payload = {
        "code": submission_data.code,
        "language": submission_data.language,
        "test_cases": formatted_test_cases
    }

    final_status = "Judge Error" # Default status
    try:
        # CRITICAL: Increase the timeout for the client.
        # It should be long enough to run all test cases in the worst-case scenario.
        # (e.g., num_cases * timeout_per_case + buffer)
        timeout_seconds = len(all_test_cases) * 10 + 5 
        async with httpx.AsyncClient(timeout=timeout_seconds) as client:
            response = await client.post(JUDGE_BATCH_URL, json=payload)
            response.raise_for_status()
            result = response.json()
            final_status = result.get("status", "Judge Error")

    except httpx.TimeoutException:
        final_status = "Time Limit Exceeded on Batch"
    except Exception as e:
        print(f"Error communicating with judge: {e}")
        final_status = "Error Communicating with Judge"

    new_submission = Submission(
        user_id=current_user.id,
        problem_id=submission_data.problem_id,
        match_id=submission_data.match_id,
        language=submission_data.language,
        code=submission_data.code,
        status=final_status
    )
    db.add(new_submission)

    if final_status.startswith("Accepted"):
        existing_accepted_submission = db.query(Submission).filter(
            Submission.user_id == current_user.id,
            Submission.problem_id == submission_data.problem_id,
            Submission.status.like("Accepted%")
        ).first()

        if not existing_accepted_submission:
            if current_user.problem_solved_cnt is None:
                current_user.problem_solved_cnt = 0
            current_user.problem_solved_cnt += 1
    
    db.commit()
    db.refresh(new_submission)

    if final_status.startswith("Accepted") and submission_data.opponent_id:
        notification = { "status": "opponent_finished", "detail": "Your opponent has solved the problem! ⚔️" }
        asyncio.create_task( manager.send_personal_message(notification, submission_data.opponent_id) )

    return new_submission
