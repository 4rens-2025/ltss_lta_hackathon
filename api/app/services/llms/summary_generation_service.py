import os
from dotenv import load_dotenv
from crewai import LLM
from app.services.llms.roadSeek import RoadSeek
from app.services.data_fetchers import TrafficIncidentsFetcher

load_dotenv()

DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")


class SummaryGenerationService:

    def __init__(self):
        self._road_seek_crew = RoadSeek(
            llm=LLM(
                model="deepseek/deepseek-chat",
                api_key=DEEPSEEK_API_KEY,
            )
        ).crew()

    async def trigger_generate_summary(self) -> str:
        data = await TrafficIncidentsFetcher().fetch()
        result = await self._road_seek_crew.kickoff_async(
            inputs={"data": data.model_dump_json()}
        )
        return result
