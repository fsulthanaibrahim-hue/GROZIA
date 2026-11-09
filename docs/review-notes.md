# Day 1 Review Notes

## What makes a system agentic?
A system is agentic when it is given a goal and a set of tools, and it decides in a loop which tools to call until the goal is met. It doesn't just generate text; it takes actions based on live data. One agent decides which tools to call, rather than having six separate agents talking to each other.

## Draft Conversion (Toolkit A)
My original draft had six separate agents. I have converted them into tools (sales_comparison, feedback_summary, etc.) that ONE single agent can call. I also cut Task Management entirely because it is not allowed.

## Reviewer Walkthrough
### 1. My Must List (from MoSCoW)
- Login and 3 roles (Owner, Store Manager, Accountant).
- Core shop data: products, sales, stock, invoices, complaints, dashboard.
- The 3 Agent Jobs and the 8 Tools.
- The Agent Toggle (AGENT_ENABLED off by default).

### 2. Roles Table (Toolkit G)
- **Owner:** Approves POs and reminders. Manages users.
- **Store Manager:** Manages products, sales, and complaint replies. Cannot approve POs.
- **Accountant:** Manages invoices, payments, and expenses. Cannot touch stock.

### 3. Agent Job 1 (Sales Drop)
- **Ask:** "Sales dropped this week. Find out why and fix what you can."
- **What it does:** Compares this week to last week using `sales_comparison`, checks stock using `stock_status`, reads complaints using `feedback_summary`, and drafts a `draft_purchase_order`.
- **Approval:** The Owner must approve the purchase order before it is emailed.

### Reviewer Answers
- **Q:** Are there any task management features? 
- **A:** No, task management is explicitly in the "Won't" list.
- **Q:** Are there six separate agents?
- **A:** No, there is one agent that uses eight tools.
- **Q:** Can the app run without the AI?
- **A:** Yes, `AGENT_ENABLED` will default to false, and all screens will work normally.