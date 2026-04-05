from fastapi import APIRouter
from app.database import allocation_collection

router = APIRouter()

@router.post("/allocate")
def allocate():

    data = {
        "location": "Delhi",
        "food_packets": 200,
        "medical_kits": 50,
        "rescue_teams": 5
    }

    result = allocation_collection.insert_one(data)

    saved_data = allocation_collection.find_one({"_id": result.inserted_id})

    saved_data["_id"] = str(saved_data["_id"])   # ObjectId ko string banaya

    return saved_data