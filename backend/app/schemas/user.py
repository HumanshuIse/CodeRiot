# schemas for database;
from pydantic import BaseModel

class UserIn(BaseModel):
    username : str
    email : str
    password : str
    confirm_password : str

class Userlogin(BaseModel):
    username : str
    password : str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"