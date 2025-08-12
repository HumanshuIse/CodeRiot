import requests
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.problem import Problem
import os
from dotenv import load_dotenv
load_dotenv()

#pydantic model for code request
class codeRequest(BaseModel):
    code: str

router = APIRouter()
ollama_url = os.getenv("ollama_url")
ollama_model = os.getenv("ollama_model")

# Function to construct the prompt for the AI model
def construct_prompt(problem: Problem, user_code: str) -> str:
    """Constructs a detailed prompt for the Ollama model."""
    return f"""
    You are "Yogi," a friendly and encouraging AI coding tutor.
    A user is stuck on a programming problem and has asked for a hint.
    Your task is to provide a single, concise hint to guide them.

    **RULES:**
    1.  **DO NOT** provide the full code solution or a direct implementation.
    2.  **DO** suggest a relevant algorithm, data structure, or a logical first step.
    3.  **KEEP** the hint high-level and short (2-3 sentences max).
    4.  **Analyze** the user's code to understand their current approach, but don't critique it harshly.

    ---
    **Problem Details:**
    - **Title:** {problem.title}
    - **Description:** {problem.description}
    - **Constraints:** {problem.constraints}

    **User's Current Code:**
    ```
    {user_code}
    ```
    ---

    Now, provide a helpful hint to get the user moving in the right direction.
    """

@router.post("/problems/{problem_id}/hint", tags=["hints"])
async def get_ai_hint(
    problem_id: int,
    request: codeRequest,
    db: Session = Depends(get_db),
):
    """
    Provides an AI-generated hint for a given problem based on the user's code.
    """
    problem = db.query(Problem).filter(Problem.id == problem_id).first()
    if not problem:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Problem not found.")

    prompt = construct_prompt(problem, request.code)

    try:
        payload = {
            "model": ollama_model,
            "prompt": prompt,
            "stream": False  # We want the full response at once
        }
        print(f"Sending request to Ollama with payload: {payload}")
        response = requests.post(ollama_url, json=payload, timeout=20)
        response.raise_for_status()  # Raise an exception for bad status codes (4xx or 5xx)

        response_data = response.json()
        hint = response_data.get("response", "Sorry, I couldn't generate a hint right now. Please try again later.").strip()

        return {"hint": hint}

    except requests.exceptions.RequestException as e:
        print(f"Error connecting to Ollama: {e}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="The AI hint service is currently unavailable. Please try again later."
        )
    