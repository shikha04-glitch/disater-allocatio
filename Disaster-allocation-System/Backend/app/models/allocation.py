from pydantic import BaseModel

class Allocation(BaseModel):
    disaster: str
    resource: str
    allocated_quantity: int