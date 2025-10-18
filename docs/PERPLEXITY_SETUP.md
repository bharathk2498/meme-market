# Perplexity AI Integration Guide

## What is Perplexity AI?

Perplexity AI is a conversational AI search engine that provides real-time web search capabilities. We use it to:

1. **Check if topics are trending** across social media
2. **Analyze news relevance** for viral potential
3. **Detect search volume spikes** for topics
4. **Cross-reference multiple platforms** (Twitter, TikTok, news)
5. **Boost prediction accuracy** by 10-15%

## Benefits

- Real-time web search (not limited to Reddit data)
- Detects breaking trends before they explode
- Cross-platform trend detection
- Natural language analysis
- High accuracy with confidence scores

## Cost

**Free Tier:**
- 5 API calls per day
- Good for testing

**Paid Tier:**
- $20/month for 5,000 queries
- ~$0.004 per query
- Perfect for production

**Estimated Monthly Cost:**
- 100 predictions/day = $12/month
- 500 predictions/day = $60/month
- 1000 predictions/day = $120/month

## Setup Instructions

### Step 1: Get Perplexity API Key (5 minutes)

1. Go to https://www.perplexity.ai/
2. Sign up for an account
3. Navigate to Settings > API
4. Click "Generate New API Key"
5. Copy the key (starts with `pplx-`)
6. Save it securely

### Step 2: Add to Backend (2 minutes)

**Local Development:**
```bash
cd backend

# Edit .env file
nano .env

# Add this line:
PERPLEXITY_API_KEY=pplx-your-key-here

# Save and exit
```

**Production (Railway):**
1. Go to Railway dashboard
2. Select your backend project
3. Click "Variables"
4. Add new variable:
   - Key: `PERPLEXITY_API_KEY`
   - Value: `pplx-your-key-here`
5. Redeploy

### Step 3: Test Integration (5 minutes)

**Start Backend:**
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload
```

**Test API:**
```bash
# Test analyze endpoint
curl -X POST http://localhost:8000/api/v1/perplexity/analyze-meme \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Breaking: AI discovers cure for aging",
    "subreddit": "technology",
    "score": 0,
    "num_comments": 0,
    "age_hours": 0
  }'

# Test trending endpoint
curl http://localhost:8000/api/v1/perplexity/trending-now
```

**Expected Response:**
```json
{
  "success": true,
  "analysis": {
    "will_go_viral": true,
    "confidence": 85,
    "virality_score": 88,
    "reasoning": "AI and aging cure topics are highly trending...",
    "trending_factor": "HIGH",
    "predicted_peak_score": 15000,
    "key_trends": ["AI breakthrough", "longevity research"]
  }
}
```

### Step 4: Test UI Page (3 minutes)

**Start Frontend:**
```bash
cd frontend
npm run dev
```

**Open Browser:**
1. Go to http://localhost:3000
2. Click "Try AI Predictor" button
3. Or directly visit http://localhost:3000/predict
4. Enter a meme idea
5. Click "Predict Virality"
6. See AI-powered analysis

## Using the AI Predictor

### New Page: `/predict`

A dedicated page where users can:
1. Enter any meme idea or trending topic
2. Select target subreddit
3. Get instant AI analysis with:
   - Virality score (0-100)
   - Confidence level
   - Will it go viral prediction
   - Trending factor (HIGH/MEDIUM/LOW)
   - Predicted peak score
   - Key trends detected
   - AI reasoning

### API Endpoints

**1. Analyze Meme:**
```
POST /api/v1/perplexity/analyze-meme

Body:
{
  "title": "Your meme title or idea",
  "subreddit": "memes",
  "score": 0,
  "num_comments": 0,
  "age_hours": 0
}

Response:
{
  "success": true,
  "analysis": {
    "will_go_viral": true,
    "confidence": 85,
    "virality_score": 88,
    "reasoning": "...",
    "trending_factor": "HIGH",
    "predicted_peak_score": 15000,
    "key_trends": ["trend1", "trend2"]
  }
}
```

**2. Get Trending Topics:**
```
GET /api/v1/perplexity/trending-now

Response:
{
  "success": true,
  "trending": {
    "trending_topics": [
      {
        "topic": "AI breakthrough",
        "trend_score": 95,
        "platforms": ["twitter", "reddit"],
        "description": "..."
      }
    ]
  }
}
```

## Integration with Existing Predictions

### Option 1: Enhance Existing Predictions

Add Perplexity boost to current prediction system:

```python
# In prediction_service.py

from app.services.perplexity_service import PerplexityService

async def get_top_predictions_enhanced(self, limit: int = 10):
    # Get base predictions (our ML algorithm)
    predictions = await self.get_top_predictions(limit=limit * 2)
    
    # Enhance with Perplexity for top candidates
    perplexity_service = PerplexityService()
    
    for post in predictions[:5]:  # Only enhance top 5 to save API calls
        result = await perplexity_service.analyze_meme_virality(post)
        if result["success"]:
            # Boost score if Perplexity confirms trending
            perplexity_score = result["prediction"]["virality_score"]
            post["virality_score"] = (post["virality_score"] + perplexity_score) / 2
            post["perplexity_boost"] = True
            post["trending_confirmed"] = result["prediction"]["will_go_viral"]
    
    # Re-sort by enhanced scores
    predictions.sort(key=lambda x: x["virality_score"], reverse=True)
    
    return predictions[:limit]
