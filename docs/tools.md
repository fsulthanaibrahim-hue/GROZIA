# GROZIA Agent Tools

These are the 8 tools the AI can use. The AI never writes SQL; it only calls these specific tools.

### 1. policy_search (Knowledge)
- **Called by:** All roles
- **Input:** `query` (string)
- **What it does:** Finds passages in the shop's policies and returns them with citations.

### 2. sales_comparison (Read)
- **Called by:** Owner, Store Manager
- **Input:** `start_date`, `end_date`, `compare_to_start`, `compare_to_end`
- **What it does:** Compares sales between two periods.

### 3. stock_status (Read)
- **Called by:** Owner, Store Manager
- **Input:** `product_ids` (list, maximum 50 items), `date_range`
- **Output Limit:** Returns a maximum of 10 rows.
- **What it does:** Returns current stock, days out of stock, reorder level, and supplier.

### 4. feedback_summary (Read)
- **Called by:** Owner, Store Manager
- **Input:** `start_date`, `end_date`
- **What it does:** Returns complaints by category, with product and status.

### 5. overdue_invoices (Read)
- **Called by:** Owner, Accountant
- **Input:** `days_overdue` (integer)
- **What it does:** Finds credit customers with invoices overdue by at least X days.

### 6. draft_purchase_order (Write)
- **Called by:** Owner, Store Manager (Owner approves)
- **Input:** `supplier_id`, `product_id`, `quantity`
- **What it does:** Proposes an order to a supplier.

### 7. draft_payment_reminder (Write)
- **Called by:** Owner, Accountant (Owner approves)
- **Input:** `customer_id`, `invoice_ids`
- **What it does:** Proposes a reminder email to a customer.

### 8. draft_customer_reply (Write)
- **Called by:** Owner, Store Manager (SM/Owner approves)
- **Input:** `complaint_id`, `reply_text`
- **What it does:** Proposes a reply to a complaint.