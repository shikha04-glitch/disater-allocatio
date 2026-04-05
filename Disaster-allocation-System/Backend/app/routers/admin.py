from fastapi import APIRouter
from fastapi.responses import JSONResponse
from app.database import db
from bson import ObjectId

router = APIRouter()

# Collections
disaster_collection = db["disasters"]
resources_collection = db["resources"]
requests_collection = db["requests"]
tracking_collection = db["tracking"]

# ===== GET ALL DISASTERS =====
@router.get("/disasters")
def get_disasters():
    disasters = []
    for d in disaster_collection.find():
        d["_id"] = str(d["_id"])
        disasters.append(d)
    return disasters

# ===== GET ALL RESOURCES =====
@router.get("/resources")
def get_resources():
    resources = []
    for r in resources_collection.find():
        r["_id"] = str(r["_id"])
        r["status"] = r.get("status", "Available")
        resources.append(r)
    return resources

# ===== GET ALL REQUESTS =====
@router.get("/requests")
def get_requests():
    reqs = []

    for r in requests_collection.find():
        r["_id"] = str(r["_id"])

        req = {
            "_id": r["_id"],
            "resource": r.get("resource") or r.get("name") or "Unknown",
            "quantity": r.get("quantity") or r.get("qty") or 0,
            "area": r.get("area") or r.get("location") or "Unknown",
            "requested_by": r.get("requested_by", "Volunteer")
        }

        reqs.append(req)

    return reqs

# ===== GET ALL TRACKING =====
@router.get("/tracking")
def get_tracking():
    tracking = []
    for t in tracking_collection.find():
        t["_id"] = str(t["_id"])
        tracking.append(t)
    return tracking

# ===== ALLOCATE RESOURCE =====
@router.post("/allocate")
def allocate_resource(payload: dict):

    request_id = payload.get("request_id")

    request_doc = requests_collection.find_one({"_id": ObjectId(request_id)})

    if not request_doc:
        return {"message": "Request not found"}

    resource_name = request_doc.get("resource") or request_doc.get("name")
    quantity = request_doc.get("quantity") or request_doc.get("qty")
    area = request_doc.get("area") or request_doc.get("location")

    tracking_doc = {
        "resource": resource_name,
        "quantity": quantity,
        "sent_to": area,
        "status": "In Transit"
    }

    tracking_collection.insert_one(tracking_doc)

    requests_collection.delete_one({"_id": ObjectId(request_id)})

    return {"message": "Allocated"}

# ===== UPDATE TRACKING STATUS =====
@router.patch("/tracking/update/{tracking_id}")
def update_tracking(tracking_id: str, payload: dict):
    status = payload.get("status")
    if status not in ["Pending", "Delivered"]:
        return JSONResponse(status_code=400, content={"message": "Invalid status"})
    result = tracking_collection.update_one({"_id": ObjectId(tracking_id)}, {"$set": {"status": status}})
    if result.modified_count == 0:
        return JSONResponse(status_code=404, content={"message": "Tracking not found"})
    return {"message": "Tracking status updated"}

# ===== CREATE REQUEST (VOLUNTEER) =====
@router.post("/requests")
def create_request(payload: dict):
    requests_collection.insert_one(payload)
    return {"message": "Request created"}