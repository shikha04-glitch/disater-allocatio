from pydantic import BaseModel

class Disaster(BaseModel):
    type: str
    location: str
    severity: str
    description: str