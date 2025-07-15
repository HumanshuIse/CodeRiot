from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, ARRAY
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base

class Problem(Base):
    __tablename__ = "problems"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    difficulty = Column(String(50), nullable=True)
    tags = Column(ARRAY(String), nullable=True)
    constraints = Column(Text, nullable=True)  # ✅ NEW FIELD
    contributor_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    submitted_at = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(String(20), default="pending")  # "pending", "approved", "rejected"
    reviewer_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    contributor = relationship("User", foreign_keys=[contributor_id], backref="submitted_problems")
    reviewer = relationship("User", foreign_keys=[reviewer_id], backref="reviewed_problems")
