# app/routes/auth.py
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.user import User
from app.models.problem import Problem # Import Problem model to count contributions
from app.schemas.user import UserIn, Userlogin, Token, UserOut # Import UserOut
from app.core.security import hash_password, verify_password, create_access_token, get_current_user
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter()

@router.post("/register", response_model=Token)
def register(user: UserIn, db: Session = Depends(get_db)):
    if db.query(User).filter((User.username == user.username) | (User.email == user.email)).first():
        raise HTTPException(status_code=400, detail="Username or email already exists")

    hashed_pw = hash_password(user.password)
    new_user = User(username=user.username, email=user.email, password=hashed_pw)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token_data = {"user_id": new_user.id, "sub": new_user.username}
    token = create_access_token(token_data)
    return {
        "access_token": token,
        "token_type": "bearer"
    }

@router.post("/login", response_model=Token)
def login(user: Userlogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    token = create_access_token({"user_id":db_user.id,"sub": db_user.username})
    return {"access_token": token, "token_type": "bearer"}

@router.get("/profile", response_model=UserOut) # Use the new UserOut schema
def get_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Count problems contributed by the current user
    problems_contributed_count = db.query(Problem).filter(Problem.contributor_id == current_user.id).count()

    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "created_at": current_user.created_at, # Include the created_at timestamp
        "problems_contributed_count": problems_contributed_count # Include the count
    }

@router.post("/token", response_model=Token)
def login_with_form(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == form_data.username).first()
    if not db_user or not verify_password(form_data.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    token = create_access_token({"user_id":db_user.id,"sub": db_user.username})
    return {"access_token": token, "token_type": "bearer"}

