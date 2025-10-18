#!/bin/bash

# Meme Market - Deployment Checklist Script

echo "🚀 Meme Market Deployment Checklist"
echo "===================================="
echo ""

# Check environment variables
check_backend_env() {
    echo "Checking backend environment variables..."
    
    if [ ! -f "backend/.env" ]; then
        echo "❌ backend/.env not found"
        return 1
    fi
    
    required_vars=("REDDIT_CLIENT_ID" "REDDIT_CLIENT_SECRET" "SUPABASE_URL" "SUPABASE_KEY" "SECRET_KEY")
    
    for var in "${required_vars[@]}"; do
        if grep -q "^${var}=your_" backend/.env; then
            echo "❌ ${var} not configured"
            return 1
        fi
    done
    
    echo "✅ Backend environment variables configured"
    return 0
}

check_frontend_env() {
    echo "Checking frontend environment variables..."
    
    if [ ! -f "frontend/.env.local" ]; then
        echo "❌ frontend/.env.local not found"
        return 1
    fi
    
    if grep -q "localhost:8000" frontend/.env.local; then
        echo "⚠️  Frontend still pointing to localhost"
    else
        echo "✅ Frontend environment configured"
    fi
}

# Run checks
check_backend_env
check_frontend_env

echo ""
echo "Deployment Checklist:"
echo "[ ] Railway account created"
echo "[ ] Vercel account created"
echo "[ ] Backend deployed to Railway"
echo "[ ] Frontend deployed to Vercel"
echo "[ ] Database schema run in Supabase"
echo "[ ] Cron job configured"
echo "[ ] Initial data collected"
echo "[ ] Health endpoint returns 200"
echo "[ ] Predictions API returns data"
echo "[ ] Frontend shows live predictions"
echo ""