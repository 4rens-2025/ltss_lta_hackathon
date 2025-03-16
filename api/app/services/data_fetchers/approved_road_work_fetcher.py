from typing import Type

from app.models.api_responses.approved_road_work import (
    ApprovedRoadWorkResponse,
)
from app.services.data_fetchers.generic_fetcher import GenericFetcher


class ApprovedRoadWorkFetcher(GenericFetcher[ApprovedRoadWorkResponse]):
    url: str = "https://datamall2.mytransport.sg/ltaodataservice/RoadWorks"
    response_model: Type[ApprovedRoadWorkResponse] = ApprovedRoadWorkResponse
