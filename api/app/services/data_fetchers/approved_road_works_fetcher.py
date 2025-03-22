from typing import Type

from app.models.api_responses.approved_road_work import (
    ApprovedRoadWorkResponse,
)
from app.services.data_fetchers.generic_fetcher import GenericFetcher


class ApprovedRoadWorksFetcher(GenericFetcher[ApprovedRoadWorkResponse]):
    url: str = "https://datamall2.mytransport.sg/ltaodataservice/RoadWorks"
    field_key: str = "approved_road_works"
    response_model: Type[ApprovedRoadWorkResponse] = ApprovedRoadWorkResponse
