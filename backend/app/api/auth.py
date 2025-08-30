# app/routes/auth.py

from fastapi import APIRouter, HTTPException, Depends, Request, BackgroundTasks
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.user import User
from app.models.problem import Problem 
from app.schemas.user import UserIn, Userlogin, Token, UserOut, EmailSchema, ResetPasswordSchema
from app.core.security import hash_password, verify_password, create_access_token, get_current_user,create_password_reset_token,verify_password_reset_token
from fastapi.security import OAuth2PasswordRequestForm
from authlib.integrations.starlette_client import OAuth
from dotenv import load_dotenv
import os
from app.core.email_utils import send_email

load_dotenv()
RESET_TOKEN_EXPIRE_MINUTES = os.getenv("RESET_TOKEN_EXPIRE_MINUTES")

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
def register(user: UserIn, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    if db.query(User).filter((User.username == user.username) | (User.email == user.email)).first():
        raise HTTPException(status_code=400, detail="Username or email already exists")

    hashed_pw = hash_password(user.password)
    new_user = User(username=user.username, email=user.email, password=hashed_pw)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # --- Send registration email in the background ---
    subject = "🎉 Welcome to Our Platform!"
    body = f"Hi {new_user.username},\n\nThank you for registering. We're excited to have you!"
    background_tasks.add_task(send_email, new_user.email, subject, body)
    
    token_data = {"user_id": new_user.id, "sub": new_user.username}
    token = create_access_token(token_data)
    return {
        "access_token": token,
        "token_type": "bearer"
    }

@router.post("/login", response_model=Token)
def login(user: Userlogin, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    # --- Send login notification email ---
    subject = "🔒 New Login to Your Account"
    body = f"Hi {db_user.username},\n\nWe detected a new login to your account. If this wasn't you, please secure your account."
    background_tasks.add_task(send_email, db_user.email, subject, body)
    
    token = create_access_token({"user_id":db_user.id,"sub": db_user.username})
    return {"access_token": token, "token_type": "bearer"}

@router.get("/profile", response_model=UserOut)
def get_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Count problems contributed by the current user
    problems_contributed_count = db.query(Problem).filter(Problem.contributor_id == current_user.id).count()

    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "created_at": current_user.created_at,
        "problems_contributed_count": problems_contributed_count,
        "problem_solved_cnt": current_user.problem_solved_cnt or 0
    }

@router.post("/token", response_model=Token)
def login_with_form(background_tasks: BackgroundTasks, form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == form_data.username).first()
    if not db_user or not verify_password(form_data.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    # --- Send login notification email ---
    subject = "🔒 New Login to Your Account"
    body = f"Hi {db_user.username},\n\nWe detected a new login to your account. If this wasn't you, please secure your account."
    background_tasks.add_task(send_email, db_user.email, subject, body)

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
async def google_callback(request: Request, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
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

    is_new_user = False
    # If user doesn't exist, create a new one
    if not db_user:
        is_new_user = True
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

    # --- Send appropriate email based on whether it's a new registration or login ---
    if is_new_user:
        subject = "🎉 Welcome via Google!"
        body = f"Hi {db_user.username},\n\nThank you for registering with your Google account."
    else:
        subject = "🔒 New Login to Your Account (via Google)"
        body = f"Hi {db_user.username},\n\nWe detected a new login to your account using Google."
        
    background_tasks.add_task(send_email, db_user.email, subject, body)
    
    # Create an access token for the user
    access_token = create_access_token({"user_id": db_user.id, "sub": db_user.username})

    # Redirect the user to the frontend with the token
    frontend_redirect_url = f"{os.getenv('frontend_url')}/auth/callback?token={access_token}"
    return RedirectResponse(url=frontend_redirect_url)

@router.post("/forgot-password")
def forgot_password(request: EmailSchema, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()

    # ❗️ Security: Always return a success message to prevent user enumeration
    if not user:
        return {"message": "If an account with that email exists, a password reset link has been sent."}

    # Generate the token and reset link
    token = create_password_reset_token(email=user.email)
    frontend_url = os.getenv("frontend_url")
    reset_link = f"{frontend_url}/reset-password?token={token}"

    # Send the email in the background
    subject = "🔑 Your Password Reset Request"
    body = f"""
    <p>Hi {user.username},</p>
    <p>You requested to reset your password.</p>
    <p>Please click the button below to set a new password. This link is valid for {RESET_TOKEN_EXPIRE_MINUTES} minutes.</p>
    <a href="{reset_link}" style="display:inline-block;padding:10px 20px;background-color:#007bff;color:white;text-decoration:none;border-radius:5px;">
        Reset Password
    </a>
    <p>If you did not request a password reset, please ignore this email.</p>
    """
    background_tasks.add_task(send_email, user.email, subject, body)

    return {"message": "If an account with that email exists, a password reset link has been sent."}


@router.post("/reset-password")
def reset_password(request: ResetPasswordSchema, db: Session = Depends(get_db)):
    email = verify_password_reset_token(request.token)
    if not email:
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        # This case should be rare if token generation is tied to existing users
        raise HTTPException(status_code=404, detail="User not found")

    # Update password
    hashed_password = hash_password(request.new_password)
    user.password = hashed_password
    db.commit()

    return {"message": "Password has been successfully reset."}