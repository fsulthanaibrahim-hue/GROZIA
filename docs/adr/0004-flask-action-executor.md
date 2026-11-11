# 4. The Flask Action Executor
## Decision
We will build a separate Flask service to execute approved actions (like sending emails).
## Why?
Safety. The main FastAPI app is connected to the AI. By using a separate Flask app to actually send emails, we ensure that only approved actions leave the system, and exactly once.