import os
import json

from fastapi import APIRouter, HTTPException, Response, Request
from pydantic import BaseModel
from jose import jwt, JWTError
from dotenv import load_dotenv

from utils.jwt_utils import create_jwt_token


router = APIRouter()
users_path = os.path.join("data", "users.json")

class LoginRequest(BaseModel):
    email: str
    password: str
    
class SignupRequest(BaseModel):
    email: str
    password: str
    role: str = "user"  # 'user' je po deafultu
    
@router.post("/login")
def login_user(data: LoginRequest, response: Response):
    try:
        with open(users_path, "r") as f:
            users = json.load(f)
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Users file not found.")

    for user in users:
        if user["email"] == data.email and user["password"] == data.password:
            token = create_jwt_token(data.email) # Napravio JWT token
            # Setao JWT token unutar cookiea
            response.set_cookie(
                key = "access_token",
                value = token,
                httponly = True,
                samesite = "Lax",
                secure =  False, # Set to True if using HTTPS
                max_age = 3600, # 1 sat
            )
            return {"status": "success", "user": {"email": user["email"], "role": user["role"]}}

    raise HTTPException(status_code=401, detail="Invalid email or password.")

@router.post("/signup")
def signup_user(data: SignupRequest):
    try:
        with open(users_path, "r") as f:
            users = json.load(f)
    except FileNotFoundError:
        users = []

    # Provjeriti da li email vec postoji
    for user in users:
        if user["email"] == data.email:
            raise HTTPException(status_code=400, detail="Email already registered.")

    new_user = {
        "email": data.email,
        "password": data.password,
        "role": data.role
    }

    users.append(new_user)

    with open(users_path, "w") as f:
        json.dump(users, f, indent=2)

    return {"status": "success", "user": new_user}

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

@router.get("/check-auth")
def get_logged_in_user(request: Request):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return {"user": {"email": payload["sub"]}}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.post("/logout")
def logout_user(response: Response):
    response.delete_cookie("access_token")
    return {"status": "success"}
