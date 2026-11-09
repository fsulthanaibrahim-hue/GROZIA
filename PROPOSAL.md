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

## 4. User Stories
1. As the Owner, I want to log in securely so only staff can see data.
2. As the Store Manager, I want to record sales so stock updates automatically.
3. As the Accountant, I want to record invoices so we can track who owes money.
4. As the Owner, I want a dashboard showing total sales so I know how the shop is doing.
5. As the Store Manager, I want to log complaints so the AI can help me reply.
6. As the Owner, I want an Audit Log so I can see who edited what.

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