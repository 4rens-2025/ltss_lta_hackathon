from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from app.routers.dashboard_router import router as dashboard_router
from app.routers.llm_router import router as llm_router
from app.services.data_fetchers import (
    fetch_image,
)
from app.services.websocket.connection_manager import manager

app = FastAPI()

# Add CORS middleware to allow frontend connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Specify your frontend origin in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(dashboard_router)
app.include_router(llm_router)


# WebSocket endpoint
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Keep connection alive
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/test")
async def test():
    return "lol"


@app.on_event("startup")
async def startup_event():
    await fetch_image()
