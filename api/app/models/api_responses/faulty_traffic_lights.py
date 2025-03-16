from enum import Enum
from pydantic import BaseModel, Field


class AlarmType(str, Enum):
    BLACKOUT = "4"
    FLASHING_YELLOW = "13"


class FaultyTrafficLight(BaseModel):
    alarm_id: str = Field(..., alias="AlarmID")
    node_id: str = Field(..., alias="NodeID")
    type: AlarmType = Field(..., alias="Type")
    start_date: str = Field(..., alias="StartDate")
    end_date: str = Field(..., alias="EndDate")
    message: str = Field(..., alias="Message")


class FaultyTrafficLightsResponse(BaseModel):
    odata_metadata: str = Field(..., alias="odata.metadata")
    value: list[FaultyTrafficLight]
