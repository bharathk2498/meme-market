#!/bin/bash

# Meme Market - Quick Setup Script
# Run this after creating accounts for Supabase, Reddit, Railway, Vercel

echo "🚀 Meme Market Setup Script"
echo "============================="
echo ""

# Check if running from project root
if [ ! -f "README.md" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Backend setup
echo "📦 Setting up backend..."
cd backend

if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

echo "Activating virtual environment..."
source venv/bin/activate

echo "Installing dependencies..."
pip install -r requirements.txt

if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please edit backend/.env with your credentials"
fi

cd ..

# Frontend setup
echo ""
echo "🎨 Setting up frontend..."
cd frontend

if [ ! -d "node_modules" ]; then
    echo "Installing Node packages..."
    npm install
fi

if [ ! -f ".env.local" ]; then
    echo "Creating .env.local file..."
    cp .env.local.example .env.local
    echo "⚠️  Please edit frontend/.env.local with your API URL"
fi

cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit backend/.env with your credentials"
echo "2. Edit frontend/.env.local with your API URL"
echo "3. Run: cd backend && source venv/bin/activate && uvicorn app.main:app --reload"
echo "4. In another terminal: cd frontend && npm run dev"
echo "5. Visit http://localhost:3000"
echo ""