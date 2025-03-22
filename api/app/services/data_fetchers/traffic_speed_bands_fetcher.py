from typing import Type

from app.models.api_responses.traffic_speed_bands import TrafficSpeedBandsResponse
from app.services.data_fetchers.generic_fetcher import GenericFetcher


class TrafficSpeedBandsFetcher(GenericFetcher[TrafficSpeedBandsResponse]):
    url: str = "https://datamall2.mytransport.sg/ltaodataservice/v3/TrafficSpeedBands"
    field_key: str = "traffic_speed_bands"
    response_model: Type[TrafficSpeedBandsResponse] = TrafficSpeedBandsResponse
