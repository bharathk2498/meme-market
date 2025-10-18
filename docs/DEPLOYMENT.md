# Deployment Guide

## Railway Deployment (Backend)

### Step 1: Prepare Railway Account
1. Sign up at https://railway.app
2. Connect your GitHub account
3. Create new project

### Step 2: Deploy Backend
1. Click "New Project" > "Deploy from GitHub repo"
2. Select `bharathk2498/meme-market`
3. Configure:
   - Root directory: `/backend`
   - Build command: `pip install -r requirements.txt`
   - Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### Step 3: Set Environment Variables
In Railway dashboard, add all variables from `backend/.env.example`:

```bash
REDDIT_CLIENT_ID=your_value
REDDIT_CLIENT_SECRET=your_value
REDDIT_USER_AGENT=MemeMarket/1.0
SUPABASE_URL=your_value
SUPABASE_KEY=your_value
SUPABASE_SERVICE_KEY=your_value
SECRET_KEY=your_value
ENVIRONMENT=production
```

### Step 4: Get Backend URL
Railway will provide a URL like: `https://meme-market-production.up.railway.app`

## Vercel Deployment (Frontend)

### Step 1: Prepare Vercel Account
1. Sign up at https://vercel.com
2. Connect your GitHub account

### Step 2: Deploy Frontend
1. Click "New Project"
2. Import `bharathk2498/meme-market`
3. Configure:
   - Framework: Next.js
   - Root directory: `/frontend`
   - Build command: `npm run build`
   - Output directory: `.next`

### Step 3: Set Environment Variables
In Vercel dashboard:

```bash
NEXT_PUBLIC_API_URL=https://your-railway-backend-url.railway.app/api/v1
NEXT_PUBLIC_SITE_URL=https://your-frontend.vercel.app
```

### Step 4: Deploy
Vercel will auto-deploy on every push to main branch

## Supabase Setup

### Step 1: Create Project
1. Go to https://supabase.com
2. Create new project
3. Wait for setup (2-3 minutes)

### Step 2: Run Database Schema
1. Go to SQL Editor in Supabase dashboard
2. Copy content from `database-schema.sql`
3. Run the SQL
4. Verify tables created: `posts`, `predictions`, `users`

### Step 3: Get API Keys
1. Go to Settings > API
2. Copy:
   - Project URL
   - anon/public key (for frontend)
   - service_role key (for backend)

## Reddit API Setup

### Step 1: Create Reddit App
1. Go to https://www.reddit.com/prefs/apps
2. Click "create another app"
3. Fill:
   - Name: Meme Market
   - Type: web app
   - Redirect URI: http://localhost:8000
4. Save and note:
   - Client ID (under app name)
   - Client Secret

## Testing Deployment

### Backend Health Check
```bash
curl https://your-backend-url.railway.app/health
```

Should return:
```json
{
  "status": "healthy",
  "database": "connected"
}
```

### Frontend Check
Visit `https://your-frontend.vercel.app`

Should see:
- Landing page loads
- Live predictions section shows data
- No console errors

## Post-Deployment

### Setup Cron Job for Data Collection
1. Use Railway Cron or external service (cron-job.org)
2. Schedule POST request to:
   ```
   https://your-backend-url.railway.app/api/v1/reddit/collect
   ```
3. Run every 2 hours

### Monitor Performance
- Railway: Check logs and metrics
- Vercel: Check Analytics dashboard
- Supabase: Monitor database usage

## Troubleshooting

### Backend won't start
- Check Railway logs
- Verify all environment variables are set
- Test Reddit API credentials

### Frontend can't connect to backend
- Verify NEXT_PUBLIC_API_URL is correct
- Check CORS settings in backend
- Test backend endpoint directly

### No predictions showing
- Run data collection manually
- Check Supabase tables have data
- Verify API endpoint returns data

## Security Checklist

- [ ] All secrets in environment variables (never in code)
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] HTTPS enforced
- [ ] API keys rotated regularly
- [ ] Supabase RLS policies enabled
