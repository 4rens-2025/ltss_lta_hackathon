from enum import Enum
from pydantic import BaseModel, Field


class RoadCategory(str, Enum):
    EXPRESSWAYS = "A"
    MAJOR_ARTERIAL_ROADS = "B"
    ARTERIAL_ROADS = "C"
    MINOR_ARTERIAL_ROADS = "D"
    SMALL_ROADS = "E"
    SLIP_ROADS = "F"
    NO_CATEGORY = "G"


class TrafficSpeedBand(BaseModel):
    link_id: str = Field(..., alias="LinkID")
    road_name: str = Field(..., alias="RoadName")
    road_category: str = Field(..., alias="RoadCategory")
    speed_band: int = Field(..., alias="SpeedBand")
    min_speed: str = Field(..., alias="MinimumSpeed")
    max_speed: str = Field(..., alias="MaximumSpeed")
    start_longitude: float = Field(..., alias="StartLon")
    start_latitude: float = Field(..., alias="StartLat")
    end_longitude: float = Field(..., alias="EndLon")
    end_latitude: float = Field(..., alias="EndLat")


class TrafficSpeedBandsResponse(BaseModel):
    odata_metadata: str = Field(..., alias="odata.metadata")
    last_updated_time: str = Field(..., alias="lastUpdatedTime")
    value: list[TrafficSpeedBand]
