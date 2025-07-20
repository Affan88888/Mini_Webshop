from fastapi import APIRouter, HTTPException
import json
from pydantic import BaseModel

router = APIRouter()

class LoginRequest(BaseModel):
    email: str
    password: str
    
@router.post("/login")
def login_user(data: LoginRequest):
    try:
        with open("data/users.json", "r") as f:
            users = json.load(f)
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Users file not found.")

    for user in users:
        if user["email"] == data.email and user["password"] == data.password:
            return {"status": "success", "user": user}

    raise HTTPException(status_code=401, detail="Invalid email or password.")