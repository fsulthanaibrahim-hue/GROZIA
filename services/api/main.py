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
import os
from dotenv import load_dotenv
from auth_guard import require_role, require_page
from pages import ALL_PAGES, DEFAULT_PAGES

load_dotenv()

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from auth_guard import SECRET_KEY
ALGORITHM = "HS256"

class ComplaintCreate(BaseModel):
    customer_name: str
    description: str
    category: str
    product_id: int | None = None

class PageAssignment(BaseModel):
    pages: list[str]

def write_audit(db: Session, user_email: str, action: str, details: str = ""):
    db.add(models.AuditLog(user_email=user_email, action=action, details=details))

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "agent_enabled": False}

@app.get("/api/seed")
def seed_users(db: Session = Depends(get_db), user: dict = Depends(require_role(["Owner", "Store Manager"]))):
    if db.query(models.User).count() > 0:
        return {"message": "Users already exist!"}
    hashed_pw = bcrypt.hashpw("password123".encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    owner = models.User(email="owner@grozia.com", hashed_password=hashed_pw, role="Owner")
    manager = models.User(email="manager@grozia.com", hashed_password=hashed_pw, role="Store Manager")
    accountant = models.User(email="accountant@grozia.com", hashed_password=hashed_pw, role="Accountant")
    db.add_all([owner, manager, accountant])
    db.flush()
    for u in (owner, manager, accountant):
        for p in DEFAULT_PAGES[u.email]:
            db.add(models.UserPage(user_id=u.id, page=p))
    write_audit(db, "system", "SEED", "Created 3 demo users")
    db.commit()
    return {"message": "Seeded Owner, Store Manager, and Accountant successfully!"}

@app.post("/api/login")
def login(response: Response, email: str, password: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    if not bcrypt.checkpw(password.encode("utf-8"), user.hashed_password.encode("utf-8")):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    expire = datetime.utcnow() + timedelta(hours=1)
    token = jwt.encode({"sub": user.email, "role": user.role, "exp": expire}, SECRET_KEY, algorithm=ALGORITHM)

    write_audit(db, user.email, "LOGIN", f"Role: {user.role}")
    db.commit()

    response.set_cookie(key="access_token", value=token, httponly=True, samesite="lax", secure=False, path="/")
    response.set_cookie(key="user_role", value=user.role, httponly=False, samesite="lax", secure=False, path="/")
    return {"message": f"Welcome {user.role}!", "role": user.role}

@app.post("/api/logout")
def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("user_role", path="/")
    return {"message": "Logged out"}

# --- PRODUCTS ---
@app.get("/api/products")
def list_products(db: Session = Depends(get_db), user: dict = Depends(require_page("products"))):
    products = db.query(models.Product).order_by(models.Product.id.desc()).limit(100).all()
    return [{"id": p.id, "name": p.name, "category": p.category, "price": float(p.price)} for p in products]

@app.post("/api/products")
def create_product(product: ProductCreate, db: Session = Depends(get_db), user: dict = Depends(require_page("products"))):
    p = models.Product(name=product.name, category=product.category, price=product.price,
                       reorder_level=product.reorder_level, supplier_id=product.supplier_id)
    db.add(p)
    write_audit(db, "api", "CREATE_PRODUCT", f"Product: {product.name}")
    db.commit()
    db.refresh(p)
    return {"id": p.id, "message": "Product created"}

# --- SUPPLIERS (part of Inventory) ---
@app.get("/api/suppliers")
def list_suppliers(db: Session = Depends(get_db), user: dict = Depends(require_page("products"))):
    suppliers = db.query(models.Supplier).limit(50).all()
    return [{"id": s.id, "name": s.name, "contact_email": s.contact_email} for s in suppliers]

@app.post("/api/suppliers")
def create_supplier(supplier: SupplierCreate, db: Session = Depends(get_db), user: dict = Depends(require_page("products"))):
    s = models.Supplier(name=supplier.name, contact_email=supplier.contact_email)
    db.add(s)
    write_audit(db, "api", "CREATE_SUPPLIER", f"Supplier: {supplier.name}")
    db.commit()
    db.refresh(s)
    return {"id": s.id, "message": "Supplier created"}

# --- CUSTOMERS ---
@app.get("/api/customers")
def list_customers(db: Session = Depends(get_db), user: dict = Depends(require_page("customers"))):
    customers = db.query(models.Customer).limit(50).all()
    return [{"id": c.id, "name": c.name, "credit_limit": float(c.credit_limit)} for c in customers]

@app.post("/api/customers")
def create_customer(customer: CustomerCreate, db: Session = Depends(get_db), user: dict = Depends(require_page("customers"))):
    c = models.Customer(name=customer.name, credit_limit=customer.credit_limit)
    db.add(c)
    write_audit(db, "api", "CREATE_CUSTOMER", f"Customer: {customer.name}")
    db.commit()
    db.refresh(c)
    return {"id": c.id, "message": "Customer created"}

# --- COMPLAINTS ---
@app.get("/api/complaints")
def list_complaints(db: Session = Depends(get_db), user: dict = Depends(require_page("complaints"))):
    complaints = db.query(models.Complaint).order_by(models.Complaint.id.desc()).all()
    return [{"id": c.id, "customer": c.customer_name, "issue": c.description,
             "category": c.category, "status": c.status} for c in complaints]

@app.post("/api/complaints")
def create_complaint(complaint: ComplaintCreate, db: Session = Depends(get_db), user: dict = Depends(require_page("complaints"))):
    n = models.Complaint(customer_name=complaint.customer_name, description=complaint.description,
                         category=complaint.category, product_id=None, status="open")
    db.add(n)
    write_audit(db, "api", "CREATE_COMPLAINT", f"Complaint: {complaint.description}")
    db.commit()
    db.refresh(n)
    return {"id": n.id, "message": "Complaint logged"}

# --- ME ---
@app.get("/api/me")
def get_me(request: Request, db: Session = Depends(get_db)):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except Exception as e:
        print(f"CRITICAL ERROR DECODING TOKEN: {e}")
        raise HTTPException(status_code=401, detail="Invalid token")
    user = db.query(models.User).filter(models.User.email == payload.get("sub")).first()
    if not user:
        raise HTTPException(status_code=401, detail="User no longer exists")
    pages = [p.page for p in db.query(models.UserPage).filter(models.UserPage.user_id == user.id).all()]
    return {"id": user.id, "email": user.email, "role": user.role, "pages": pages}

# --- PAGE ASSIGNMENT (Owner only) ---
@app.get("/api/users")
def list_users(db: Session = Depends(get_db), user: dict = Depends(require_role(["Owner"]))):
    out = []
    for u in db.query(models.User).all():
        pages = [p.page for p in db.query(models.UserPage).filter(models.UserPage.user_id == u.id).all()]
        out.append({"id": u.id, "email": u.email, "role": u.role, "pages": pages})
    return out

@app.put("/api/users/{user_id}/pages")
def set_user_pages(user_id: int, body: PageAssignment, db: Session = Depends(get_db),
                   user: dict = Depends(require_role(["Owner"]))):
    target = db.get(models.User, user_id)
    if not target:
        raise HTTPException(status_code=404, detail="User not found")
    invalid = [p for p in body.pages if p not in ALL_PAGES]
    if invalid:
        raise HTTPException(status_code=400, detail=f"Unknown pages: {invalid}")
    pages = sorted(set(body.pages))
    db.query(models.UserPage).filter(models.UserPage.user_id == user_id).delete()
    for p in pages:
        db.add(models.UserPage(user_id=user_id, page=p))
    write_audit(db, user["sub"], "ASSIGN_PAGES", f"{target.email}: {pages}")
    db.commit()
    return {"user_id": user_id, "pages": pages}

@app.get("/api/dashboard/stats")
def get_dashboard_stats(db: Session = Depends(get_db), user: dict = Depends(require_role(["Owner", "Store Manager"]))):
    return {
        "total_products": db.query(models.Product).count(),
        "total_customers": db.query(models.Customer).count(),
        "open_complaints": db.query(models.Complaint).filter(models.Complaint.status == "open").count(),
        "total_sales": 0.00,
        "low_stock": 0,
    }

