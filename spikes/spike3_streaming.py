# spike3_streaming.py
import asyncio
from fastapi import FastAPI
from fastapi.responses import StreamingResponse

app = FastAPI()

# This is the fake AI generating a response word by word
async def fake_ai_stream():
    words = ["I", "checked", "the", "sales", "and", "Milk", "is", "out", "of", "stock."]
    for word in words:
        yield f"data: {word}\n\n"
        await asyncio.sleep(0.5) # Wait half a second between words

@app.get("/stream")
async def stream_response():
    # This tells the server to send the stream instead of waiting for the whole message
    return StreamingResponse(fake_ai_stream(), media_type="text/event-stream")