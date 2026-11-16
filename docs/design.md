# GROZIA — Database Design & ER Diagram

> **Multi-tenancy rule:** Every table carries a `shop_id` (directly or via FK chain) so data is isolated per shop.

---

## 1. Entity-Relationship Diagram

```mermaid
erDiagram
    SHOPS ||--o{ USERS : "employs"
    SHOPS ||--o{ CATEGORIES : "has"
    SHOPS ||--o{ SUPPLIERS : "has"
    SHOPS ||--o{ PRODUCTS : "sells"
    SHOPS ||--o{ CUSTOMERS : "serves"
    SHOPS ||--o{ SALES : "records"
    SHOPS ||--o{ INVOICES : "issues"
    SHOPS ||--o{ COMPLAINTS : "receives"
    SHOPS ||--o{ DOCUMENTS : "stores"

    CATEGORIES ||--o{ PRODUCTS : "categorizes"
    SUPPLIERS ||--o{ PRODUCTS : "supplies"

    CUSTOMERS ||--o{ INVOICES : "owes"
    CUSTOMERS ||--o{ COMPLAINTS : "files"

    PRODUCTS ||--o{ SALE_LINES : "included_in"
    PRODUCTS ||--o{ DAILY_STOCK : "tracks"
    PRODUCTS ||--o{ COMPLAINTS : "regarding"

    SALES ||--|{ SALE_LINES : "contains"
    INVOICES ||--o{ PAYMENTS : "receives"

    USERS ||--o{ AUDIT_LOG : "performs"

    SHOPS {
        int id PK
        string name
        text address
    }

    USERS {
        int id PK
        int shop_id FK
        string email UK
        string password_hash
        string role "Owner | Store Manager | Accountant"
    }

    CATEGORIES {
        int id PK
        int shop_id FK
        string name
    }

    SUPPLIERS {
        int id PK
        int shop_id FK
        string name
        string contact_email
    }

    PRODUCTS {
        int id PK
        int shop_id FK
        int category_id FK
        string name
        decimal price "DECIMAL(10,2) — Rule 1"
        int reorder_level
    }

    CUSTOMERS {
        int id PK
        int shop_id FK
        string name
        decimal credit_limit "DECIMAL(10,2)"
    }

    SALES {
        int id PK
        int shop_id FK
        decimal total_amount "DECIMAL(10,2)"
        datetime created_at
    }

    SALE_LINES {
        int id PK
        int sale_id FK
        int product_id FK
        int quantity
        decimal price_at_sale "DECIMAL(10,2)"
    }

    DAILY_STOCK {
        int id PK
        int product_id FK
        date date
        int closing_stock "CHECK >= 0 — Rule 3"
    }

    INVOICES {
        int id PK
        int shop_id FK
        int customer_id FK
        decimal amount "DECIMAL(10,2)"
        date due_date
        string status
    }

    PAYMENTS {
        int id PK
        int invoice_id FK
        decimal amount_paid "DECIMAL(10,2)"
        datetime paid_at
    }

    COMPLAINTS {
        int id PK
        int shop_id FK
        int customer_id FK
        int product_id FK
        string category "availability | quality | price | service | other"
        string status "open | replied | resolved"
    }

    DOCUMENTS {
        int id PK
        int shop_id FK
        text content
        vector vector_embedding "pgvector(1536)"
    }

    AUDIT_LOG {
        int id PK
        int user_id FK
        string action
        datetime created_at
    }