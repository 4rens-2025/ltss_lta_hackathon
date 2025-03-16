from fastapi_utilities import repeat_every
from fastapi import HTTPException
import requests
import os
from dotenv import load_dotenv
from app.services.websocket.connection_manager import manager

# Load environment variables from .env file
load_dotenv()

DATAMALL_TOKEN = os.getenv("DATAMALL_TOKEN")

API_URL = "https://datamall2.mytransport.sg/ltaodataservice/Traffic-Imagesv2"


@repeat_every(seconds=5)
async def fetch_image():
    headers = {"AccountKey": DATAMALL_TOKEN, "accept": "application/json"}

    response = requests.get(API_URL, headers=headers)

    if response.status_code == 200:
        data = response.json()
        # Broadcast the data to all connected clients
        await manager.broadcast(data)
        # print("Done sending image")
    else:
        raise HTTPException(
            status_code=response.status_code, detail="Failed to fetch data"
        )
