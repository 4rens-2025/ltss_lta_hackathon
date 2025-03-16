import os
import httpx
from dotenv import load_dotenv
from pydantic import BaseModel, Field
from typing import Type, TypeVar, Generic
from fastapi import FastAPI, HTTPException

T = TypeVar("T", bound=BaseModel)

app = FastAPI()

load_dotenv()


class GenericFetcher(BaseModel, Generic[T]):
    url: str = Field(..., description="API URL to fetch data from")
    response_model: Type[T]

    async def fetch(self) -> T:
        headers = {"AccountKey": os.getenv("DATAMALL_TOKEN") or ""}
        async with httpx.AsyncClient() as client:
            response = await client.get(self.url, headers=headers)
            if response.status_code != 200:
                raise HTTPException(
                    status_code=response.status_code, detail="Failed to fetch data"
                )
            return self.response_model(**response.json())
