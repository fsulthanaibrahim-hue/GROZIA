# 5. One agent with tools instead of six agents
## Decision
We will use one single AI agent that has access to 8 tools, rather than six separate AI agents talking to each other.
## Why?
Our original draft had six agents. That is too complex and expensive. One agent deciding which tool to call is standard practice, easier to debug, and follows the course rules.