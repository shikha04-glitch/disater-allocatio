from fastapi import APIRouter
from app.database import resource_collection
from app.schemas.resource import Resource

router = APIRouter()

@router.post("/resources")
def add_resource(resource: Resource):

    resource_collection.insert_one(resource.dict())

    return {"message": "Resource added"}