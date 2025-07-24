import os

from jose import jwt
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
EXPIRATION_MINUTES = int(os.getenv("EXPIRATION_MINUTES", 60))

def create_jwt_token(email: str):
    expire = datetime.utcnow() + timedelta(minutes = EXPIRATION_MINUTES)
    payload = {
        "sub": email,
        "exp": expire
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)