from typing import Type

from app.models.api_responses.faulty_traffic_lights import (
    FaultyTrafficLightsResponse,
)
from app.services.data_fetchers.generic_fetcher import GenericFetcher


class FaultyTrafficLightsFetcher(GenericFetcher[FaultyTrafficLightsResponse]):
    url: str = "https://datamall2.mytransport.sg/ltaodataservice/FaultyTrafficLights"
    response_model: Type[FaultyTrafficLightsResponse] = FaultyTrafficLightsResponse
