# app/schemas/user.py
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserIn(BaseModel):
    username: str
    email: EmailStr # Using EmailStr for email validation
    password: str
    # Removed confirm_password as it's typically frontend validation

class Userlogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

# New schema for user output, including created_at and problems_contributed_count
class UserOut(BaseModel):
    id: int # Include ID for potential future use or debugging
    username: str
    email: EmailStr
    created_at: datetime # Account creation timestamp
    problems_contributed_count: int # Count of problems contributed by this user

    class Config:
        orm_mode = True # Enable ORM mode for SQLAlchemy compatibility

