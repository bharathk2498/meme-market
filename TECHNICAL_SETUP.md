# MEME MARKET - TECHNICAL SETUP GUIDE

Last Updated: October 13, 2025

## OVERVIEW

Complete technical setup for Meme Market, the AI-powered viral trend prediction platform. This guide covers a 7-day build timeline from zero to launch.

---

## TECHNOLOGY STACK

### Frontend
- Bolt.new for rapid UI development
- React components
- Tailwind CSS for styling
- Deployed on Vercel

### Backend
- Supabase for database and auth
- Supabase Edge Functions for API endpoints
- Supabase Storage for any assets

### AI Services
- Perplexity API for trend analysis and prediction
- OpenAI GPT-4 as fallback/supplement

### Data Collection
- N8N for automated scraping workflows
- Apify for social media data collection
- Custom scrapers for each platform

### Automation
- N8N workflows running every 2 hours
- Scheduled data processing
- Email alerts via N8N

### Payment
- Stripe for subscriptions
- Stripe Customer Portal for self-service

---

## WHAT WE ARE BUILDING

### Core Features
- Real-time social media trend monitoring
- Virality score calculation
- 24-hour prediction timeline
- Daily trend reports
- Email alerts for hot trends

### Data Sources
- Twitter trending topics and engagement
- Reddit hot posts across top subreddits
- (TikTok and Instagram planned for Phase 2)

### Not Building Yet
- Mobile app
- API access for customers
- White-label solution
- Historical trend database (only last 30 days)

---

## STEP BY STEP SETUP

### Step 1: Domain and Hosting

1. Purchase Domain
   - Go to Namecheap or GoDaddy
   - Search for mememarket.com or mememarket.ai
   - Purchase for 1 year
   - Cost: $15-25 per year

2. Set Up Vercel
   - Go to vercel.com
   - Sign up with GitHub
   - Connect meme-market repository
   - Auto-deploy on push to main branch

3. Connect Domain to Vercel
   - In Vercel dashboard, go to project settings
   - Click Domains
   - Add purchased domain
   - Follow DNS configuration steps
   - Add both www and root domain
   - Verify HTTPS certificate active

### Step 2: Supabase Setup

1. Create Supabase Project
   - Go to supabase.com
   - Click New Project
   - Name: mememarket-production
   - Choose region closest to users (US East recommended)
   - Set strong database password
   - Save password securely
   - Wait 2-3 minutes for setup

2. Get API Credentials
   - In Supabase dashboard, go to Settings > API
   - Copy Project URL
   - Copy anon public key
   - Copy service role key
   - Store in password manager

3. Add to Vercel Environment Variables
   - In Vercel project settings
   - Add these variables:
     - NEXT_PUBLIC_SUPABASE_URL
     - NEXT_PUBLIC_SUPABASE_ANON_KEY
     - SUPABASE_SERVICE_ROLE_KEY

### Step 3: Database Schema

1. Open Supabase SQL Editor
   - Click SQL Editor in sidebar
   - Create new query
   - Copy schema from DATABASE_SCHEMA.md
   - Run query
   - Verify tables created under Database > Tables

2. Enable Row Level Security
   - For each table, enable RLS
   - Create policies as documented
   - Test with dummy user

3. Set Up Storage
   - Go to Storage section
   - Create bucket: "trend-images"
   - Set to public (for trend screenshots)
   - Create policies for upload/read

### Step 4: Perplexity API Setup

1. Create Perplexity Account
   - Go to perplexity.ai/api
   - Sign up for API access
   - Choose Pro plan ($20/month for 5,000 queries)
   - Add payment method

2. Generate API Key
   - In Perplexity dashboard
   - Create new API key
   - Name it "mememarket-prod"
   - Copy and save immediately
   - Add to Vercel as PERPLEXITY_API_KEY

3. Test API Connection
   - Use Postman or similar
   - Make test request
   - Verify response format
   - Check rate limits (300 requests/minute)

### Step 5: N8N Workflow Setup

1. Create N8N Account
   - Option A: N8N Cloud ($20/month) - Easiest
   - Option B: Self-host on Railway ($7/month)
   - Recommended: Start with N8N Cloud

2. Create Data Collection Workflows

Twitter Scraping Workflow:
   - Trigger: Cron job every 2 hours
   - Node: HTTP Request to Twitter API or Apify
   - Node: Parse JSON response
   - Node: Calculate engagement velocity
   - Node: Store in Supabase
   - Node: Calculate virality score

