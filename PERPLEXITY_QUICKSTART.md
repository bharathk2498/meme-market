# 🚀 PERPLEXITY AI INTEGRATION - QUICK START

## ✅ What Was Just Added

**New UI Page**: Beautiful AI-powered meme predictor  
**Backend Service**: Perplexity API integration  
**Demo Page**: Standalone HTML for instant preview

---

## 🎯 See It Now (3 Options)

### Option 1: Instant Demo (No Setup)

**Open in browser right now:**

```bash
# Download the demo file
curl -O https://raw.githubusercontent.com/bharathk2498/meme-market/main/demo-perplexity-predictor.html

# Open in browser
open demo-perplexity-predictor.html  # Mac
start demo-perplexity-predictor.html  # Windows
xdg-open demo-perplexity-predictor.html  # Linux
```

Or visit: https://bharathk2498.github.io/meme-market/demo-perplexity-predictor.html

**Works without backend** - Uses demo mode to show UI

### Option 2: With Your Existing Frontend

If you already have the frontend running:

```bash
cd frontend
npm run dev
```

Visit: http://localhost:3000/predict

### Option 3: Full Integration (With Perplexity API)

Get real AI predictions:

**Step 1: Get Perplexity API Key (2 minutes)**
1. Go to https://www.perplexity.ai/
2. Sign up / Sign in
3. Settings > API
4. Generate New API Key
5. Copy it (starts with `pplx-`)

**Step 2: Add to Backend (1 minute)**
```bash
cd backend

# Edit .env
nano .env

# Add this line:
PERPLEXITY_API_KEY=pplx-your-key-here

# Save and exit
```

**Step 3: Start Backend (1 minute)**
```bash
source venv/bin/activate
uvicorn app.main:app --reload
```

**Step 4: Test It (1 minute)**
```bash
# Test the API
curl -X POST http://localhost:8000/api/v1/perplexity/analyze-meme \
  -H "Content-Type: application/json" \
  -d '{
    "title": "AI discovers cure for aging",
    "subreddit": "technology"
  }'
```

**Step 5: Open UI**
- Frontend: http://localhost:3000/predict
- Demo: Open `demo-perplexity-predictor.html` in browser

---

## 📁 What Files Were Added

### Backend Files
```
backend/
├── app/
│   ├── services/
│   │   └── perplexity_service.py     ← Perplexity AI integration
│   └── api/v1/endpoints/
│       └── perplexity.py              ← API endpoints
└── .env.example                        ← Updated with PERPLEXITY_API_KEY
```

### Frontend Files
```
frontend/
└── app/
    └── predict/
        └── page.tsx                    ← New AI predictor page
```

### Demo Files
```
demo-perplexity-predictor.html          ← Standalone demo
docs/PERPLEXITY_SETUP.md                ← Complete guide
```

---

## 🎨 The UI Page

**What it does:**
- Enter any meme idea or trending topic
- Select target subreddit
- Get instant AI analysis with:
  - Virality score (0-100%)
  - Confidence level
  - Will it go viral prediction
  - Trending factor (HIGH/MEDIUM/LOW)
  - Predicted peak score
  - Key trends detected
  - AI reasoning

**How it looks:**
- Gradient animated background
- Clean white card interface
- Real-time loading state
- Beautiful results display
- Mobile responsive
- Share results button

---

## 🔌 API Endpoints Added

### 1. Analyze Meme
```
POST /api/v1/perplexity/analyze-meme

Body:
{
  "title": "Your meme title",
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

### 2. Get Trending Topics
```
GET /api/v1/perplexity/trending-now

Response:
{
  "success": true,
  "trending": {
    "trending_topics": [...]
  }
}
```

---

## 💰 Cost

**Free Tier:**
- 5 API calls per day
- Perfect for testing
- $0/month

**Paid Tier:**
- $20/month for 5,000 queries
- ~$0.004 per prediction
- Recommended for production

**Estimated Usage:**
- 10 predictions/day = $1.20/month
- 100 predictions/day = $12/month
- 500 predictions/day = $60/month

---

## 🚀 Quick Commands

**See Demo Immediately:**
```bash
# Just open this file in any browser
open demo-perplexity-predictor.html
```

**Run Locally (Full Stack):**
```bash
# Terminal 1 - Backend
cd backend
source venv/bin/activate
uvicorn app.main:app --reload

# Terminal 2 - Frontend
cd frontend
npm run dev