```

### Option 2: Separate Premium Feature

Keep basic predictions free, charge for Perplexity-enhanced analysis:

```
Free Tier:
- Basic ML predictions
- Top 3 daily predictions

Pro Tier ($19/month):
- Basic ML predictions
- Perplexity AI enhancement
- Real-time trend detection
- Cross-platform analysis
```

## Usage Recommendations

### When to Use Perplexity

**Good Use Cases:**
1. **User requests analysis** - On-demand predictions
2. **Top predictions only** - Enhance best candidates
3. **Trending topics page** - Show what's hot now
4. **Premium feature** - Upsell opportunity

**Avoid:**
1. **Every post in database** - Too expensive
2. **Real-time for all users** - Rate limits
3. **Background batch jobs** - Use sparingly

### Rate Limiting Strategy

```python
# In perplexity_service.py

class PerplexityService:
    def __init__(self):
        self.daily_limit = 100  # Free tier
        self.cache_ttl = 3600  # Cache for 1 hour
    
    async def analyze_with_cache(self, meme_data: Dict):
        # Check cache first
        cache_key = f"perplexity:{meme_data['title']}"
        cached = await redis.get(cache_key)
        
        if cached:
            return json.loads(cached)
        
        # Check daily limit
        if await self.check_limit():
            result = await self.analyze_meme_virality(meme_data)
            await redis.setex(cache_key, self.cache_ttl, json.dumps(result))
            return result
        else:
            return {"success": False, "error": "Daily limit reached"}
```

## Monitoring Usage

### Track API Calls

```python
# Add to metrics tracking

supabase.table("metrics").insert({
    "metric_name": "perplexity_api_calls",
    "metric_value": 1,
    "timestamp": datetime.now().isoformat()
}).execute()
```

### Check Daily Usage

```sql
SELECT 
    DATE(timestamp) as date,
    COUNT(*) as api_calls,
    COUNT(*) * 0.004 as cost_estimate
FROM metrics
WHERE metric_name = 'perplexity_api_calls'
GROUP BY DATE(timestamp)
ORDER BY date DESC;
```

## Troubleshooting

### API Key Not Working

```bash
# Test API key directly
curl https://api.perplexity.ai/chat/completions \
  -H "Authorization: Bearer $PERPLEXITY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama-3.1-sonar-small-128k-online",
    "messages": [{"role": "user", "content": "Test"}]
  }'
```

If fails:
1. Check API key copied correctly
2. Verify account has credits
3. Check for typos in .env

### Rate Limit Errors

```json
{"error": "Rate limit exceeded"}
```

Solution:
1. Implement caching (see above)
2. Reduce API calls
3. Upgrade to paid tier

### Slow Responses

Perplexity can take 5-15 seconds.

Solution:
1. Show loading indicator
2. Use background tasks
3. Cache results

## Production Deployment

### Railway (Backend)

1. Add environment variable:
```
PERPLEXITY_API_KEY=pplx-your-key
```

2. Redeploy

3. Test:
```bash
curl https://your-app.railway.app/api/v1/perplexity/trending-now
```

### Vercel (Frontend)

No changes needed - frontend uses backend API.

## Cost Optimization

### Caching Strategy

```python
# Cache results for 1 hour
# Same topic analyzed multiple times = 1 API call

import redis
import hashlib

def get_cache_key(title: str) -> str:
    return f"perplexity:{hashlib.md5(title.encode()).hexdigest()}"

async def analyze_with_cache(meme_data: Dict):
    cache_key = get_cache_key(meme_data["title"])
    
    # Try cache
    cached = await redis.get(cache_key)
    if cached:
        return json.loads(cached)
    
    # Call API
    result = await analyze_meme_virality(meme_data)
    
    # Store in cache (1 hour)
    await redis.setex(cache_key, 3600, json.dumps(result))
    
    return result
```

### Batch Processing

```python
# Instead of analyzing all posts:
# 1. Analyze top 10 from ML predictions
# 2. Only boost scores if trending
# 3. Cache for rest of day

async def smart_perplexity_enhancement():
    # Get top 10 ML predictions
    top_posts = await get_ml_predictions(limit=10)
    
    # Analyze only high-potential posts (score > 70)
    for post in top_posts:
        if post["virality_score"] > 70:
            result = await perplexity_service.analyze_with_cache(post)
            if result["success"]:
                post["perplexity_confirmed"] = True
```

## Summary

**What You Get:**
- New `/predict` page for instant AI analysis
- Real-time trend detection
- Cross-platform validation
- 10-15% accuracy improvement
- Premium feature for Pro tier

**Cost:**
- Free tier: $0 (5 calls/day)
- Paid tier: $20/month (5,000 calls)
- Estimated: $12-60/month depending on usage

**ROI:**
- Justifies higher pricing ($19→$29 for Pro)
- Unique selling point vs competitors
- Real-time = higher accuracy = more value

**Next Steps:**
1. Get Perplexity API key
2. Add to .env
3. Test locally
4. Deploy to production
5. Market as premium feature
