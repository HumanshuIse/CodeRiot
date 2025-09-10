import docker
import tempfile
import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import asyncio

# --- FastAPI and Docker Setup ---
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"],
)
try:
    client = docker.from_env()
    client.ping()
    print("Docker client initialized successfully.")
except Exception as e:
    print(f"FATAL: Error initializing Docker client: {e}")
    client = None

# --- Language Configuration ---
# The commands are now simpler, focused on compiling and running a single file.
LANGUAGE_META = {
    "python": {
        "image": "python:3.10-slim",
        "filename": "script.py",
        "command": "python script.py < input.txt",
    },
    "cpp": {
        "image": "gcc:11",
        "filename": "main.cpp",
        "command": "g++ -std=c++17 main.cpp -o main && ./main < input.txt",
    }
}

# --- Pydantic Model for Incoming Data ---
# Simplified to only include what the judge needs to execute.
#for single execution(testing)
class CodeExecution(BaseModel):
    code: str
    language: str
    input: str = ""

#new pydantic models for actual judging
class TestCase(BaseModel):
    input : str
    expected_output : str

class CodeExecutionBatch(BaseModel):
    code : str
    language : str
    test_cases : list[TestCase]


#practical endpoint for judging multiple test cases
@app.post("/execute-batch")
async def execute_code_batch(execution: CodeExecutionBatch):
    if not client:
        raise HTTPException(status_code=503, detail="Docker client is not available.")

    language = execution.language.lower()
    if language not in LANGUAGE_META:
        raise HTTPException(status_code=400, detail=f"Language '{language}' is not supported.")

    config = LANGUAGE_META[language]
    final_status = "Accepted"

    with tempfile.TemporaryDirectory() as temp_dir:
        # Write the user's code only once
        file_path = os.path.join(temp_dir, config["filename"])
        with open(file_path, "w",encoding="utf-8") as f:
            f.write(execution.code)

        # Loop through each test case
        for i, case in enumerate(execution.test_cases):
            input_file_path = os.path.join(temp_dir, "input.txt")
            with open(input_file_path, "w",encoding="utf-8") as f:
                f.write(case.input or "")

            container = None
            try:
                container = client.containers.run(
                    # ... (rest of container config is the same)
                    image=config["image"], entrypoint="/bin/sh", command=["-c", config["command"]],
                    working_dir="/app", volumes={temp_dir: {"bind": "/app", "mode": "rw"}},
                    detach=True, mem_limit="256m", network_disabled=True,
                )
                result = container.wait(timeout=10) # 10-second timeout per test case
                stdout = container.logs(stdout=True, stderr=False).decode("utf-8", "ignore").strip().replace('\r\n', '\n')
                stderr = container.logs(stdout=False, stderr=True).decode("utf-8", "ignore")

                # Check for errors first
                if result["StatusCode"] != 0:
                    final_status = f"Runtime Error on Test {i+1}"
                    if "Time Limit Exceeded" in stderr:
                         final_status = f"Time Limit Exceeded on Test {i+1}"
                    break # Stop on first failure

                # Check for wrong answer
                expected_output = case.expected_output.strip().replace('\r\n', '\n')
                if stdout != expected_output:
                    final_status = f"Wrong Answer on Test {i+1}"
                    break # Stop on first failure

            except Exception as e:
                if "timeout" in str(e).lower():
                    final_status = f"Time Limit Exceeded on Test {i+1}"
                else:
                    final_status = f"Judge Error on Test {i+1}"
                break # Stop on any exception
            finally:
                if container:
                    try: container.remove(force=True)
                    except Exception: pass

    # Return the single, final result
    return {"status": final_status}


#for single execution(testing)
@app.post("/execute")
async def execute_code(execution: CodeExecution):
    if not client:
        raise HTTPException(status_code=503, detail="Docker client is not available.")

    language = execution.language.lower()
    if language not in LANGUAGE_META:
        raise HTTPException(status_code=400, detail=f"Language '{language}' is not supported.")

    config = LANGUAGE_META[language]

    # The user's code is now the full program.
    full_code = execution.code

    # 🪵 Log full code for debugging
    print("\n--- FULL RECEIVED CODE ---")
    print(full_code)
    print("--- END OF CODE ---\n")

    with tempfile.TemporaryDirectory() as temp_dir:
        file_path = os.path.join(temp_dir, config["filename"])
        input_file_path = os.path.join(temp_dir, "input.txt")

        with open(file_path, "w",encoding="utf-8") as f:
            f.write(full_code)

        with open(input_file_path, "w",encoding="utf-8") as f:
            f.write(execution.input or "")

        container = None
        try:
            container = client.containers.run(
                image=config["image"],
                entrypoint="/bin/sh",
                command=["-c", config["command"]],
                working_dir="/app",
                volumes={temp_dir: {"bind": "/app", "mode": "rw"}},
                detach=True,
                mem_limit="256m",
                network_disabled=True,
            )

            result = container.wait(timeout=10)
            stdout = container.logs(stdout=True, stderr=False).decode("utf-8", "ignore")
            stderr = container.logs(stdout=False, stderr=True).decode("utf-8", "ignore")

            # 🪵 Log output
            print(f"\n--- STDOUT ---\n{stdout}\n--- STDERR ---\n{stderr}\n--- Exit Code: {result['StatusCode']} ---\n")

            if result["StatusCode"] != 0:
                return {
                    "output": stdout,
                    "error": stderr or f"Process exited with code {result['StatusCode']}. Possibly a compilation or runtime error."
                }

            return {"output": stdout, "error": stderr}

        except docker.errors.ContainerError as e:
            return {"output": "", "error": e.stderr.decode("utf-8", "ignore")}

        except Exception as e:
            # Catch timeout from container.wait()
            if isinstance(e, (asyncio.TimeoutError, docker.errors.ContainerError)) and "timeout" in str(e).lower():
                 return {"output": "", "error": "Time Limit Exceeded"}
            return {"output": "", "error": f"Judge server internal error: {str(e)}"}


        finally:
            if container:
                try:
                    container.remove(force=True)
                except Exception:
                    pass