import random
from datetime import datetime, timedelta
from faker import Faker
import sys
import os

# Add services/api to path so we can import models
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'services', 'api'))

from database import SessionLocal, engine
import models
from decimal import Decimal

models.Base.metadata.create_all(bind=engine)

fake = Faker('en_IN')
random.seed(42)  # Fixed seed so data is reproducible

def seed():
    db = SessionLocal()
    
    # 1. Idempotency check
    if db.query(models.Product).count() > 0:
        print("Database already seeded!")
        db.close()
        return

    # 2. Suppliers (15)
    print("Seeding suppliers...")
    suppliers = []
    for _ in range(15):
        s = models.Supplier(name=fake.company(), contact_email=fake.email())
        suppliers.append(s)
    db.add_all(suppliers)
    db.commit()

    # 3. Products (120)
    print("Seeding products...")
    categories = ["Dairy", "Bakery", "Beverages", "Snacks", "Produce"]
    products = []
    for i in range(120):
        p = models.Product(
            name=fake.word().capitalize() + " " + fake.word(),
            category=random.choice(categories),
            price=Decimal(random.randint(10, 500)),
            reorder_level=random.randint(5, 20),
            supplier_id=random.choice(suppliers).id
        )
        products.append(p)
    db.add_all(products)
    db.commit()

    # 4. Mark two bestsellers (the planted story)
    bestseller_1 = products[0]
    bestseller_2 = products[1]

    # 5. Customers (60)
    print("Seeding customers...")
    customers = []
    for _ in range(60):
        c = models.Customer(name=fake.name(), credit_limit=Decimal(random.randint(1000, 50000)))
        customers.append(c)
    db.add_all(customers)
    db.commit()

    # 6. Sales & Complaints (90 days)
    print("Seeding sales and complaints...")
    today = datetime.utcnow().date()
    for day_offset in range(90):
        day = today - timedelta(days=89 - day_offset)
        
        # The latest week: days 83-89 (last 7 days)
        is_latest_week = day_offset >= 83
        
        # Normal days: 20-40 sales
        num_sales = random.randint(20, 40)
        
        for _ in range(num_sales):
            # 30% chance it's one of the bestsellers
            if random.random() < 0.3:
                product = random.choice([bestseller_1, bestseller_2])
            else:
                product = random.choice(products)
            
            # PLANTED STORY: In the latest week, bestsellers have ZERO sales
            # (they ran out of stock entirely)
            if is_latest_week and product in [bestseller_1, bestseller_2]:
                continue  # Skip all their sales this week
            
            qty = random.randint(1, 5)
            sale = models.Sale(
                product_id=product.id,
                quantity=qty,
                total=product.price * qty,
                created_at=datetime.combine(day, datetime.min.time())
            )
            db.add(sale)
        
        # Complaints (2-4 per day)
        num_complaints = random.randint(2, 4)
        for _ in range(num_complaints):
            # PLANTED STORY: In the latest week, ALL complaints are availability
            if is_latest_week:
                product = random.choice([bestseller_1, bestseller_2])
                category = "availability"
            else:
                product = random.choice(products)
                category = random.choice(["availability", "quality", "price", "service", "other"])
            
            c = models.Complaint(
                product_id=product.id,
                customer_name=fake.name(),
                category=category,
                description=fake.sentence(),
                status=random.choice(["open", "open", "replied", "resolved"]),
                created_at=datetime.combine(day, datetime.min.time())
            )
            db.add(c)
    
    db.commit()

    # 7. Invoices (~150) - some overdue
    print("Seeding invoices...")
    for i in range(150):
        # 30% of invoices are overdue (30+ days old)
        if i < 45:
            days_ago = random.randint(35, 60)
        else:
            days_ago = random.randint(0, 30)
        
        inv = models.Invoice(
            customer_id=random.choice(customers).id,
            amount=Decimal(random.randint(500, 20000)),
            due_date=datetime.utcnow() + timedelta(days=-days_ago + 30),
            status="open" if days_ago < 30 else "overdue"
        )
        db.add(inv)
    
    db.commit()
    
    print("\n✅ Seeding complete!")
    print(f"   - {len(suppliers)} suppliers")
    print(f"   - {len(products)} products")
    print(f"   - {len(customers)} customers")
    print(f"   - ~{db.query(models.Sale).count()} sales")
    print(f"   - ~{db.query(models.Complaint).count()} complaints")
    print(f"   - {db.query(models.Invoice).count()} invoices")
    print(f"\n🌱 Planted story: Bestsellers {bestseller_1.id} and {bestseller_2.id} have ZERO sales in the latest week, availability complaints spiked!")
    
    db.close()

if __name__ == "__main__":
    seed()