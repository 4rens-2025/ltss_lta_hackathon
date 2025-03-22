import asyncio
import json
from typing import Any
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.services.data_fetchers import (
    ApprovedRoadWorksFetcher,
    FaultyTrafficLightsFetcher,
    TrafficImagesFetcher,
    TrafficIncidentsFetcher,
    TrafficSpeedBandsFetcher,
)

router = APIRouter()


@router.websocket("/ws/dashboard")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data_fetches = [
                ApprovedRoadWorksFetcher(),
                TrafficIncidentsFetcher(),
                TrafficImagesFetcher(),
                TrafficSpeedBandsFetcher(),
                FaultyTrafficLightsFetcher(),
            ]
            combined_data = {}
            for fetcher in data_fetches:
                data: Any = await fetcher.fetch()
                combined_data[fetcher.field_key] = data.dict()
            await websocket.send_text(json.dumps(combined_data))
            await asyncio.sleep(5)
    except WebSocketDisconnect:
        print("Client disconnected")
