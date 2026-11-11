# Day 3 Spikes

## Spike 1: Tool Calling
**Goal:** Write a hand-written agent loop that calls tools and stops after 8 steps.
**Result:** Success. The FakeLLM successfully called `sales_comparison` (returned -50% change) and `stock_status` (returned 0 stock, 4 days out). It combined these numbers into a final answer. No network was used.
**AI Usage Note:** The agent loop was written by hand without AI assistance, as required.

## Spike 2: Retrieval (RAG)
**Goal:** Search shop policies and reach hit@3 of at least 7/10. Refuse questions outside the documents.
**Result:** Success. Score: 10/10. The mock search successfully matched milk/return questions to the Returns Policy, and pay/late questions to the Credit Policy. Q10 ("What is the capital of France?") correctly triggered the refusal response: "I could not find this in your documents."

## Spike 3: Streaming
**Goal:** Stream tokens from FastAPI to the browser.
**Result:** Success. The FastAPI server used `StreamingResponse` to yield words one by one. The browser successfully received the stream via Server-Sent Events (SSE) with a `200 OK` status.
