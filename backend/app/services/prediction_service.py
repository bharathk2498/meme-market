from datetime import datetime, timedelta
from typing import List, Dict
from app.core.database import supabase_admin
import numpy as np

class PredictionService:
    def __init__(self):
        self.prediction_weights = {
            "score_velocity": 0.35,
            "comment_velocity": 0.25,
            "upvote_ratio": 0.20,
            "recency": 0.10,
            "engagement_rate": 0.10
        }
    
    def calculate_virality_score(self, post: Dict) -> float:
        try:
            current_time = datetime.utcnow()
            created_time = datetime.fromisoformat(post.get("created_utc", current_time.isoformat()).replace('Z', '+00:00'))
            age_hours = (current_time - created_time).total_seconds() / 3600
            
            if age_hours < 0.1:
                age_hours = 0.1
            
            score = post.get("score", 0)
            comments = post.get("num_comments", 0)
            upvote_ratio = post.get("upvote_ratio", 0.5)
            
            score_velocity = score / age_hours if age_hours > 0 else 0
            comment_velocity = comments / age_hours if age_hours > 0 else 0
            
            engagement_rate = comments / max(score, 1)
            
            recency_score = max(0, 1 - (age_hours / 24))
            
            virality_score = (
                (score_velocity * self.prediction_weights["score_velocity"]) +
                (comment_velocity * self.prediction_weights["comment_velocity"]) +
                (upvote_ratio * self.prediction_weights["upvote_ratio"]) +
                (recency_score * self.prediction_weights["recency"]) +
                (engagement_rate * self.prediction_weights["engagement_rate"])
            )
            
            normalized_score = min(100, max(0, virality_score * 10))
            
            return round(normalized_score, 2)
        
        except Exception as e:
            print(f"Error calculating virality score: {str(e)}")
            return 0.0
    
    async def get_top_predictions(self, limit: int = 10) -> List[Dict]:
        try:
            cutoff_time = (datetime.utcnow() - timedelta(hours=6)).isoformat()
            
            result = supabase_admin.table("posts").select("*").gte("created_utc", cutoff_time).order("score", desc=True).limit(limit * 3).execute()
            
            posts = result.data
            
            scored_posts = []
            for post in posts:
                virality_score = self.calculate_virality_score(post)
                post["virality_score"] = virality_score
                scored_posts.append(post)
            
            scored_posts.sort(key=lambda x: x["virality_score"], reverse=True)
            
            return scored_posts[:limit]
        
        except Exception as e:
            print(f"Error getting top predictions: {str(e)}")
            return []
    
    async def get_trending(self, hours: int = 24) -> List[Dict]:
        try:
            cutoff_time = (datetime.utcnow() - timedelta(hours=hours)).isoformat()
            
            result = supabase_admin.table("posts").select("*").gte("created_utc", cutoff_time).order("score", desc=True).limit(50).execute()
            
            posts = result.data
            
            trending_posts = []
            for post in posts:
                virality_score = self.calculate_virality_score(post)
                if virality_score > 50:
                    post["virality_score"] = virality_score
                    trending_posts.append(post)
            
            trending_posts.sort(key=lambda x: x["virality_score"], reverse=True)
            
            return trending_posts[:20]
        
        except Exception as e:
            print(f"Error getting trending: {str(e)}")
            return []
    
    async def get_subreddit_predictions(self, subreddit: str, limit: int = 10) -> List[Dict]:
        try:
            cutoff_time = (datetime.utcnow() - timedelta(hours=12)).isoformat()
            
            result = supabase_admin.table("posts").select("*").eq("subreddit", subreddit).gte("created_utc", cutoff_time).order("score", desc=True).limit(limit * 2).execute()
            
            posts = result.data
            
            scored_posts = []
            for post in posts:
                virality_score = self.calculate_virality_score(post)
                post["virality_score"] = virality_score
                scored_posts.append(post)
            
            scored_posts.sort(key=lambda x: x["virality_score"], reverse=True)
            
            return scored_posts[:limit]
        
        except Exception as e:
            print(f"Error getting subreddit predictions: {str(e)}")
            return []