# Monitoring and Observability

## Key Metrics to Track

### Application Metrics
1. **API Response Time**
   - Target: < 500ms p95
   - Alert if: > 1000ms p95

2. **Error Rate**
   - Target: < 1%
   - Alert if: > 5%

3. **Request Rate**
   - Normal: 10-100 req/min
   - Alert if: > 1000 req/min (potential DDoS)

4. **Database Queries**
   - Target: < 100ms p95
   - Alert if: > 500ms p95

### Business Metrics
1. **Data Collection**
   - Posts collected per hour
   - Target: 250-500 posts/2hr
   - Alert if: < 100 posts/2hr

2. **Prediction Accuracy**
   - Track: Posts that went viral (>10k upvotes)
   - Target: 70%+ accuracy
   - Review weekly

3. **User Engagement**
   - Daily active users
   - Predictions viewed
   - Conversion rate (free to paid)

4. **Revenue**
   - MRR (Monthly Recurring Revenue)
   - Churn rate
   - LTV (Lifetime Value)

## Monitoring Stack

### Free Tier Setup

**Railway Logs**
- Built-in logging
- View in Railway dashboard
- Search and filter
- Download logs

**Vercel Analytics**
- Page views
- Unique visitors
- Performance metrics
- Free up to 100k requests/month

**Supabase Monitoring**
- Database size
- Active connections
- Query performance
- API usage

**Uptime Monitoring (UptimeRobot)**
- Free tier: 50 monitors
- 5-minute intervals
- Email alerts
- Set up for:
  - Backend health endpoint
  - Frontend homepage
  - API predictions endpoint

### Paid Tier (After Revenue)

**Sentry (Error Tracking)**
- $26/month for 50k events
- Real-time error alerts
- Stack traces
- User context

**Datadog/New Relic**
- $15-50/month
- Full observability
- Custom dashboards
- APM (Application Performance Monitoring)

**PagerDuty**
- $19/month per user
- On-call scheduling
- Incident management
- Multiple alert channels

## Setting Up Monitoring

### 1. Railway Logs

```python
# Add to backend/app/core/logging.py
import logging
from pythonjsonlogger import jsonlogger

logger = logging.getLogger()
loghandler = logging.StreamHandler()
formatter = jsonlogger.JsonFormatter()
loghandler.setFormatter(formatter)
logger.addHandler(loghandler)
logger.setLevel(logging.INFO)
```

Use in code:
```python
from app.core.logging import logger

logger.info("Data collection started", extra={"subreddit": "technology"})
logger.error("API error", extra={"error": str(e), "endpoint": "/predictions"})
```

### 2. Health Checks

**Backend Health Endpoint** (already implemented):
```
GET /health
```

**Database Health Check**:
```python
try:
    result = supabase.table("posts").select("id").limit(1).execute()
    return {"status": "healthy", "database": "connected"}
except Exception as e:
    return {"status": "unhealthy", "database": str(e)}
```

### 3. UptimeRobot Setup

1. Sign up at https://uptimerobot.com
2. Add monitors:
   - Monitor 1: Backend health
     - Type: HTTP(s)
     - URL: https://your-backend.railway.app/health
     - Interval: 5 minutes
   - Monitor 2: Frontend
     - Type: HTTP(s)
     - URL: https://your-frontend.vercel.app
     - Interval: 5 minutes
   - Monitor 3: Predictions API
     - Type: HTTP(s)
     - URL: https://your-backend.railway.app/api/v1/predictions/top?limit=1
     - Interval: 5 minutes
3. Set alert contacts (email, SMS)

### 4. Custom Metrics

**Track in Supabase**:
```sql
-- Create metrics table
CREATE TABLE metrics (
    id BIGSERIAL PRIMARY KEY,
    metric_name TEXT NOT NULL,
    metric_value NUMERIC NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast queries
CREATE INDEX idx_metrics_timestamp ON metrics(timestamp DESC);
CREATE INDEX idx_metrics_name ON metrics(metric_name);
```

**Log Metrics from Backend**:
```python
# After collecting posts
supabase.table("metrics").insert({
    "metric_name": "posts_collected",
    "metric_value": len(posts)
}).execute()

# After making predictions
supabase.table("metrics").insert({
    "metric_name": "predictions_generated",
    "metric_value": len(predictions)
}).execute()
```

