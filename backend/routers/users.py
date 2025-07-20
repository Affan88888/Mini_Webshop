from fastapi import APIRouter, HTTPException
import json
from pydantic import BaseModel
import os

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
def login_user(data: LoginRequest):
    try:
        with open(users_path, "r") as f:
            users = json.load(f)
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Users file not found.")

    for user in users:
        if user["email"] == data.email and user["password"] == data.password:
            return {"status": "success", "user": user}

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