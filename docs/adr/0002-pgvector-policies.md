# 2. pgvector for the policies
## Decision
We will store the shop's policy documents and their embeddings in PostgreSQL using the `pgvector` extension.
## Why?
It allows us to search for policies based on meaning (RAG), not just exact keywords, so the AI can find the right rules.