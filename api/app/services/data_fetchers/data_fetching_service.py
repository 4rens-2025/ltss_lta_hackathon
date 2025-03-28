from app.services.data_fetchers import (
    ApprovedRoadWorksFetcher,
    FaultyTrafficLightsFetcher,
    TrafficImagesFetcher,
    TrafficIncidentsFetcher,
    TrafficSpeedBandsFetcher,
)


class DataFetchingService:
    def __init__(self):
        self.data_fetches = [
            ApprovedRoadWorksFetcher(),
            TrafficIncidentsFetcher(),
            TrafficImagesFetcher(),
            TrafficSpeedBandsFetcher(),
            # FaultyTrafficLightsFetcher(),
        ]

    async def fetch_combined_data(self) -> dict:
        combined_data = {}
        for fetcher in self.data_fetches:
            data = await fetcher.fetch()
            combined_data[fetcher.field_key] = data.dict()
        return combined_data
