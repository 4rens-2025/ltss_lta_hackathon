from pydantic import BaseModel, Field


class ApprovedRoadWork(BaseModel):
    event_id: str = Field(..., alias="EventID")
    road_name: str = Field(..., alias="RoadName")
    start_date: str = Field(..., alias="StartDate")
    end_date: str = Field(..., alias="EndDate")
    svc_dept: str = Field(..., alias="SvcDept")
    other: str = Field(..., alias="Other")


class ApprovedRoadWorkResponse(BaseModel):
    odata_metadata: str = Field(..., alias="odata.metadata")
    value: list[ApprovedRoadWork]
