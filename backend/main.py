from fastapi import FastAPI
from app.api import auth,match,user,submission
from app.db.database import Base, engine
from fastapi.middleware.cors import CORSMiddleware
from app.api import new_problems
from app.models.user import User
from app.models.problem import Problem
from app.models.submission import Submission
Base.metadata.create_all(bind=engine)

app = FastAPI()
origins = [ 
    "http://localhost:5173",     # if you're using Vite
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,           # or use ["*"] to allow all (not safe for prod)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth.router, prefix="/api/auth")
app.include_router(match.router, prefix="/api/match", tags=["match"])
app.include_router(new_problems.router, prefix="/api/problems", tags=["problems"])
app.include_router(user.router, prefix = "/api",tags= ['users'])
app.include_router(submission.router, prefix='/api',tags = ['submissions'])
@app.get("/")
def begin():
    return {"Welcome to coderiot"}
