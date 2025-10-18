import praw
from datetime import datetime, timedelta
from typing import List, Dict
from app.core.config import settings
from app.core.database import supabase_admin
import asyncio
import time

class RedditService:
    def __init__(self):
        self.reddit = praw.Reddit(
            client_id=settings.REDDIT_CLIENT_ID,
            client_secret=settings.REDDIT_CLIENT_SECRET,
            user_agent=settings.REDDIT_USER_AGENT
        )
        self.rate_limit_delay = 1.1
        
    async def collect_posts(self, subreddits: List[str] = None):
        if subreddits is None:
            subreddits = [
                "technology",
                "memes",
                "funny",
                "videos",
                "gaming",
                "worldnews",
                "news",
                "AskReddit",
                "todayilearned",
                "science"
            ]
        
        all_posts = []
        
        for subreddit_name in subreddits:
            try:
                subreddit = self.reddit.subreddit(subreddit_name)
                posts = subreddit.hot(limit=50)
                
                for post in posts:
                    post_data = {
                        "reddit_id": post.id,
                        "subreddit": subreddit_name,
                        "title": post.title,
                        "url": post.url,
                        "author": str(post.author),
                        "score": post.score,
                        "upvote_ratio": post.upvote_ratio,
                        "num_comments": post.num_comments,
                        "created_utc": datetime.fromtimestamp(post.created_utc).isoformat(),
                        "is_video": post.is_video,
                        "is_self": post.is_self,
                        "permalink": post.permalink,
                        "collected_at": datetime.utcnow().isoformat()
                    }
                    all_posts.append(post_data)
                
                await asyncio.sleep(self.rate_limit_delay)
                
            except Exception as e:
                print(f"Error collecting from r/{subreddit_name}: {str(e)}")
                continue
        
        if all_posts:
            try:
                result = supabase_admin.table("posts").upsert(
                    all_posts,
                    on_conflict="reddit_id"
                ).execute()
                print(f"Successfully saved {len(all_posts)} posts")
            except Exception as e:
                print(f"Database error: {str(e)}")
        
        return len(all_posts)
    
    async def get_status(self) -> Dict:
        try:
            result = supabase_admin.table("posts").select("*", count="exact").limit(1).execute()
            total_posts = result.count if hasattr(result, 'count') else 0
            
            recent_result = supabase_admin.table("posts").select("collected_at").order("collected_at", desc=True).limit(1).execute()
            last_collection = recent_result.data[0]["collected_at"] if recent_result.data else None
            
            return {
                "total_posts": total_posts,
                "last_collection": last_collection,
                "status": "active"
            }
        except Exception as e:
            return {
                "error": str(e),
                "status": "error"
            }