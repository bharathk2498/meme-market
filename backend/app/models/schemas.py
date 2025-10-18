from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PostBase(BaseModel):
    reddit_id: str
    subreddit: str
    title: str
    url: str
    author: str
    score: int
    upvote_ratio: float
    num_comments: int
    created_utc: datetime
    is_video: bool
    is_self: bool
    permalink: str

class PostCreate(PostBase):
    pass

class Post(PostBase):
    id: int
    collected_at: datetime
    virality_score: Optional[float] = None
    
    class Config:
        from_attributes = True

class PredictionResponse(BaseModel):
    success: bool
    count: int
    predictions: list

class TrendingResponse(BaseModel):
    success: bool
    count: int
    trending: list