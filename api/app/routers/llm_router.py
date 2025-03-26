from fastapi import APIRouter, Depends

from app.services.llms.summary_generation_service import SummaryGenerationService


router = APIRouter(prefix="/llm")


@router.post("/trigger_summary_generation")
async def trigger_summary_generation(
    summary_generation_service=Depends(SummaryGenerationService),
):
    return await summary_generation_service.trigger_generate_summary()


@router.get("/latest_summary")
async def get_latest_summary(
    summary_generation_service=Depends(SummaryGenerationService),
):
    return await summary_generation_service.get_latest_summary()
