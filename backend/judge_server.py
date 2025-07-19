import docker
import tempfile
import os
import time
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

# Initialize FastAPI app
app = FastAPI()

# Configure CORS to allow requests from your React app's origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this to your frontend's domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Docker client
try:
    client = docker.from_env()
    client.ping() # Check if Docker is running
    print("Docker client initialized successfully.")
except Exception as e:
    print(f"Error initializing Docker client: {e}")
    print("Please ensure Docker is running and the user has permission to access the Docker daemon.")
    client = None

# Pydantic model for the incoming request body
class CodeSubmission(BaseModel):
    code: str
    language: str
    input: str | None = ""

# --- Language Configuration ---
LANGUAGE_CONFIG = {
    "python": {
        "image": "python:3.10-slim",
        "filename": "script.py",
        "command": "python script.py" # Command as a single string
    },
    "javascript": {
        "image": "node:18-slim",
        "filename": "script.js",
        "command": "node script.js"
    },
    "cpp": {
        "image": "gcc:11",
        "filename": "main.cpp",
        "command": "g++ main.cpp -o main && ./main"
    },
    "java": {
        "image": "openjdk:17-slim",
        "filename": "Main.java",
        "command": "javac Main.java && java Main"
    }
}

# The API endpoint to receive and execute code
@app.post("/execute")
async def execute_code(submission: CodeSubmission):
    """
    Receives code from the frontend, runs it in a secure Docker container
    with standard input, and returns the output.
    """
    if not client:
        raise HTTPException(status_code=500, detail="Docker client not available. Is Docker running?")

    language = submission.language.lower()
    if language not in LANGUAGE_CONFIG:
        raise HTTPException(status_code=400, detail=f"Language '{language}' is not supported.")

    config = LANGUAGE_CONFIG[language]
    
    with tempfile.TemporaryDirectory() as temp_dir:
        # Create the source code file path
        file_path = os.path.join(temp_dir, config["filename"])
        with open(file_path, "w") as f:
            f.write(submission.code)

        # --- NEW: Write the input to a separate file ---
        input_file_path = os.path.join(temp_dir, "input.txt")
        with open(input_file_path, "w") as f:
            f.write(submission.input or "")

        # --- NEW: Construct the final command with input redirection ---
        # This safely pipes the content of input.txt into the program's stdin
        final_command = f"{config['command']} < input.txt"

        # Define container parameters
        container_config = {
            "image": config["image"],
            # We use bash to handle the command with redirection
            "command": ["/bin/bash", "-c", final_command],
            "working_dir": "/app",
            "volumes": {
                temp_dir: {"bind": "/app", "mode": "rw"}
            },
            "detach": True,
            "mem_limit": "256m",
            "pids_limit": 100,
            "network_disabled": True,
        }

        container = None
        try:
            start_time = time.time()
            container = client.containers.run(**container_config)
            
            result = container.wait(timeout=10)
            
            end_time = time.time()
            execution_time = round((end_time - start_time) * 1000)

            stdout = container.logs(stdout=True, stderr=False).decode("utf-8", errors="ignore")
            stderr = container.logs(stdout=False, stderr=True).decode("utf-8", errors="ignore")
            
            stats = container.stats(stream=False)
            memory_usage_bytes = stats.get("memory_stats", {}).get("usage", 0)
            memory_usage_mb = round(memory_usage_bytes / (1024 * 1024), 2) if memory_usage_bytes else 0

            exit_code = result.get("StatusCode", -1)

            return {
                "output": stdout,
                "error": stderr,
                "exitCode": exit_code,
                "executionTime": execution_time,
                "memoryUsage": memory_usage_mb
            }

        except docker.errors.ContainerError as e:
            return {
                "output": "",
                "error": str(e),
                "exitCode": e.exit_status,
                "executionTime": 0,
                "memoryUsage": 0
            }
        except Exception as e:
            if container:
                try:
                    container.stop()
                except docker.errors.APIError:
                    pass
            
            error_message = str(e)
            if "Timeout" in str(e):
                error_message = "Execution timed out. (10s limit)"
            
            raise HTTPException(status_code=500, detail=error_message)
        
        finally:
            if container:
                try:
                    container.remove(force=True)
                except docker.errors.APIError:
                    pass
