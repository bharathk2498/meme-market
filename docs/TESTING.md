# Testing Guide

## Manual Testing Checklist

### Backend API Tests

#### 1. Health Check
```bash
curl http://localhost:8000/health
```

Expected:
```json
{
  "status": "healthy",
  "database": "connected"
}
```

#### 2. Top Predictions
```bash
curl http://localhost:8000/api/v1/predictions/top?limit=5
```

Expected:
```json
{
  "success": true,
  "count": 5,
  "predictions": [
    {
      "reddit_id": "...",
      "title": "...",
      "virality_score": 85.5,
      ...
    }
  ]
}
```

#### 3. Trending Posts
```bash
curl http://localhost:8000/api/v1/predictions/trending?hours=24
```

#### 4. Subreddit Specific
```bash
curl http://localhost:8000/api/v1/predictions/subreddit/technology?limit=10
```

#### 5. Reddit Collection
```bash
curl -X POST http://localhost:8000/api/v1/reddit/collect
```

Expected:
```json
{
  "success": true,
  "message": "Collection started in background"
}
```

#### 6. Collection Status
```bash
curl http://localhost:8000/api/v1/reddit/status
```

#### 7. Rate Limiting Test
```bash
# Run this 70 times quickly
for i in {1..70}; do
  curl http://localhost:8000/api/v1/predictions/top?limit=1
  echo ""
done
```

Should return 429 after 60 requests.

### Frontend Tests

#### 1. Page Load
- Visit http://localhost:3000
- Should load without errors
- Check browser console for errors

#### 2. Live Predictions Section
- Scroll to "Live Predictions"
- Should show loading spinner
- Then show 5 predictions
- Each should have:
  - Subreddit badge
  - Virality score
  - Title
  - Upvotes count
  - Time posted
  - Reddit link button

#### 3. Features Section
- Should show 6 feature cards
- Icons should render
- Text should be readable

#### 4. Pricing Section
- Should show 3 pricing tiers
- Middle tier (Pro) should be highlighted
- Buttons should be visible

#### 5. CTA Form
- Enter email
- Click "Get Started"
- Should show success message

#### 6. Mobile Responsive
- Open DevTools
- Toggle device toolbar
- Test on iPhone SE (375px)
- Test on iPad (768px)
- Everything should be readable

### Database Tests

#### 1. Check Posts Table
In Supabase dashboard:
```sql
SELECT COUNT(*) FROM posts;
```
Should return > 0

#### 2. Check Recent Posts
```sql
SELECT 
  subreddit,
  COUNT(*) as count
FROM posts
WHERE created_utc > NOW() - INTERVAL '24 hours'
GROUP BY subreddit
ORDER BY count DESC;
```

Should show multiple subreddits.

#### 3. Check Data Quality
```sql
SELECT 
  title,
  score,
  upvote_ratio,
  num_comments
FROM posts
ORDER BY collected_at DESC
LIMIT 10;
```

All fields should have values (not NULL).

### Integration Tests

#### End-to-End Flow

1. **Trigger Collection**
```bash
curl -X POST http://localhost:8000/api/v1/reddit/collect
```

2. **Wait 2 minutes**

3. **Check Status**
```bash
curl http://localhost:8000/api/v1/reddit/status
```
Should show updated last_collection time.

4. **Check Database**
Verify new posts in Supabase.

5. **Check Predictions**
```bash
curl http://localhost:8000/api/v1/predictions/top?limit=5
```
Should show predictions with scores.

6. **Check Frontend**
Refresh http://localhost:3000
Should show new predictions.

### Load Testing

#### Simple Load Test
```bash
# Install apache bench
sudo apt install apache2-utils  # Ubuntu
brew install httpd  # macOS

# Run 1000 requests with 10 concurrent
ab -n 1000 -c 10 http://localhost:8000/api/v1/predictions/top?limit=5
```

Target metrics:
- Requests per second: > 50
- Mean response time: < 500ms
- Failed requests: 0

### Security Tests

