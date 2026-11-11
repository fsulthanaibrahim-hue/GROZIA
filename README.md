# GROZIA — ShopOps Copilot

An AI Business Operations Manager for a neighbourhood supermarket.

![CI](https://github.com/fsulthanaibrahim-hue/GROZIA/actions/workflows/ci.yml/badge.svg)

## What it does
- **Knows:** Answers from shop policies with citations
- **Checks:** Reads live sales, stock, invoices, and complaints
- **Acts:** Prepares purchase orders, reminders, and replies that require human approval
- **Works without AI:** Every screen works with `AGENT_ENABLED=false`

## Architecture
Next.js · FastAPI · PostgreSQL · Redis · MongoDB · Flask · Nginx · Docker

## Week 1 Deliverables (v0.1)
- [x] Proposal, data model, 5 ADRs
- [x] 3 AI Spikes (tool calling, retrieval, streaming)
- [x] Walking Skeleton (Docker Compose)
- [x] JWT Auth + 3 Roles + Audit Log
- [x] Seed data with a planted story
- [x] CI Pipeline (green)