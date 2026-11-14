from pydantic import BaseModel
from decimal import Decimal
from typing import Optional

class ProductCreate(BaseModel):
    name: str
    category: str
    price: Decimal
    reorder_level: int = 10
    supplier_id: Optional[int] = None   

class SupplierCreate(BaseModel):
    name: str
    contact_email: str

class CustomerCreate(BaseModel):
    name: str
    credit_limit: Decimal