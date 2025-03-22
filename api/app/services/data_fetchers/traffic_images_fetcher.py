from typing import Type

from app.models.api_responses.traffic_images import TrafficImagesResponse
from app.services.data_fetchers.generic_fetcher import GenericFetcher


class TrafficImagesFetcher(GenericFetcher[TrafficImagesResponse]):
    url: str = "https://datamall2.mytransport.sg/ltaodataservice/Traffic-Imagesv2"
    field_key: str = "traffic_images"
    response_model: Type[TrafficImagesResponse] = TrafficImagesResponse
