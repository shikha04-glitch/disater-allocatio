from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient

app = FastAPI()

# Allow requests from frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["dms"]  # Database name
users_col = db["users"]  # Users collection

# Schemas
class User(BaseModel):
    username: str
    password: str
    role: str

class LoginRequest(BaseModel):
    username: str
    password: str

# --- Sign Up ---
@app.post("/signup")
def signup(user: User):
    if users_col.find_one({"username": user.username}):
        raise HTTPException(status_code=400, detail="Username already exists")
    users_col.insert_one(user.dict())
    return {"message": "User created successfully"}

# --- Login ---
@app.post("/login")
def login(req: LoginRequest):
    user = users_col.find_one({"username": req.username, "password": req.password})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"username": user["username"], "role": user["role"]}