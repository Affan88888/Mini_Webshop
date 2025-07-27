import os
import json

from fastapi import APIRouter, HTTPException, Response, Request
from pydantic import BaseModel
from jose import jwt, JWTError
from dotenv import load_dotenv

from utils.jwt_utils import create_jwt_token

auth_router = APIRouter()
USERS_PATH = os.path.join("data", "users.json")

# Model podataka za login zahtjev
class LoginRequest(BaseModel):
    email: str
    password: str

# Model podataka za signup zahtjev
class SignupRequest(BaseModel):
    email: str
    username: str
    password: str
    role: str = "user"  # 'user' je po defaultu
    

@auth_router.post("/login")
def login_user(data: LoginRequest, response: Response):
    """
    Prijavljuje korisnika provjerom emaila i lozinke, te postavlja JWT token u kolačić.
    """
    try:
        # Učitavanje korisnika iz fajla
        with open(USERS_PATH, "r") as f:
            users = json.load(f)
    except FileNotFoundError:
        # Ako fajl ne postoji, vraća se greška
        raise HTTPException(status_code=500, detail="Fajl sa korisnicima nije pronađen.")

    # Provjera emaila i lozinke
    for user in users:
        if user["email"] == data.email and user["password"] == data.password:
            # Kreiranje JWT tokena
            token = create_jwt_token(
                email=user["email"], 
                username=user["username"],
                role=user["role"]
            )
            # Postavljanje JWT tokena unutar kolačića
            response.set_cookie(
                key="access_token",
                value=token,
                httponly=True,
                samesite="Lax",
                secure=True,  # Postavi na True ako koristiš HTTPS
                max_age=3600  # 1 sat
            )
            # Vraćanje podataka o korisniku
            return {
                "status": "success",
                "user": {
                    "email": user["email"],
                    "username": user["username"],
                    "role": user["role"]
                }
            }

    # Ako podaci nisu tačni, vraća se greška
    raise HTTPException(status_code=401, detail="Neispravan email ili lozinka.")

@auth_router.post("/signup")
def signup_user(data: SignupRequest, response: Response):
    """
    Registruje novog korisnika i postavlja JWT token u kolačić.
    """
    try:
        # Učitavanje postojećih korisnika
        with open(USERS_PATH, "r") as f:
            users = json.load(f)
    except FileNotFoundError:
        # Ako fajl ne postoji, kreira se nova lista korisnika
        users = []

    # Provjera da li email ili username već postoji
    for user in users:
        if user["email"] == data.email:
            raise HTTPException(status_code=400, detail="Email je već registrovan.")
        if user["username"] == data.username:
            raise HTTPException(status_code=400, detail="Korisničko ime već postoji.")

    # Kreiranje novog korisnika
    # Napomena: lozinka bi trebala biti heširana, ali posto je ovo samo demo aplikacija
    # i posto u task requirementima ne pise da se treba hashovati, ja cu ostaviti da se
    # password sejva u plain textu, radi i lakseg pregleda i testiranja koda
    new_user = {
        "email": data.email,
        "username": data.username,
        "password": data.password,  
        "role": data.role
    }

    users.append(new_user)

    # Upisivanje nove liste korisnika u fajl
    with open(USERS_PATH, "w") as f:
        json.dump(users, f, indent=2)

    # Kreiranje JWT tokena
    token = create_jwt_token(
        email=new_user["email"], 
        username=new_user["username"],
        role=new_user["role"]
    )
    
    # Postavljanje tokena unutar kolačića
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=True, # Postavi na True ako koristiš HTTPS
        samesite="Lax",
        max_age=3600  # 1 sat
    )

    # Vraćanje podataka o novom korisniku
    return {
        "status": "success",
        "user": {
            "email": new_user["email"],
            "username": new_user["username"],
            "role": new_user["role"]
        }
    }

# Učitavanje .env varijabli
load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

@auth_router.get("/check-auth")
def get_logged_in_user(request: Request):
    """
    Provjerava da li je korisnik prijavljen pomoću JWT tokena iz kolačića.
    """
    # Dohvatanje tokena iz kolačića
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Niste autentifikovani.")

    try:
        # Dekodiranje tokena i vraćanje korisničkih podataka
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return {
            "user": {
                "email": payload["sub"],
                "username": payload["username"],
                "role": payload["role"]
            }
        }
    except JWTError:
        # Ako token nije validan
        raise HTTPException(status_code=401, detail="Neispravan token.")

@auth_router.post("/logout")
def logout_user(response: Response):
    """
    Odjavljuje korisnika brisanjem JWT tokena iz kolačića.
    """
    # Brisanje kolačića sa tokenom (logout)
    response.delete_cookie("access_token")
    return {"status": "success"}