Reddit Scraping Workflow:
   - Trigger: Cron job every 2 hours
   - Node: HTTP Request to Reddit API
   - Node: Filter hot posts from r/all, r/memes, r/dankmemes
   - Node: Calculate upvote velocity
   - Node: Store in Supabase
   - Node: Check for cross-platform presence

Trend Analysis Workflow:
   - Trigger: Every 6 hours
   - Node: Fetch all recent trends from database
   - Node: HTTP Request to Perplexity API
   - Node: Calculate prediction scores
   - Node: Update trend predictions
   - Node: Send alerts for high-scoring trends

3. Connect N8N to Supabase
   - In N8N, add Supabase credentials
   - Use service role key
   - Test insert and read operations
   - Verify data flowing correctly

### Step 6: Apify Setup (Optional but Recommended)

1. Create Apify Account
   - Go to apify.com
   - Sign up for free tier (includes $5 credit)
   - Free tier sufficient for MVP

2. Set Up Twitter Scraper
   - Find Twitter Scraper actor in Apify Store
   - Configure to track trending topics
   - Set up to run every 2 hours
   - Get API token
   - Add to N8N workflow

3. Set Up Reddit Scraper
   - Find Reddit Scraper actor
   - Configure for hot posts
   - Track engagement metrics
   - Integrate with N8N

### Step 7: Stripe Payment Setup

1. Create Stripe Account
   - Go to stripe.com
   - Sign up and complete verification
   - Takes 1-2 days for approval

2. Create Products
   - Free Tier: $0 (limit to 3 daily predictions)
   - Pro Plan: $99/month
   - Agency Plan: $499/month

3. Get API Keys
   - Developers > API Keys
   - Copy Publishable key
   - Copy Secret key
   - Add both to Vercel environment variables

4. Set Up Webhook
   - Developers > Webhooks
   - Add endpoint: yourapp.com/api/stripe-webhook
   - Select events: subscription created/deleted
   - Copy webhook secret
   - Add to environment variables

### Step 8: Email Notifications

1. Choose Email Service
   - Recommended: Resend (easiest setup)
   - Alternative: SendGrid
   - Free tier: 100 emails/day

2. Set Up Resend
   - Go to resend.com
   - Sign up with GitHub
   - Verify domain (mememarket.com)
   - Generate API key
   - Add to Vercel as EMAIL_API_KEY

3. Create Email Templates
   - Daily trend digest
   - Hot trend alert
   - Welcome email
   - Weekly summary
   - Store in N8N or code

---

## DATA PIPELINE ARCHITECTURE

### Every 2 Hours (Data Collection)

1. N8N triggers Twitter scraper
2. N8N triggers Reddit scraper
3. Store raw data in Supabase trends table
4. Calculate engagement velocity
5. Check for cross-platform presence

### Every 6 Hours (Analysis)

1. Fetch all trends from last 24 hours
2. Send batch to Perplexity API
3. Get prediction scores and reasoning
4. Update trends table with predictions
5. Identify high-probability viral trends
6. Send alerts to users subscribed to notifications

### Daily at 9 AM (Report Generation)

1. Aggregate top 10 trends
2. Generate prediction report
3. Email to all Pro users
4. Post top 3 on landing page for free users
5. Archive previous day's data

---

## PREDICTION ALGORITHM

### Version 1 (Simple but Effective)

Virality Score = (Engagement Velocity × 0.4) + (Cross-Platform Presence × 0.3) + (Sentiment Momentum × 0.2) + (Influencer Involvement × 0.1)

Where:
- Engagement Velocity = Rate of likes/comments/shares over time
- Cross-Platform Presence = Found on multiple platforms (Twitter + Reddit = bonus)
- Sentiment Momentum = Rapid increase in positive sentiment
- Influencer Involvement = Mention by accounts with 10K+ followers

Score Range: 0-100
- 0-30: Low probability of going viral
- 31-60: Medium probability
- 61-80: High probability
- 81-100: Very high probability (send immediate alert)

### Accuracy Tracking

Store all predictions with:
- Timestamp of prediction
- Predicted score
- Actual outcome (measure 24-48 hours later)
- Calculate rolling accuracy percentage
- Display publicly to build trust

---

## DEVELOPMENT WORKFLOW

### Local Development

