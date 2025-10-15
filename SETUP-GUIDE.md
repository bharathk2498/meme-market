# MEME MARKET SETUP GUIDE
Reddit-Only Free Version

## PREREQUISITES

You should have:
- [ ] Reddit API credentials
- [ ] Supabase project created
- [ ] Perplexity API key
- [ ] N8N account active

---

## STEP 1: SUPABASE DATABASE SETUP (5 minutes)

1. Go to your Supabase project: https://supabase.com/dashboard/project/YOUR_PROJECT
2. Click "SQL Editor" in left sidebar
3. Click "New Query"
4. Copy entire contents of `database-schema.sql`
5. Paste into SQL Editor
6. Click "Run" (bottom right)
7. Wait for success message
8. Verify tables created:
   - Go to "Table Editor"
   - You should see: reddit_posts, virality_predictions, prediction_accuracy, users, email_alerts

---

## STEP 2: N8N REDDIT SCRAPER SETUP (15 minutes)

### Add Reddit Credentials to N8N:

1. Go to https://app.n8n.cloud
2. Click your profile (top right) → "Settings" → "Credentials"
3. Click "Add Credential"
4. Search for "Reddit"
5. Select "Reddit OAuth2 API"
6. Fill in:
   - **Client ID**: (from Reddit app)
   - **Client Secret**: (from Reddit app)
7. Click "Create"
8. Save credential name: "Reddit account"

### Import Reddit Scraper Workflow:

1. In N8N, click "Workflows" → "Add workflow"
2. Click three dots (top right) → "Import from File"
3. Select `n8n-reddit-scraper.json`
4. Workflow will load
5. For each Reddit node:
   - Click the node
   - Under "Credentials" dropdown
   - Select "Reddit account"
6. Click "Save" (top right)
7. Name it: "Reddit Trend Collector"

### Add Supabase Credentials:

1. Click "Settings" → "Credentials" → "Add Credential"
2. Search "Supabase"
3. Fill in:
   - **Host**: Your Supabase project URL (https://xxxxx.supabase.co)
   - **Service Role Key**: From Supabase Settings → API → service_role key
4. Save as: "Supabase account"
5. Go back to workflow
6. Click "Save to Supabase" node
7. Select "Supabase account" credential

### Test the Workflow:

1. Click "Execute Workflow" (top right)
2. Watch nodes light up green
3. Should complete in 30-60 seconds
4. Check Supabase → Table Editor → reddit_posts
5. You should see ~100 posts added

### Activate Automation:

1. Toggle "Active" switch (top right)
2. Workflow will now run every 2 hours automatically
3. Leave it running for 48 hours to accumulate data

---

## STEP 3: N8N VIRALITY PREDICTOR SETUP (15 minutes)

### Add Perplexity Credentials:

1. Go to N8N → Settings → Credentials
2. Click "Add Credential"
3. Search "HTTP Header Auth"
4. Fill in:
   - **Name**: Authorization
   - **Value**: Bearer YOUR_PERPLEXITY_API_KEY
5. Save as: "Perplexity API"

### Import Predictor Workflow:

1. Click "Workflows" → "Add workflow"
2. Import `n8n-virality-predictor.json`
3. Update credentials in these nodes:
   - "Get Recent Posts" → Supabase account
   - "Perplexity AI Enhancement" → Perplexity API
   - "Save Predictions" → Supabase account
4. Save workflow as: "Virality Predictor"

### Test Predictions:

1. Make sure you have posts in database (from Step 2)
2. Click "Execute Workflow"
3. Watch the flow:
   - Gets recent posts
   - Calculates metrics
   - Filters high potential
   - Calls Perplexity API
   - Combines scores
   - Saves predictions
4. Check Supabase → virality_predictions table
5. You should see predictions with scores 0-100

### Activate Automation:

1. Toggle "Active" (top right)
2. Will run every 2 hours
3. Generates fresh predictions continuously

---

## STEP 4: VERIFY DATA COLLECTION (5 minutes)

### Check Reddit Posts:

1. Go to Supabase → SQL Editor
2. Run this query:
```sql
SELECT 
  COUNT(*) as total_posts,
  COUNT(DISTINCT subreddit) as subreddits,
  MAX(upvotes) as highest_upvotes,
  AVG(upvotes) as avg_upvotes
FROM reddit_posts;
```
3. You should see:
   - total_posts: 100+ (after first run)
   - subreddits: 4
   - Data populating

### Check Predictions:

1. Run this query:
```sql
SELECT 
  COUNT(*) as total_predictions,
  AVG(prediction_score) as avg_score,
  MAX(prediction_score) as highest_score
FROM virality_predictions
WHERE predicted_at > NOW() - INTERVAL '24 hours';
```
2. After predictor runs, you should see scores

### View Top Predictions:

```sql
SELECT * FROM top_predictions_24h;
```

---

## STEP 5: WAIT 48 HOURS FOR DATA

**CRITICAL:** You need 48 hours of data before predictions are accurate.

### What's Happening:

- Hour 0-24: Collecting baseline data
- Hour 24-48: Building prediction patterns
- Hour 48+: Predictions become accurate

### During Wait Period:

- [ ] Monitor N8N workflows (check for errors)
- [ ] Verify data accumulating in Supabase
- [ ] Start building landing page (Day 3 task)
- [ ] Prepare Product Hunt submission

---

## TROUBLESHOOTING

### Reddit API Errors:

**Error: "Invalid credentials"**
- Double-check Client ID and Secret
- Make sure you're using OAuth2 credentials
- Reddit username/password not needed for OAuth2

**Error: "Rate limit exceeded"**
- Reddit free tier: 60 requests/minute
- Reduce number of posts per subreddit
- Increase time between runs

### Supabase Errors:

**Error: "relation does not exist"**
- Database schema not created
- Re-run database-schema.sql
- Check table names match exactly

**Error: "permission denied"**
- Using anon key instead of service_role key
- Go to Settings → API
- Copy service_role key (NOT anon key)

### N8N Errors:

**Workflow won't activate:**
- Check all credentials are connected
- Each node needs proper credential
- Test workflow manually first

**Perplexity API fails:**
- Check API key is correct
- Verify you have credits remaining
- Check Bearer token format: "Bearer pplx-xxxxx"

---

## VERIFICATION CHECKLIST

Before moving to Day 3, verify:

- [ ] Reddit posts collecting every 2 hours
- [ ] Supabase has 100+ posts
- [ ] Predictions running every 2 hours
- [ ] Prediction scores 0-100 range
- [ ] No errors in N8N execution logs
- [ ] 48 hours of data accumulated

---

## NEXT STEPS

Once you have 48 hours of data:

1. Calculate actual prediction accuracy
2. Test with real viral posts
3. Adjust scoring algorithm if needed
4. Build frontend dashboard
5. Launch on Product Hunt

**Target: 60%+ prediction accuracy before launch**

---

## MONITORING

### Daily Checks:

```sql
-- Posts collected today
SELECT COUNT(*) 
FROM reddit_posts 
WHERE collected_at > NOW() - INTERVAL '24 hours';

-- Predictions made today
SELECT COUNT(*) 
FROM virality_predictions 
WHERE predicted_at > NOW() - INTERVAL '24 hours';

-- Top predictions right now
SELECT title, subreddit, prediction_score, ai_reasoning
FROM top_predictions_24h
LIMIT 10;
```

---

Good luck! You're now collecting data. Check back in 48 hours to start predictions.
