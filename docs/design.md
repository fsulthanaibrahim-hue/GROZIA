# GROZIA Database Design

## Part 1: Tables and Columns (ER Diagram)
*(Every table has a `shop_id` so data is separated by shop).*

- **users:** `id`, `email`, `password`, `role` (Owner, Store Manager, Accountant)
- **shops:** `id`, `name`, `address`
- **categories:** `id`, `shop_id`, `name`
- **products:** `id`, `shop_id`, `category_id`, `name`, `price`, `reorder_level`
- **suppliers:** `id`, `shop_id`, `name`, `contact_email`
- **customers:** `id`, `shop_id`, `name`, `credit_limit`
- **sales:** `id`, `shop_id`, `total_amount`, `created_at`
- **sale_lines:** `id`, `sale_id`, `product_id`, `quantity`, `price_at_sale`
- **daily_stock:** `id`, `product_id`, `date`, `closing_stock`
- **invoices:** `id`, `shop_id`, `customer_id`, `amount`, `due_date`, `status`
- **payments:** `id`, `invoice_id`, `amount_paid`, `paid_at`
- **complaints:** `id`, `shop_id`, `customer_id`, `product_id`, `category`, `status`
- **documents & chunks:** `id`, `shop_id`, `content`, `vector_embedding`
- **audit_log:** `id`, `user_id`, `action`, `created_at`

## Part 2: Shop Rules (Toolkit F)
These are the strict rules for the code:
1. **Exact Money:** Store money as `Decimal` with 2 decimal places, never a float.
2. **Stock:** One closing-stock row per product per day. Out of stock = closing stock is 0.
3. **Transactions:** Save a sale and its stock change in one transaction (so stock never goes negative).
4. **Overdue:** Calculate days overdue from the due date and payments. Never store a "days_overdue" number.
5. **Complaints:** Must have a fixed category (availability, quality, price, service, other) and status (open, replied, resolved).
6. **Compare Like with Like:** "This week vs last week" means the same 7 days, calculated in code.
7. **The Seed Story:** Plant a story where two bestsellers run out for 3+ days, causing a rise in complaints.
8. **Refuse Tax:** The AI must refuse GST/legal questions and point to a chartered accountant.