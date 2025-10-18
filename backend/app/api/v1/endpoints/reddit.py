from fastapi import APIRouter, HTTPException, BackgroundTasks
from app.services.reddit_service import RedditService

router = APIRouter()

@router.post("/collect")
async def trigger_collection(background_tasks: BackgroundTasks):
    try:
        service = RedditService()
        background_tasks.add_task(service.collect_posts)
        return {
            "success": True,
            "message": "Collection started in background"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to start collection")

@router.get("/status")
async def get_collection_status():
    try:
        service = RedditService()
        status = await service.get_status()
        return {
            "success": True,
            "status": status
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to get status")