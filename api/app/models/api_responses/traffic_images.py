from enum import Enum
from pydantic import BaseModel, Field


class TrafficImages(BaseModel):
    camera_id: str = Field(..., alias="CameraID")
    latitude: float = Field(..., alias="Latitude")
    longitude: float = Field(..., alias="Longitude")
    image_link: str = Field(..., alias="ImageLink")


class TrafficImagesResponse(BaseModel):
    odata_metadata: str = Field(..., alias="odata.metadata")
    value: list[TrafficImages]