1. Clone Repository
   ```
   git clone https://github.com/bharathk2498/meme-market.git
   cd meme-market
   ```

2. Install Dependencies
   ```
   npm install
   ```

3. Create .env.local
   - Copy all environment variables
   - Never commit to git
   - Add to .gitignore

4. Run Development Server
   ```
   npm run dev
   ```
   - Open localhost:3000
   - Changes auto-reload

### Deployment

1. Push to GitHub
   ```
   git add .
   git commit -m "Add feature"
   git push origin main
   ```

2. Vercel Auto-Deploys
   - Builds in 2-3 minutes
   - Live at mememarket.com
   - Check deployment log for errors

3. Test Production
   - Verify all features work
   - Check data collection running
   - Test payment flow
   - Monitor error logs

---

## TESTING CHECKLIST

### Manual Testing

1. Data Collection
   - Verify N8N workflows running
   - Check data appearing in Supabase
   - Confirm updates every 2 hours
   - Validate data structure

2. Prediction Generation
   - Check Perplexity API calls working
   - Verify scores calculated correctly
   - Confirm accuracy tracking
   - Test alert system

3. User Flow
   - Sign up and verify email
   - View free tier predictions
   - Upgrade to Pro
   - Verify Pro features unlock
   - Test email notifications

4. Payment Flow
   - Subscribe with test card
   - Verify webhook received
   - Check subscription active
   - Test cancellation
   - Verify access revoked after cancel

---

## COST BREAKDOWN (MONTHLY)

### Required Services
- Domain: $1.25
- Vercel Pro: $20
- Supabase Pro: $25
- N8N Cloud: $20
- Perplexity API: $20
- Apify: $5-10 (usage-based)
- Resend: $0 (free tier for start)
- Stripe: $0 (only fees per transaction)

Total: Approximately $91-96 per month

### Variable Costs
- Perplexity API: $0.01-0.05 per query
- Apify: $0.25 per 1000 results
- Estimate: $50-100/month at scale

### Total Expected: $140-200/month

---

## 7-DAY BUILD TIMELINE

### Day 1-2: Data Collection
- Set up N8N workflows
- Configure Twitter and Reddit scrapers
- Test data flowing into Supabase
- Verify data quality

### Day 3-4: Prediction Engine
- Integrate Perplexity API
- Build scoring algorithm
- Test prediction accuracy
- Set up alert system

### Day 5-6: Frontend and Dashboard
- Build landing page with Bolt.new
- Create user dashboard
- Add free vs Pro differentiation
- Implement payment flow

### Day 7: Testing and Launch
- End-to-end testing
- Fix critical bugs
- Deploy to production
- Launch on Product Hunt

---

## MONITORING AND MAINTENANCE

### Daily Checks
- N8N workflows still running
- Data collecting properly
- No API errors
- Prediction accuracy tracking

### Weekly Tasks
- Review prediction accuracy
- Optimize algorithm if needed
- Check API costs
- Review user feedback

### Monthly Tasks
- Audit all costs
- Optimize expensive queries
- Review and improve algorithm
- Add new data sources if needed

---

## SECURITY CHECKLIST

- API keys in environment variables only
- Database RLS enabled
- HTTPS enforced
- Rate limiting on public endpoints
- Input validation on all forms
- CORS configured correctly
- Webhook signature verification
- Regular dependency updates

---

## TROUBLESHOOTING

### N8N Workflow Not Running
- Check workflow is activated
- Verify cron schedule correct
- Review execution logs
- Test manual execution
- Check API credentials still valid

### Data Not Appearing in Supabase
- Verify N8N connection to Supabase
- Check table structure matches insert
- Review RLS policies
- Test manual insert via SQL Editor
- Check for error messages in N8N logs

### Predictions Are Inaccurate
- Review recent predictions vs outcomes
- Check data quality from sources
- Adjust algorithm weights
- Increase training data sample size
- Consider adding more data sources

### Perplexity API Errors
- Check API key valid
- Verify not hitting rate limits (300/min)
- Review request format
- Check account has credits
- Test with simpler query

---

## NEXT STEPS AFTER SETUP

1. Deploy landing page
2. Start data collection (run for 48 hours)
3. Generate first predictions
4. Test accuracy manually
5. Launch to beta users
6. Collect feedback
7. Iterate on algorithm
8. Scale marketing

---

This setup should take 2-3 days if following step by step. The remaining 4-5 days are for testing and iteration before launch.
