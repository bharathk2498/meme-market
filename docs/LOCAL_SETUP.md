# Local Development Setup

## Prerequisites

- Python 3.11+
- Node.js 18+
- Redis (optional, for caching)
- Git

## Step 1: Clone Repository

```bash
git clone https://github.com/bharathk2498/meme-market.git
cd meme-market
```

## Step 2: Backend Setup

### Create Virtual Environment

```bash
cd backend
python -m venv venv

# On macOS/Linux:
source venv/bin/activate

# On Windows:
venv\Scripts\activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```bash
REDDIT_CLIENT_ID=your_reddit_client_id
REDDIT_CLIENT_SECRET=your_reddit_client_secret
REDDIT_USER_AGENT=MemeMarket/1.0

SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_role_key

SECRET_KEY=generate_with_openssl_rand_hex_32
```

### Run Backend

```bash
uvicorn app.main:app --reload
```

Backend will run at: http://localhost:8000

## Step 3: Frontend Setup

### Install Dependencies

```bash
cd ../frontend
npm install
```

### Configure Environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Run Frontend

```bash
npm run dev
```

Frontend will run at: http://localhost:3000

## Step 4: Initialize Database

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy the entire content from `database-schema.sql`
4. Paste and execute
5. Verify tables are created

## Step 5: Test Reddit Collection

### Manual Collection

```bash
curl -X POST http://localhost:8000/api/v1/reddit/collect
```

This will collect posts from Reddit and store in database.

### Check Collection Status

```bash
curl http://localhost:8000/api/v1/reddit/status
```

## Step 6: Test Predictions

```bash
curl http://localhost:8000/api/v1/predictions/top?limit=5
```

You should see JSON with top 5 predicted posts.

## Development Workflow

### Running Both Services

```bash
# Terminal 1 - Backend
cd backend
source venv/bin/activate
uvicorn app.main:app --reload

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Making Changes

1. Backend changes auto-reload with `--reload` flag
2. Frontend hot-reloads automatically
3. Database changes require running new migrations

### Testing API Endpoints

Visit http://localhost:8000/api/v1/docs for interactive API documentation (Swagger UI)

## Common Issues

### "Module not found" errors

```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd frontend
rm -rf node_modules
npm install
```

### CORS errors

Make sure `BACKEND_CORS_ORIGINS` in `.env` includes:
```bash
BACKEND_CORS_ORIGINS=["http://localhost:3000"]
```

### Database connection errors

Verify Supabase credentials:
1. Check URL format: `https://xxxxx.supabase.co`
2. Use anon key for frontend
3. Use service_role key for backend

### Reddit API rate limits

The code includes 1.1 second delay between requests to respect rate limits (60/min).

## Next Steps

- [ ] Collect initial data (run collection endpoint)
- [ ] Test predictions API
- [ ] View live predictions on frontend
- [ ] Customize subreddits in `reddit_service.py`
- [ ] Adjust prediction weights if needed
