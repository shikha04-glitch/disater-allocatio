# app/routers/auth.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.database import db

router = APIRouter()

# Users collection
users_col = db["users"]

# Schemas
class User(BaseModel):
    username: str
    password: str
    role: str  # admin / volunteer / ngo

class LoginRequest(BaseModel):
    username: str
    password: str

# --- SIGN UP ---
@router.post("/signup")
def signup(user: User):
    if users_col.find_one({"username": user.username}):
        raise HTTPException(status_code=400, detail="Username already exists")
    users_col.insert_one(user.dict())
    return {"message": "User created successfully"}

# --- LOGIN ---
@router.post("/login")
def login(req: LoginRequest):
    user = users_col.find_one({"username": req.username, "password": req.password})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"username": user["username"], "role": user["role"]}