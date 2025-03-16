from typing import Type

from app.models.api_responses.traffic_incidents import TrafficIncidentsResponse
from app.services.data_fetchers.generic_fetcher import GenericFetcher


class TrafficIncidentsFetcher(GenericFetcher[TrafficIncidentsResponse]):
    url: str = "https://datamall2.mytransport.sg/ltaodataservice/TrafficIncidents"
    response_model: Type[TrafficIncidentsResponse] = TrafficIncidentsResponse
