from fastapi import APIRouter, Depends, HTTPException, Request
from typing import List, Optional
from slowapi import Limiter
from slowapi.util import get_remote_address
from app.services.prediction_service import PredictionService
from app.core.config import settings

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

@router.get("/top")
@limiter.limit(f"{settings.RATE_LIMIT_PER_MINUTE}/minute")
async def get_top_predictions(request: Request, limit: int = 10):
    try:
        service = PredictionService()
        predictions = await service.get_top_predictions(limit=limit)
        return {
            "success": True,
            "count": len(predictions),
            "predictions": predictions
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to fetch predictions")

@router.get("/trending")
@limiter.limit(f"{settings.RATE_LIMIT_PER_MINUTE}/minute")
async def get_trending(request: Request, hours: int = 24):
    try:
        service = PredictionService()
        trending = await service.get_trending(hours=hours)
        return {
            "success": True,
            "count": len(trending),
            "trending": trending
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to fetch trending posts")

@router.get("/subreddit/{subreddit}")
@limiter.limit(f"{settings.RATE_LIMIT_PER_MINUTE}/minute")
async def get_subreddit_predictions(request: Request, subreddit: str, limit: int = 10):
    try:
        service = PredictionService()
        predictions = await service.get_subreddit_predictions(subreddit=subreddit, limit=limit)
        return {
            "success": True,
            "subreddit": subreddit,
            "count": len(predictions),
            "predictions": predictions
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to fetch subreddit predictions")