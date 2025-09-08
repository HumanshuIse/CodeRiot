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

JUDGE_SERVER_URL = os.getenv("JUDGE_SERVER_URL")

@router.post("/submission", response_model=SubmissionOut, tags=["Submissions"])
async def create_submission(
    submission_data: SubmissionIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    problem = db.query(Problem).filter(Problem.id == submission_data.problem_id).first()
    if not problem or not problem.test_cases:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Problem or its test cases not found.")

    if isinstance(problem.test_cases, dict):
        all_test_cases = problem.test_cases.get('sample', []) + problem.test_cases.get('hidden', [])
    else:
        all_test_cases = problem.test_cases

    if not all_test_cases:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No test cases found for this problem.")

    final_status = "Accepted"
    total_cases = len(all_test_cases)
    
    for i, case in enumerate(all_test_cases):
        payload = { "code": submission_data.code, "language": submission_data.language, "input": case.get("input", "") }

        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.post(JUDGE_SERVER_URL, json=payload)
                response.raise_for_status()
            
            result = response.json()
            actual_output = result.get("output", "").strip().replace('\r\n', '\n')
            expected_output = case.get("expected_output", "").strip().replace('\r\n', '\n')

            if result.get("error"):
                error_msg = result["error"]
                final_status = f"Runtime Error on Test {i+1}"
                if "Time Limit Exceeded" in error_msg:
                    final_status = f"Time Limit Exceeded on Test {i+1}"
                break
            if actual_output != expected_output:
                final_status = f"Wrong Answer on Test {i+1}"
                break
        except (httpx.TimeoutException, httpx.RequestError):
            final_status = f"Time Limit Exceeded on Test {i+1}"
            break
        except Exception:
            final_status = f"Judge Error on Test {i+1}"
            break

    if final_status == "Accepted":
        final_status = f"Accepted"

    new_submission = Submission(
        user_id=current_user.id,
        problem_id=submission_data.problem_id,
        match_id=submission_data.match_id,
        language=submission_data.language,
        code=submission_data.code,
        status=final_status
    )
    db.add(new_submission)

    # --- NEW LOGIC START ---
    # Only increment solved count if the submission is accepted AND the user hasn't solved it before.
    if final_status.startswith("Accepted"):
        # Check if the user has any previous "Accepted" submissions for this problem
        existing_accepted_submission = db.query(Submission).filter(
            Submission.user_id == current_user.id,
            Submission.problem_id == submission_data.problem_id,
            Submission.status.like("Accepted%")
        ).first()

        # If this is the first time the user is solving this problem correctly, increment their solved count
        if not existing_accepted_submission:
            if current_user.problem_solved_cnt is None:
                current_user.problem_solved_cnt = 0
            current_user.problem_solved_cnt += 1
    # --- NEW LOGIC END ---

    db.commit()
    db.refresh(new_submission)

    # --- MODIFIED: Notify opponent on successful submission ---
    if final_status.startswith("Accepted") and submission_data.opponent_id:
        notification = {
            "status": "opponent_finished",
            "detail": "Your opponent has solved the problem! ⚔️"
        }
        # Use asyncio.create_task to send notification without blocking the response
        asyncio.create_task(
            manager.send_personal_message(notification, submission_data.opponent_id)
        )

    return new_submission
