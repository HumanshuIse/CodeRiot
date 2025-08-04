from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base

class Submission(Base):
    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    opponent_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    problem_id = Column(Integer, ForeignKey("problems.id"), nullable=False)
    match_id = Column(String, nullable=True)
    language = Column(String(50), nullable=False)
    code = Column(Text, nullable=False)
    status = Column(String(50), nullable=False)
    submitted_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user = relationship("User", foreign_keys=[user_id])
    
    opponent = relationship("User", foreign_keys=[opponent_id])
    
    problem = relationship("Problem")