import asyncio
import json
from typing import Annotated, Any
from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect

from app.services.data_fetchers.data_fetching_service import DataFetchingService

router = APIRouter()


@router.websocket("/ws/dashboard")
async def websocket_endpoint(
    websocket: WebSocket,
    data_fetching_service: Annotated[DataFetchingService, Depends()],
):
    await websocket.accept()
    try:
        while True:
            combined_data = await data_fetching_service.fetch_combined_data()
            await websocket.send_text(json.dumps(combined_data))
            await asyncio.sleep(5)
    except WebSocketDisconnect:
        print("Client disconnected")
