from enum import Enum
from pydantic import BaseModel, Field


class IncidentType(str, Enum):
    ACCIDENT = "Accident"
    ROAD_WORKS = "Roadwork"
    VEHICLE_BREAKDOWN = "Vehicle Breakdown"
    WEATHER = "Weather"
    OBSTACLE = "Obstacle"
    ROAD_BLOCK = "Road Block"
    HEAVY_TRAFFIC = "Heavy Traffic"
    MISC = "Misc."
    DIVERSION = "Diversion"
    UNATTENDED_VEHICLE = "Unattended Vehicle"


class TrafficIncident(BaseModel):
    type: IncidentType = Field(..., alias="Type")
    latitude: float = Field(..., alias="Latitude")
    longitude: float = Field(..., alias="Longitude")
    message: str = Field(..., alias="Message")


class TrafficIncidentsResponse(BaseModel):
    odata_metadata: str = Field(..., alias="odata.metadata")
    value: list[TrafficIncident]
