from fastapi import APIRouter
from app.api.v1.endpoints import predictions, reddit, health

api_router = APIRouter()

api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(predictions.router, prefix="/predictions", tags=["predictions"])
api_router.include_router(reddit.router, prefix="/reddit", tags=["reddit"])