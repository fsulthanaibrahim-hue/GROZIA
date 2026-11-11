# GROZIA Architecture Diagram

```text
[ User Browser ]
       |
       v
[ Next.js Web App (apps/web) ]
       |
       v
[ Nginx Reverse Proxy ]
       |
       +-------------------+-------------------+
       |                   |                   |
       v                   v                   v
[ FastAPI (services/api) ] [ Flask Action ] [ Redis ]
       |                   Executor     (Cache/Queue)
       |
       +--- Talks to ---> [ OpenAI/Gemini LLM ]
       |
       +--- Reads/Writes ---> [ PostgreSQL + pgvector ]
       |                      (Shop Data & Policies)
       |
       +--- Writes Traces ---> [ MongoDB ]