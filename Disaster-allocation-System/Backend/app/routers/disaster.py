from fastapi import APIRouter
from app.database import disaster_collection
from app.schemas.disaster import Disaster

router = APIRouter()

# ✅ POST (data save karega MongoDB me)
@router.post("/disasters")
def create_disaster(disaster: Disaster):
    disaster_data = disaster.dict()
    disaster_collection.insert_one(disaster_data)
    return {"message": "Disaster added"}


# ✅ GET (MongoDB se data laayega)
@router.get("/disaster")
def get_disasters():
    disasters = []
    
    for d in disaster_collection.find():
        d["_id"] = str(d["_id"])  # ObjectId fix
        disasters.append(d)
    
    return disasters