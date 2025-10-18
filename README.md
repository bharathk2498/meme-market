# Meme Market - AI Viral Trend Prediction Platform

Predict what goes viral on Reddit 24 hours before it explodes. Built with security and scalability from day one.

## Architecture Overview

### Tech Stack
- **Backend**: Python FastAPI (secure, async, production-ready)
- **Database**: Supabase (PostgreSQL with real-time capabilities)
- **Frontend**: Next.js 14 (App Router, TypeScript, Tailwind CSS)
- **Deployment**: Railway (backend), Vercel (frontend)
- **Security**: Environment-based secrets, rate limiting, OAuth 2.0

### Key Features
- Reddit API integration with proper OAuth and rate limiting
- ML-based virality prediction engine
- Real-time trend monitoring
- Secure authentication and API key management
- Production-ready error handling and logging

## Project Structure

```
meme-market/
├── backend/              # FastAPI application
│   ├── app/
│   │   ├── api/         # API routes
│   │   ├── core/        # Config, security, database
│   │   ├── models/      # Database models
│   │   ├── services/    # Business logic
│   │   └── main.py      # Application entry point
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/            # Next.js application
│   ├── app/            # Next.js App Router
│   ├── components/     # React components
│   ├── lib/           # Utilities
│   └── public/        # Static assets
├── docs/              # Documentation
└── scripts/           # Utility scripts
```

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- Supabase account
- Reddit API credentials

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your credentials
uvicorn app.main:app --reload
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.local.example .env.local
# Edit .env.local with your API URL
npm run dev
```

## Security Features

- No credentials in code (environment variables only)
- Rate limiting on all endpoints
- API key authentication for public endpoints
- CORS properly configured
- Input validation and sanitization
- Secure database queries (parameterized)
- Error messages don't leak sensitive info

## Environment Variables

See `.env.example` files in backend and frontend directories.

## Deployment

### Backend (Railway)
1. Connect GitHub repo to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically on push to main

### Frontend (Vercel)
1. Connect GitHub repo to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main

## License

MIT

## Contributing

This is a private project. For questions, contact the maintainer.