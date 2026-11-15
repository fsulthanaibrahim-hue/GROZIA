# GROZIA Database Design

## Part 1: ER Diagram (Visual Map)

```mermaid
erDiagram
    USERS {
        int id PK
        string email
        string role
    }
    SHOPS {
        int id PK
        string name
        string address
    }
    CATEGORIES {
        int id PK
        int shop_id FK
        string name
    }
    PRODUCTS {
        int id PK
        int shop_id FK
        int category_id FK
        string name
        decimal price
        int reorder_level
    }
    SUPPLIERS {
        int id PK
        int shop_id FK
        string name
        string contact_email
    }
    CUSTOMERS {
        int id PK
        int shop_id FK
        string name
        decimal credit_limit
    }
    SALES {
        int id PK
        int shop_id FK
        decimal total_amount
        datetime created_at
    }
    SALE_LINES {
        int id PK
        int sale_id FK
        int product_id FK
        int quantity
        decimal price_at_sale
    }
    DAILY_STOCK {
        int id PK
        int product_id FK
        date date
        int closing_stock
    }
    INVOICES {
        int id PK
        int shop_id FK
        int customer_id FK
        decimal amount
        date due_date
        string status
    }
    PAYMENTS {
        int id PK
        int invoice_id FK
        decimal amount_paid
        datetime paid_at
    }
    COMPLAINTS {
        int id PK
        int shop_id FK
        int customer_id FK
        int product_id FK
        string category
        string status
    }
    AUDIT_LOG {
        int id PK
        int user_id FK
        string action
        datetime created_at
    }

    SHOPS ||--o{ PRODUCTS : "owns"
    SHOPS ||--o{ USERS : "employs"
    CATEGORIES ||--o{ PRODUCTS : "categorizes"
    SUPPLIERS ||--o{ PRODUCTS : "supplies"
    PRODUCTS ||--o{ SALE_LINES : "is sold in"
    PRODUCTS ||--o{ DAILY_STOCK : "has stock"
    PRODUCTS ||--o{ COMPLAINTS : "receives"
    SALES ||--o{ SALE_LINES : "contains"
    CUSTOMERS ||--o{ INVOICES : "is billed"
    INVOICES ||--o{ PAYMENTS : "is paid by"
    USERS ||--o{ AUDIT_LOG : "triggers"