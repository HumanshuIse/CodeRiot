# app/models/user.py
# SQLALCHEMY;
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func # Import func for server_default
from app.db.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now()) # New field
    problem_solved_cnt = Column(Integer,nullable=False, default = 0) # new field