#### 1. Check No Secrets in Response
```bash
curl http://localhost:8000/api/v1/predictions/top?limit=1
```
Response should NOT contain:
- API keys
- Database passwords
- Internal URLs
- Stack traces

#### 2. Test CORS
```bash
curl -H "Origin: http://evil.com" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS \
     http://localhost:8000/api/v1/predictions/top
```

Should NOT return Access-Control-Allow-Origin: *

#### 3. Test SQL Injection
```bash
curl "http://localhost:8000/api/v1/predictions/subreddit/technology'%20OR%201=1--"
```

Should return error or empty, not database contents.

#### 4. Test Rate Limiting
Already covered above - should block after 60 requests/min.

### Automated Tests (Future)

#### Backend Tests with Pytest

Create `backend/tests/test_api.py`:

```python
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_get_predictions():
    response = client.get("/api/v1/predictions/top?limit=5")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] == True
    assert len(data["predictions"]) <= 5

def test_rate_limiting():
    # Make 61 requests
    responses = [client.get("/api/v1/predictions/top?limit=1") 
                 for _ in range(61)]
    # Last one should be rate limited
    assert responses[-1].status_code == 429
```

Run:
```bash
cd backend
pytest tests/
```

#### Frontend Tests with Playwright

Create `frontend/tests/home.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test('homepage loads', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await expect(page).toHaveTitle(/Meme Market/);
});

test('predictions section shows data', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.waitForSelector('[data-testid="prediction-card"]');
  const predictions = await page.locator('[data-testid="prediction-card"]').count();
  expect(predictions).toBeGreaterThan(0);
});
```

## Pre-Deployment Checklist

### Before Deploying to Production

- [ ] All environment variables set
- [ ] Health check returns 200
- [ ] Predictions API returns data
- [ ] Reddit collection working
- [ ] Frontend loads without errors
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Rate limiting works
- [ ] CORS configured correctly
- [ ] Database has > 100 posts
- [ ] All secrets in .env (not code)

### After Deploying to Production

- [ ] Production health check works
- [ ] Production predictions API works
- [ ] Frontend connects to backend
- [ ] Cron job configured
- [ ] Monitoring set up (UptimeRobot)
- [ ] SSL certificate valid
- [ ] Domain configured (if custom)
- [ ] Analytics tracking (Vercel)

## Troubleshooting

### Backend won't start
1. Check Python version (3.11+)
2. Check all dependencies installed
3. Check .env file exists and has all variables
4. Check Railway logs for errors

### Frontend can't connect to backend
1. Check NEXT_PUBLIC_API_URL is correct
2. Check backend is running
3. Check CORS settings
4. Check browser console for errors

### No predictions showing
1. Run data collection manually
2. Check database has posts
3. Check prediction API directly
4. Check frontend API call in Network tab

### Rate limiting not working
1. Check SlowAPI installed
2. Check limiter configured in main.py
3. Check decorator on endpoints
4. Test with multiple rapid requests

## Performance Benchmarks

### Target Metrics

**Backend:**
- Health check: < 50ms
- Predictions API: < 500ms
- Reddit collection: < 60s for 500 posts

**Frontend:**
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Time to Interactive: < 3.5s

**Database:**
- Select query: < 50ms
- Insert query: < 100ms
- Complex query: < 200ms

### How to Measure

**Backend:**
```bash
time curl http://localhost:8000/api/v1/predictions/top?limit=10
```

**Frontend:**
- Chrome DevTools > Lighthouse
- Run audit
- Check Performance score (target: > 90)

**Database:**
- Supabase dashboard > Database > Performance
- Check slow queries

## Testing Checklist Summary

**Quick Test (5 minutes):**
- [ ] Health check works
- [ ] Predictions API returns data
- [ ] Frontend loads
- [ ] Live predictions show

**Full Test (30 minutes):**
- [ ] All API endpoints
- [ ] Frontend all sections
- [ ] Database checks
- [ ] Integration flow
- [ ] Security basics

**Pre-Launch Test (2 hours):**
- [ ] Everything above
- [ ] Load testing
- [ ] Mobile testing
- [ ] Production URLs
- [ ] Monitoring setup
- [ ] Documentation review
