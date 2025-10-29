import requests
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.submission import Submission
from app.models.user import User
from app.core.security import get_current_user
import os
from dotenv import load_dotenv
load_dotenv()

# --- Pydantic model for the request body ---
class AnalysisRequest(BaseModel):
    analysis_type: str  # Will be "time" or "space"

router = APIRouter()
ollama_url = os.getenv("ollama_url")
ollama_model = os.getenv("ollama_model")

def construct_analysis_prompt(code: str, language: str, analysis_type: str) -> str:
    """Constructs a prompt for complexity analysis."""
    
    if analysis_type == "time":
        topic = "Time Complexity"
        instructions = "Provide the Big O notation (e.g., O(n), O(n log n)) and a brief, 2-3 sentence explanation of *why*."
    else:
        topic = "Space Complexity"
        instructions = "Provide the Big O notation (e.g., O(n), O(1)) and a brief, 2-3 sentence explanation of the *auxiliary space* used."

    return f"""
    You are "Code Analyzer," an expert in algorithm analysis.
    A user wants to understand the complexity of their accepted solution.
    Your task is to analyze the {topic} of the user's code.

    **RULES:**
    1.  Be concise and direct.
    2.  {instructions}
    3.  Focus only on the complexity. Do not critique code style.
    4.  Format your answer clearly. Start with the Big O, then the explanation.

    ---
    **Language:** {language}
    **User's Code:**
    ```
    {code}
    ```
    ---

    Provide your analysis:
    """

@router.post("/submissions/{submission_id}/analyze", tags=["Analysis"])
async def get_code_analysis(
    submission_id: int,
    request: AnalysisRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Provides an AI-generated complexity analysis for a user's own submission.
    """
    # 1. Fetch the submission and verify ownership
    submission = db.query(Submission).filter(
        Submission.id == submission_id,
        Submission.user_id == current_user.id
    ).first()

    if not submission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Submission not found or you do not have permission to analyze it."
        )

    if request.analysis_type not in ["time", "space"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid analysis_type. Must be 'time' or 'space'."
        )

    # 2. Construct the prompt
    prompt = construct_analysis_prompt(submission.code, submission.language, request.analysis_type)

    # 3. Call Ollama (similar to hint.py)
    try:
        payload = {
            "model": ollama_model,
            "prompt": prompt,
            "stream": False
        }
        response = requests.post(ollama_url, json=payload, timeout=20)
        response.raise_for_status()

        response_data = response.json()
        analysis = response_data.get("response", "Sorry, I couldn't generate an analysis right now.").strip()

        return {"analysis": analysis}

    except requests.exceptions.RequestException as e:
        print(f"Error connecting to Ollama: {e}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="The AI analysis service is currently unavailable."
        )