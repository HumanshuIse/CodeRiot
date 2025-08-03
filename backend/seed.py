# seed.py

import json
from sqlalchemy.orm import sessionmaker
from app.db.database import engine, Base
from app.models.problem import Problem
from app.models.user import User

# --- MODIFIED: Import only the template generator functions ---
from app.core.code_generators import (
    create_py_template,
    create_cpp_template
)

# --- Configuration ---
SYSTEM_USER_ID = 1

# ==============================================================================
# == DSA PROBLEM METADATA (5 Test Cases Each)
# ==============================================================================

DSA_PROBLEMS_METADATA = [
    {
        "title": "Two Sum",
        "description": "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nInput format:\nThe first line contains an integer `n`, the size of the array.\nThe second line contains the integer `target`.\nThe third line contains `n` space-separated integers for the `nums` array.",
        "difficulty": "Easy",
        "tags": ["Array", "Hash Table"],
        "test_cases": {
            "sample": [
                { "input": "4\n9\n2 7 11 15", "expected_output": "0 1" },
                { "input": "3\n6\n3 2 4", "expected_output": "1 2" },
                { "input": "2\n6\n3 3", "expected_output": "0 1" },
                { "input": "5\n-1\n-3 1 -2 4 0", "expected_output": "1 2" },
                { "input": "4\n0\n-2 5 2 0", "expected_output": "0 2" }
            ]
        },
        "constraints": "2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9\nOnly one valid answer exists."
    },
    {
        "title": "Contains Duplicate",
        "description": "Given an integer array `nums`, return `true` if any value appears at least twice in the array, and return `false` if every element is distinct.\n\nInput format:\nThe first line contains an integer `n`, the size of the array.\nThe second line contains `n` space-separated integers for the `nums` array.",
        "difficulty": "Easy",
        "tags": ["Array", "Hash Table", "Set"],
        "test_cases": {
            "sample": [
                { "input": "4\n1 2 3 1", "expected_output": "true" },
                { "input": "4\n1 2 3 4", "expected_output": "false" },
                { "input": "1\n1", "expected_output": "false" },
                { "input": "5\n-1 -2 -3 -4 -1", "expected_output": "true" },
                { "input": "2\n0 0", "expected_output": "true" }
            ]
        },
        "constraints": "1 <= nums.length <= 10^5\n-10^9 <= nums[i] <= 10^9"
    },
    {
        "title": "Valid Anagram",
        "description": "Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.\n\nInput format:\nThe first line contains string `s`.\nThe second line contains string `t`.",
        "difficulty": "Easy",
        "tags": ["String", "Hash Table", "Sorting"],
        "test_cases": {
            "sample": [
                { "input": "anagram\nnagaram", "expected_output": "true" },
                { "input": "rat\ncar", "expected_output": "false" },
                { "input": "listen\nsilent", "expected_output": "true" },
                { "input": "hello\noleh", "expected_output": "false" },
                { "input": "state\ntaste", "expected_output": "true" }
            ]
        },
        "constraints": "1 <= s.length, t.length <= 5 * 10^4\n`s` and `t` consist of lowercase English letters."
    },
    {
        "title": "Gas Station",
        "description": "There are `n` gas stations along a circular route. You have a car with an unlimited gas tank. Given two integer arrays `gas` and `cost`, return the starting gas station's index if you can travel around the circuit once, otherwise return -1.\n\nInput format:\nThe first line contains an integer `n`, the number of gas stations.\nThe second line contains the `n` integers of the `gas` array (space-separated).\nThe third line contains the `n` integers of the `cost` array (space-separated).",
        "difficulty": "Medium",
        "tags": ["Greedy", "Array"],
        "test_cases": {
            "sample": [
                { "input": "5\n1 2 3 4 5\n3 4 5 1 2", "expected_output": "3" },
                { "input": "3\n2 3 4\n3 4 3", "expected_output": "-1" },
                { "input": "1\n10\n5", "expected_output": "0" },
                { "input": "1\n5\n10", "expected_output": "-1" },
                { "input": "4\n2 2 2 2\n2 2 2 2", "expected_output": "0" }
            ]
        },
        "constraints": "n == gas.length == cost.length\n1 <= n <= 10^5\n0 <= gas[i], cost[i] <= 10^4"
    },
]

# ==============================================================================
# == SEEDING LOGIC
# ==============================================================================

def seed_database():
    print("Starting to seed the database...")
    Base.metadata.create_all(bind=engine)
    db = sessionmaker(autocommit=False, autoflush=False, bind=engine)()
    
    try:
        # Check for and create the system user if it doesn't exist
        system_user = db.query(User).filter(User.id == SYSTEM_USER_ID).first()
        if not system_user:
            print(f"CRITICAL: System user with ID {SYSTEM_USER_ID} not found. Creating it.")
            from app.core.security import hash_password
            system_user = User(id=SYSTEM_USER_ID, username="system", email="system@coderiot.com", password=hash_password("a_very_secure_password"))
            db.add(system_user)
            db.commit()
            db.refresh(system_user)
            print("Created system user.")

        existing_titles = {problem[0] for problem in db.query(Problem.title).all()}
        problems_to_add = []

        for prob_meta in DSA_PROBLEMS_METADATA:
            if prob_meta["title"] in existing_titles:
                continue
                
            new_problem = Problem(
                title=prob_meta["title"],
                description=prob_meta.get("description", "..."),
                difficulty=prob_meta["difficulty"],
                tags=prob_meta.get("tags", []),
                contributor_id=SYSTEM_USER_ID,
                status="approved",
                test_cases=prob_meta.get("test_cases", {}),
                constraints=prob_meta.get("constraints"),
                
                # --- Call the simplified template generators ---
                frontend_template_python=create_py_template(prob_meta),
                frontend_template_cpp=create_cpp_template(prob_meta),
            )
            problems_to_add.append(new_problem)

        if problems_to_add:
            db.add_all(problems_to_add)
            db.commit()
            print(f"Successfully added {len(problems_to_add)} new problems.")
        else:
            print("No new problems to add. Database is already up-to-date.")
            
    except Exception as e:
        print(f"An error occurred during seeding: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()