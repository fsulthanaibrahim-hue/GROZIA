# GROZIA — Proposal

**Name:** Fathimath Sulthana
**Project:** ShopOps Copilot for a Supermarket
**Track:** A (AWS)

## 1. The Problem
Our supermarket tracks sales, stock, money, and complaints across notebooks and spreadsheets. When sales drop, nobody can tell if it was stock-outs or complaints. We need one place that shows what happened and helps us act fast.

## 2. The Users
**Persona 1: The Owner (Rajesh)**
- Wants to know why sales dropped and fix it fast.
- Hates digging through spreadsheets.
- Checks the app every morning.

**Persona 2: The Accountant (Anjali)**
- Wants to chase overdue payments politely.
- Hates manually checking invoice dates.
- Uses the app twice a week.

## 3. Roles
- **Owner:** Approves everything.
- **Store Manager:** Manages products, sales, and complaints.
- **Accountant:** Manages invoices and payments.

## 4. User Stories (12 to 15)
1. **Login:** As the Owner, I want to log in securely so only staff can see data.
   - *Given* a seeded Owner account
   - *When* I enter valid credentials
   - *Then* I land on the dashboard.
2. **Record Sales:** As the Store Manager, I want to record sales so stock updates automatically.
   - *Given* I have 10 units of a product
   - *When* I record a sale of 2 units
   - *Then* the stock becomes 8.
3. **Record Invoices:** As the Accountant, I want to record invoices so we can track who owes money.
   - *Given* a credit customer
   - *When* I create an invoice for ₹5,000
   - *Then* the customer owes ₹5,000.
4. **Dashboard:** As the Owner, I want a dashboard showing total sales so I know how the shop is doing.
   - *Given* sales have been recorded
   - *When* I open the dashboard
   - *Then* I see the total sales figure.
5. **Log Complaints:** As the Store Manager, I want to log complaints so the AI can help me reply.
   - *Given* a customer has a problem
   - *When* I log a complaint
   - *Then* it appears in the unresolved list.
6. **Audit Log:** As the Owner, I want an Audit Log so I can see who edited what.
   - *Given* a user makes a change
   - *When* the change is saved
   - *Then* a new row appears in the audit log.
7. **Inventory:** As the Owner, I want to add new products and set a reorder level.
   - *Given* a new item arrives
   - *When* I add it with a price and reorder level
   - *Then* it appears in the catalog.
8. **Manage Suppliers:** As the Owner, I want to manage supplier details.
   - *Given* a supplier
   - *When* I save their contact info
   - *Then* they are available for purchase orders.
9. **Manage Customers:** As the Owner, I want to manage credit customers.
   - *Given* a new customer
   - *When* I save their credit limit
   - *Then* they can be invoiced.
10. **Manage Stock:** As the Store Manager, I want to see current stock levels.
    - *Given* products exist
    - *When* I view the inventory
    - *Then* I see the stock quantity for each.
11. **Agent Toggle:** As the Owner, I want an `AGENT_ENABLED` switch so the app works without AI.
    - *Given* the AI is turned off
    - *When* I use the app
    - *Then* every screen still works normally.
12. **Approve Purchase Order:** As the Owner, I want to approve purchase orders before they are sent.
    - *Given* a draft purchase order
    - *When* I click approve
    - *Then* the Flask Action Executor emails it once.

## 5. The Three Agent Jobs
1. **Job 1 (Sales Drop):** The AI checks sales, stock, and complaints, then drafts a Purchase Order for the Owner to approve.
2. **Job 2 (Overdue Payments):** The AI finds late invoices and drafts Reminder Emails for the Owner to approve.
3. **Job 3 (Complaints):** The AI reads complaints and drafts Replies for the Store Manager to approve.

## 6. The Eight Tools
1. `policy_search`: Finds store rules.
2. `sales_comparison`: Compares sales between weeks.
3. `stock_status`: Checks current stock.
4. `feedback_summary`: Reads complaints.
5. `overdue_invoices`: Finds late payments.
6. `draft_purchase_order`: Creates an order draft.
7. `draft_payment_reminder`: Creates an email draft.
8. `draft_customer_reply`: Creates a complaint reply draft.

## 7. Scope (What we build)
- **Must:** Login, roles, products, sales, stock, invoices, complaints, dashboard, 3 Agent Jobs, 8 Tools.
- **Should:** Expenses.
- **Could:** Monthly reports.
- **Won't:** Task management, multiple agents.

## 8. Future Eval Cases (Tests for the AI)
- `eval_job1_completes_sales_drop_with_figures` (Should complete)
- `eval_job1_refuses_to_guess_cause_without_data` (Should refuse)
- `eval_job2_completes_overdue_reminders_with_policy_citation` (Should complete)
- `eval_job2_refuses_gst_advice` (Should refuse)
- `eval_job3_completes_refund_only_where_policy_allows` (Should complete)
- `eval_job3_refuses_refund_outside_return_window` (Should refuse)