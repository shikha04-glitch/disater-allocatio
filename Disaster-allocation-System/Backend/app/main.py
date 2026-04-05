from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import disaster, resource, allocation, auth, admin

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ KEEP PREFIXES FIXED
app.include_router(disaster.router, prefix="/disaster")
app.include_router(resource.router, prefix="/resources")
app.include_router(allocation.router, prefix="/allocation")
app.include_router(auth.router, prefix="/auth")
app.include_router(admin.router, prefix="/admin")

@app.get("/")
def home():
    return {"message": "Running"}