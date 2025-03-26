import asyncio
from typing import Annotated
from fastapi import APIRouter, Depends

from app.services.llms.summary_generation_service import SummaryGenerationService


router = APIRouter(prefix="/llm")


@router.post("/trigger_summary_generation")
async def trigger_summary_generation(
    summary_generation_service=Depends(SummaryGenerationService),
):
    asyncio.create_task(summary_generation_service.trigger_generate_summary())
    return "Summary generation triggered"
