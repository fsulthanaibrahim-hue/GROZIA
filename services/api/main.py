from fastapi import FastAPI, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from database import engine, SessionLocal, get_db
import models
import bcrypt
from jose import jwt
from datetime import datetime, timedelta
from schemas import ProductCreate, SupplierCreate, CustomerCreate

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# --- JWT SETTINGS ---
SECRET_KEY = "my_super_secret_key_grozia"
ALGORITHM = "HS256"

def write_audit(db: Session, user_email: str, action: str, details: str = ""):
    log = models.AuditLog(user_email=user_email, action=action, details=details)
    db.add(log)

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

    response.set_cookie(key="access_token", value=token, httponly=True, samesite="lax")
    return {"message": f"Welcome {user.role}!", "role": user.role}

# --- PRODUCTS ---
@app.get("/api/products")
def list_products(db: Session = Depends(get_db)):
    products = db.query(models.Product).limit(50).all()
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

