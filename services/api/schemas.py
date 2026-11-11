from pydantic import BaseModel
from decimal import Decimal

class ProductCreate(BaseModel):
    name: str
    category: str
    price: Decimal
    reorder_level: int
    supplier_id: int

class SupplierCreate(BaseModel):
    name: str
    contact_email: str

class CustomerCreate(BaseModel):
    name: str
    credit_limit: Decimal
