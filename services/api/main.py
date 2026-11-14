from fastapi import FastAPI, Depends, HTTPException, Response, Request
from sqlalchemy.orm import Session
from database import engine, SessionLocal, get_db
import models
import bcrypt
from jose import jwt
from datetime import datetime, timedelta
from schemas import ProductCreate, SupplierCreate, CustomerCreate
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# --- CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- JWT SETTINGS ---
SECRET_KEY = "my_super_secret_key_grozia"
ALGORITHM = "HS256"

# --- PYDANTIC MODELS ---
class ComplaintCreate(BaseModel):
    customer_name: str
    description: str
    category: str
    product_id: int | None = None  # Made optional

# --- HELPERS ---
def write_audit(db: Session, user_email: str, action: str, details: str = ""):
    log = models.AuditLog(user_email=user_email, action=action, details=details)
    db.add(log)

# --- HEALTH & SEED ---
@app.get("/api/health")
def health_check():
    return {"status": "healthy", "agent_enabled": False}

@app.get("/api/seed")
def seed_users(db: Session = Depends(get_db)):
    if db.query(models.User).count() > 0:
        return {"message": "Users already exist!"}

    password_bytes = "password123".encode('utf-8')
    hashed_pw = bcrypt.hashpw(password_bytes, bcrypt.gensalt()).decode('utf-8')

    owner = models.User(email="owner@grozia.com", hashed_password=hashed_pw, role="Owner")
    manager = models.User(email="manager@grozia.com", hashed_password=hashed_pw, role="Store Manager")
    accountant = models.User(email="accountant@grozia.com", hashed_password=hashed_pw, role="Accountant")

    db.add_all([owner, manager, accountant])
    write_audit(db, "system", "SEED", "Created 3 demo users")
    db.commit()
    return {"message": "Seeded Owner, Store Manager, and Accountant successfully!"}

# --- AUTH ---
@app.post("/api/login")
def login(response: Response, email: str, password: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    password_bytes = password.encode('utf-8')
    hashed_bytes = user.hashed_password.encode('utf-8')
    if not bcrypt.checkpw(password_bytes, hashed_bytes):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    expire = datetime.utcnow() + timedelta(hours=1)
    token_data = {"sub": user.email, "role": user.role, "exp": expire}
    token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)

    write_audit(db, user.email, "LOGIN", f"Role: {user.role}")
    db.commit()

    response.set_cookie(
        key="access_token", 
        value=token, 
        httponly=True, 
        samesite="lax", 
        secure=False, 
        path="/"
    )
    return {"message": f"Welcome {user.role}!", "role": user.role}

# --- PRODUCTS ---
@app.get("/api/products")
def list_products(db: Session = Depends(get_db)):
    products = db.query(models.Product).order_by(models.Product.id.desc()).limit(100).all()
    return [{"id": p.id, "name": p.name, "category": p.category, "price": float(p.price)} for p in products]

@app.post("/api/products")
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    p = models.Product(
        name=product.name,
        category=product.category,
        price=product.price,
        reorder_level=product.reorder_level,
        supplier_id=product.supplier_id
    )
    db.add(p)
    write_audit(db, "api", "CREATE_PRODUCT", f"Product: {product.name}")
    db.commit()
    db.refresh(p)
    return {"id": p.id, "message": "Product created"}


# --- SUPPLIERS ---
@app.get("/api/suppliers")
def list_suppliers(db: Session = Depends(get_db)):
    suppliers = db.query(models.Supplier).limit(50).all()
    return [{"id": s.id, "name": s.name, "contact_email": s.contact_email} for s in suppliers]

@app.post("/api/suppliers")
def create_supplier(supplier: SupplierCreate, db: Session = Depends(get_db)):
    s = models.Supplier(name=supplier.name, contact_email=supplier.contact_email)
    db.add(s)
    write_audit(db, "api", "CREATE_SUPPLIER", f"Supplier: {supplier.name}")
    db.commit()
    db.refresh(s)
    return {"id": s.id, "message": "Supplier created"}

# --- CUSTOMERS ---
@app.get("/api/customers")
def list_customers(db: Session = Depends(get_db)):
    customers = db.query(models.Customer).limit(50).all()
    return [{"id": c.id, "name": c.name, "credit_limit": float(c.credit_limit)} for c in customers]

@app.post("/api/customers")
def create_customer(customer: CustomerCreate, db: Session = Depends(get_db)):
    c = models.Customer(name=customer.name, credit_limit=customer.credit_limit)
    db.add(c)
    write_audit(db, "api", "CREATE_CUSTOMER", f"Customer: {customer.name}")
    db.commit()
    db.refresh(c)
    return {"id": c.id, "message": "Customer created"}

# --- COMPLAINTS ---
@app.get("/api/complaints")
def list_complaints(db: Session = Depends(get_db)):
    complaints = db.query(models.Complaint).order_by(models.Complaint.id.desc()).all()
    return [
        {
            "id": c.id,
            "customer": c.customer_name,
            "issue": c.description,
            "category": c.category,
            "status": c.status,
        }
        for c in complaints
    ]

@app.post("/api/complaints")
def create_complaint(complaint: ComplaintCreate, db: Session = Depends(get_db)):
    new_complaint = models.Complaint(
        customer_name=complaint.customer_name,
        description=complaint.description,
        category=complaint.category,
        product_id=None, # Optional - no product attached
        status="open",
    )
    db.add(new_complaint)
    write_audit(db, "api", "CREATE_COMPLAINT", f"Complaint: {complaint.description}")
    db.commit()
    db.refresh(new_complaint)
    return {"id": new_complaint.id, "message": "Complaint logged"}


# --- ME (Get current user info from the cookie) ---
@app.get("/api/me")
def get_me(request: Request):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return {"email": payload.get("sub"), "role": payload.get("role")}
    except:
        raise HTTPException(status_code=401, detail="Invalid token")
