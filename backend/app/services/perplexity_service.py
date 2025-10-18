import os
import httpx
from typing import Dict, Optional
from datetime import datetime

class PerplexityService:
    def __init__(self):
        self.api_key = os.getenv("PERPLEXITY_API_KEY")
        self.base_url = "https://api.perplexity.ai/chat/completions"
        self.model = "llama-3.1-sonar-small-128k-online"
    
    async def analyze_meme_virality(self, meme_data: Dict) -> Dict:
        """
        Analyze if a meme/post will go viral using Perplexity's real-time web search.
        
        Args:
            meme_data: Dict containing title, subreddit, current_score, etc.
        
        Returns:
            Dict with virality prediction, confidence, and reasoning
        """
        
        if not self.api_key:
            return {
                "success": False,
                "error": "PERPLEXITY_API_KEY not configured",
                "prediction": None
            }
        
        prompt = self._build_analysis_prompt(meme_data)
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    self.base_url,
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": self.model,
                        "messages": [
                            {
                                "role": "system",
                                "content": "You are a viral content prediction AI. Analyze trends, news, and social media to predict if content will go viral. Always respond in JSON format."
                            },
                            {
                                "role": "user",
                                "content": prompt
                            }
                        ],
                        "temperature": 0.2,
                        "max_tokens": 500
                    }
                )
                
                if response.status_code == 200:
                    result = response.json()
                    analysis = self._parse_perplexity_response(result)
                    return {
                        "success": True,
                        "prediction": analysis,
                        "raw_response": result
                    }
                else:
                    return {
                        "success": False,
                        "error": f"API error: {response.status_code}",
                        "prediction": None
                    }
                    
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "prediction": None
            }
    
    def _build_analysis_prompt(self, meme_data: Dict) -> str:
        """
        Build a detailed prompt for Perplexity analysis.
        """
        title = meme_data.get('title', '')
        subreddit = meme_data.get('subreddit', '')
        current_score = meme_data.get('score', 0)
        num_comments = meme_data.get('num_comments', 0)
        age_hours = meme_data.get('age_hours', 0)
        
        prompt = f"""
Analyze if this Reddit post will go viral in the next 24 hours:

Title: {title}
Subreddit: r/{subreddit}
Current Score: {current_score} upvotes
Comments: {num_comments}
Age: {age_hours} hours old

Search the web for:
1. Is this topic currently trending on social media?
2. Are there recent news articles about this topic?
3. Is there high search volume for related keywords?
4. Are influencers or major accounts discussing this?
5. Is this a recurring viral topic or brand new?

Respond in JSON format with:
{{
  "will_go_viral": true/false,
  "confidence": 0-100,
  "virality_score": 0-100,
  "reasoning": "brief explanation",
  "trending_factor": "HIGH/MEDIUM/LOW",
  "predicted_peak_score": estimated_score,
  "key_trends": ["trend1", "trend2"]
}}
"""
        return prompt
    
    def _parse_perplexity_response(self, response: Dict) -> Dict:
        """
        Parse Perplexity API response into structured prediction.
        """
        try:
            content = response.get('choices', [{}])[0].get('message', {}).get('content', '')
            
            # Try to extract JSON from response
            import json
            import re
            
            # Find JSON object in response
            json_match = re.search(r'\{.*\}', content, re.DOTALL)
            if json_match:
                prediction = json.loads(json_match.group())
            else:
                # Fallback: parse text response
                prediction = {
                    "will_go_viral": "yes" in content.lower() or "true" in content.lower(),
                    "confidence": 70,
                    "virality_score": 70,
                    "reasoning": content[:200],
                    "trending_factor": "MEDIUM",
                    "predicted_peak_score": 5000,
                    "key_trends": []
                }
            
            return prediction
            
        except Exception as e:
            # Fallback prediction
            return {
                "will_go_viral": False,
                "confidence": 50,
                "virality_score": 50,
                "reasoning": "Unable to parse AI response",
                "trending_factor": "UNKNOWN",
                "predicted_peak_score": 1000,
                "key_trends": [],
                "error": str(e)
            }
    
    async def get_trending_topics(self) -> Dict:
        """
        Get current trending topics across the web.
        """
        
        if not self.api_key:
            return {"success": False, "error": "API key not configured"}
        
        prompt = """
What are the top 10 trending topics on social media RIGHT NOW?

Search Twitter, Reddit, TikTok, and news sites for what's viral today.

Respond in JSON format:
{
  "trending_topics": [
    {
      "topic": "topic name",
      "trend_score": 0-100,
      "platforms": ["twitter", "reddit"],
      "description": "brief description"
    }
  ],
  "timestamp": "ISO datetime"
}
"""
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    self.base_url,
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": self.model,
                        "messages": [{"role": "user", "content": prompt}],
                        "temperature": 0.3
                    }
                )
                
                if response.status_code == 200:
                    result = response.json()
                    content = result.get('choices', [{}])[0].get('message', {}).get('content', '')
                    
                    import json
                    import re
                    json_match = re.search(r'\{.*\}', content, re.DOTALL)
                    
                    if json_match:
                        trending = json.loads(json_match.group())
                    else:
                        trending = {"trending_topics": [], "timestamp": datetime.now().isoformat()}
                    
                    return {"success": True, "data": trending}
                else:
                    return {"success": False, "error": f"API error: {response.status_code}"}
                    
        except Exception as e:
            return {"success": False, "error": str(e)}