# Visit: http://localhost:3000/predict
```

**Test API Only:**
```bash
# Start backend
cd backend && source venv/bin/activate && uvicorn app.main:app --reload

# In another terminal, test
curl -X POST http://localhost:8000/api/v1/perplexity/analyze-meme \
  -H "Content-Type: application/json" \
  -d '{"title": "Test meme", "subreddit": "memes"}'
```

---

## 🎯 Integration Options

### Option A: Standalone Feature (Recommended)

Keep as separate premium feature:

```
Free Tier:
- Basic ML predictions
- Top 3 daily

Pro Tier ($19/month):
- Basic ML predictions
- AI-powered analysis
- Real-time trends
```

### Option B: Enhance Existing Predictions

Add Perplexity to boost current predictions:

```python
# In prediction_service.py

from app.services.perplexity_service import PerplexityService

async def get_enhanced_predictions(limit=10):
    # Get ML predictions
    predictions = await get_top_predictions(limit=20)
    
    # Enhance top 5 with Perplexity
    perplexity = PerplexityService()
    for post in predictions[:5]:
        result = await perplexity.analyze_meme_virality(post)
        if result["success"]:
            post["ai_enhanced"] = True
            post["perplexity_score"] = result["prediction"]["virality_score"]
    
    return predictions[:limit]
```

---

## 📖 Documentation

**Complete Guide:**
`docs/PERPLEXITY_SETUP.md`

**Covers:**
- Setup instructions
- Cost optimization
- Caching strategies
- Rate limiting
- Production deployment
- Troubleshooting
- Best practices

---

## ✨ Benefits

**For Users:**
- Real-time trend detection
- Cross-platform analysis (Twitter, TikTok, news)
- Higher accuracy predictions
- See "why" behind scores

**For You:**
- Differentiation vs competitors
- Justifies higher pricing ($19→$29)
- Unique selling proposition
- Better retention (more value)

**ROI:**
- Cost: $12-60/month
- Pricing increase: +$10/month per user
- Break-even: 2-6 paying customers

---

## 🔥 Next Steps

**1. Try the Demo (1 minute)**
```bash
open demo-perplexity-predictor.html
```

**2. Get API Key (2 minutes)**
- Visit https://www.perplexity.ai/
- Generate API key

**3. Test Locally (5 minutes)**
- Add API key to backend/.env
- Start backend
- Start frontend
- Visit http://localhost:3000/predict

**4. Deploy (10 minutes)**
- Add PERPLEXITY_API_KEY to Railway
- Redeploy
- Test production

**5. Market It (ongoing)**
- "Powered by Perplexity AI"
- "Real-time trend detection"
- "Cross-platform analysis"

---

## 🎬 Live Demo

**Standalone:** 
https://bharathk2498.github.io/meme-market/demo-perplexity-predictor.html

**Full App:** 
http://localhost:3000/predict (after starting frontend)

**API Endpoint:** 
http://localhost:8000/api/v1/perplexity/analyze-meme

---

## 💡 Tips

**Start Free:**
- Use free tier (5 calls/day)
- Test with beta users
- Validate value

**Scale Smart:**
- Cache results (1 hour)
- Only enhance top predictions
- Batch process overnight

**Market Well:**
- Emphasize "AI-powered"
- Show real-time aspect
- Demo the UI heavily

---

## 🆘 Troubleshooting

**UI shows but no results?**
- Backend not running
- Open demo-perplexity-predictor.html for UI-only demo

**API error?**
- Check PERPLEXITY_API_KEY in .env
- Verify backend is running
- Check backend logs

**Slow responses?**
- Normal, Perplexity takes 5-15 seconds
- Implement caching (see docs)

---

## ✅ Summary

**What you got:**
- ✅ Beautiful UI page (`/predict`)
- ✅ Perplexity AI integration
- ✅ Standalone demo (works without backend)
- ✅ Complete documentation
- ✅ API endpoints ready
- ✅ Production-ready code

**Time to test:**
- See UI: 30 seconds (open demo file)
- Full test: 5 minutes (with API key)
- Deploy: 10 minutes (add to production)

**Cost:**
- Free tier: $0 (testing)
- Paid: $12-60/month (production)

**ROI:**
- Pricing increase: +$10-20/month per user
- Break-even: 2-6 customers

---

**Ready to see it? Open `demo-perplexity-predictor.html` in your browser right now!**

Repository: https://github.com/bharathk2498/meme-market
