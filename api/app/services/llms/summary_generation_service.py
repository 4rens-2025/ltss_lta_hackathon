import asyncio
import os
from dotenv import load_dotenv
from crewai import LLM
from app.services.supabase.client import supabase_client
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

    async def get_latest_summary(self) -> dict | None:
        response = (
            supabase_client.table("generated_summary")
            .select("*")
            .order("created_at", desc=True)
            .limit(1)
            .execute()
        )
        if response.data:
            return response.data[0]

        return None

    async def trigger_generate_summary(self):
        latest_summary = await self.get_latest_summary()
        if latest_summary and latest_summary["status"] == "PENDING":
            return "Summary generation already in progress"

        asyncio.create_task(self.generate_summary_and_store_output())

        return "Summary generation triggered"

    async def generate_summary_and_store_output(self):
        response = supabase_client.table("generated_summary").insert({}).execute()
        new_summary = response.data[0]

        try:
            data = await TrafficIncidentsFetcher().fetch()
            result = (
                await self._road_seek_crew.kickoff_async(
                    inputs={"data": data.model_dump_json()}
                )
            ).raw
            supabase_client.table("generated_summary").update(
                {"summary": result, "status": "COMPLETED"}
            ).eq("id", new_summary["id"]).execute()
        except Exception as e:
            supabase_client.table("generated_summary").update(
                {"summary": e, "status": "FAILED"}
            ).eq("id", new_summary["id"]).execute()
