# app/routes/auth.py
from fastapi import APIRouter, HTTPException, Depends, Request
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.user import User
from app.models.problem import Problem # Import Problem model to count contributions
from app.schemas.user import UserIn, Userlogin, Token, UserOut # Import UserOut
from app.core.security import hash_password, verify_password, create_access_token, get_current_user
from fastapi.security import OAuth2PasswordRequestForm
from authlib.integrations.starlette_client import OAuth
from dotenv import load_dotenv
import os
load_dotenv()

#google auth setup
oauth = OAuth()
oauth.register(
    name = 'google',
    client_id = os.getenv("GOOGLE_CLIENT_ID"),
    client_secret = os.getenv("GOOGLE_CLIENT_SECRET"),
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={
        'scope': 'openid email profile'
    }
)
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

@router.get("/google")
async def google_login(request: Request):
    """
    Redirects the user to Google's authentication page.
    """
    redirect_uri = request.url_for('google_callback')
    print(f"DEBUG: Sending this redirect_uri to Google: {redirect_uri}")
    return await oauth.google.authorize_redirect(request, redirect_uri)

@router.get("/google/callback", name="google_callback")
async def google_callback(request: Request, db: Session = Depends(get_db)):
    """
    Handles the callback from Google, creates/logs in the user,
    and returns a JWT token.
    """
    token = await oauth.google.authorize_access_token(request)
    user_info = token.get('userinfo')
    
    if not user_info or not user_info.get('email'):
        raise HTTPException(status_code=400, detail="Could not fetch user info from Google")

    email = user_info['email']
    db_user = db.query(User).filter(User.email == email).first()

    # If user doesn't exist, create a new one
    if not db_user:
        # Create a unique username from the email
        username = email.split('@')[0]
        temp_username = username
        counter = 1
        while db.query(User).filter(User.username == temp_username).first():
            temp_username = f"{username}{counter}"
            counter += 1
        username = temp_username

        # Create the user without a password
        new_user = User(
            username=username,
            email=email,
            password=None  # No password for OAuth users
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        db_user = new_user

    # Create an access token for the user (same as your /login endpoint)
    #
    access_token = create_access_token({"user_id": db_user.id, "sub": db_user.username})

    # Redirect the user to the frontend with the token
    frontend_redirect_url = f"{os.getenv('frontend_url')}/auth/callback?token={access_token}"
    return RedirectResponse(url=frontend_redirect_url)