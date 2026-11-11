# 3. MongoDB for agent traces
## Decision
We will store the AI agent traces (the step-by-step logs of what the AI thought and did) in MongoDB.
## Why?
Traces have no fixed schema (the AI might take 2 steps or 10 steps). MongoDB handles flexible JSON documents much better than SQL tables for this specific task.