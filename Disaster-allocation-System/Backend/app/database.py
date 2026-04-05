from pymongo import MongoClient

MONGO_URL = "mongodb://localhost:27017"

client = MongoClient(MONGO_URL)

db = client["disaster_db"]

disaster_collection = db["disasters"]
resource_collection = db["resources"]
allocation_collection = db["allocations"]