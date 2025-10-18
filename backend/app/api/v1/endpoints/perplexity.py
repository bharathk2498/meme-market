from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from typing import Optional
from slowapi import Limiter
from slowapi.util import get_remote_address
from app.services.perplexity_service import PerplexityService
from app.core.config import settings

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

class MemeAnalysisRequest(BaseModel):
    title: str
    subreddit: Optional[str] = "memes"
    score: Optional[int] = 0
    num_comments: Optional[int] = 0
    age_hours: Optional[float] = 0

@router.post("/analyze-meme")
@limiter.limit(f"{settings.RATE_LIMIT_PER_MINUTE}/minute")
async def analyze_meme(request: Request, meme: MemeAnalysisRequest):
    """
    Analyze if a meme/post will go viral using Perplexity AI.
    
    This uses real-time web search to check if the topic is trending.
    """
    try:
        service = PerplexityService()
        result = await service.analyze_meme_virality(meme.dict())
        
        if result["success"]:
            return {
                "success": True,
                "analysis": result["prediction"],
                "message": "Analysis complete"
            }
        else:
            # Return error but don't crash
            return {
                "success": False,
                "error": result.get("error", "Unknown error"),
                "message": "Perplexity API not available or configured"
            }
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/trending-now")
@limiter.limit(f"{settings.RATE_LIMIT_PER_MINUTE}/minute")
async def get_trending_now(request: Request):
    """
    Get current trending topics across the web.
    """
    try:
        service = PerplexityService()
        result = await service.get_trending_topics()
        
        if result["success"]:
            return {
                "success": True,
                "trending": result["data"],
                "message": "Trending topics retrieved"
            }
        else:
            return {
                "success": False,
                "error": result.get("error"),
                "message": "Unable to fetch trending topics"
            }
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))