## Dashboards

### Simple Dashboard (Supabase)

Create views for quick metrics:

```sql
-- Daily collection stats
CREATE VIEW daily_collection_stats AS
SELECT 
    DATE(collected_at) as date,
    COUNT(*) as posts_collected,
    COUNT(DISTINCT subreddit) as subreddits_tracked
FROM posts
GROUP BY DATE(collected_at)
ORDER BY date DESC;

-- Top predictions by virality
CREATE VIEW top_viral_predictions AS
SELECT 
    title,
    subreddit,
    score,
    virality_score,
    created_utc
FROM posts
WHERE virality_score > 70
ORDER BY virality_score DESC
LIMIT 20;
```

### Production Dashboard

Once you have revenue, use Grafana or Datadog:

**Key Panels:**
1. Requests per minute (line chart)
2. Error rate (gauge)
3. P95 latency (line chart)
4. Active users (number)
5. Posts collected (counter)
6. Revenue (MRR line chart)

## Alerts Configuration

### Critical Alerts (Immediate)
- Backend down (health check fails)
- Database connection lost
- Error rate > 10%
- Data collection failing for 6+ hours

### Warning Alerts (Review Soon)
- Response time > 1s p95
- Error rate > 5%
- Low data collection (< 100 posts/2hr)
- Disk space > 80%

### Info Alerts (Monitor)
- New user signup
- First payment received
- Prediction accuracy milestone

## Log Analysis

### Useful Log Queries

**Railway Logs:**
```
# Find errors
ERROR

# Find slow requests
response_time > 1000

# Find Reddit API issues
reddit AND (rate_limit OR 403)

# Find database issues
database AND (timeout OR connection)
```

**What to Look For:**
1. Error patterns (same error repeatedly)
2. Slow endpoints
3. Failed authentications
4. Rate limit hits
5. Database deadlocks

## Performance Optimization

### When to Optimize

**Backend:**
- Response time > 500ms p95
- Error rate > 2%
- High CPU usage (> 80%)

**Database:**
- Query time > 100ms p95
- Connection pool exhausted
- Disk usage > 80%

**Frontend:**
- Page load > 3 seconds
- LCP (Largest Contentful Paint) > 2.5s
- CLS (Cumulative Layout Shift) > 0.1

### Quick Wins

1. **Add Redis Caching**
   - Cache top predictions (5 min TTL)
   - Cache subreddit lists
   - Reduces database load

2. **Database Indexes**
   - Index on created_utc
   - Index on virality_score
   - Composite index on (subreddit, created_utc)

3. **API Response Compression**
   - Enable gzip in FastAPI
   - Reduces bandwidth

4. **CDN for Frontend**
   - Vercel includes CDN
   - Serves static assets from edge

## Incident Response

### Runbook: Backend Down

1. Check Railway dashboard - is service running?
2. Check health endpoint - does it respond?
3. Check Railway logs - any errors?
4. Check Supabase - is database accessible?
5. Restart service if needed
6. Post-mortem: What caused it?

### Runbook: High Error Rate

1. Check Railway logs for error messages
2. Identify which endpoint is failing
3. Check if external API (Reddit) is down
4. Check database connection
5. Fix and deploy
6. Monitor recovery

### Runbook: No Data Collection

1. Check cron job is running
2. Test collection endpoint manually
3. Check Reddit API credentials
4. Check rate limits
5. Verify Supabase write permissions
6. Restart collection

## Cost Monitoring

### Track Monthly Costs

- Railway: $0-20/month
- Vercel: $0-20/month
- Supabase: $0-25/month
- Monitoring tools: $0-50/month

**Total: $0-115/month**

### Cost Optimization

- Stay on free tiers until revenue
- Use Supabase connection pooling
- Cache aggressively
- Optimize database queries
- Delete old data (>90 days)

## Summary

**Week 1:** Set up basic monitoring (Railway, Vercel, Supabase dashboards)

**Week 2-4:** Add UptimeRobot for uptime monitoring

**Month 2+:** Add error tracking (Sentry) when revenue allows

**Month 6+:** Full observability stack when at $5K+ MRR

**Remember:** Start simple. Add complexity as you grow.
