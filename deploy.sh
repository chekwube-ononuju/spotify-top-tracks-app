#!/bin/bash

# Spotify Top Tracks App Deployment Script

echo "🎵 Spotify Top Tracks App Deployment"
echo "======================================"

# Check if all required environment variables are set
echo "📋 Checking environment variables..."

if [ ! -f "server/.env" ]; then
    echo "❌ Server .env file not found. Please create server/.env with your Spotify credentials."
    exit 1
fi

if [ ! -f "client/.env" ]; then
    echo "❌ Client .env file not found. Please create client/.env with your server URL."
    exit 1
fi

echo "✅ Environment files found"

# Install dependencies
echo "📦 Installing dependencies..."
npm run install:all

# Build the client
echo "🏗️ Building client..."
cd client && npm run build
cd ..

echo "✅ Build complete!"
echo ""
echo "🚀 Deployment Options:"
echo "======================"
echo ""
echo "1. Local Development:"
echo "   npm run dev"
echo ""
echo "2. Deploy to Vercel:"
echo "   Frontend: cd client && vercel --prod"
echo "   Backend:  cd server && vercel --prod"
echo ""
echo "3. Deploy to Heroku:"
echo "   Frontend: git subtree push --prefix client heroku-frontend main"
echo "   Backend:  git subtree push --prefix server heroku-backend main"
echo ""
echo "📝 Don't forget to:"
echo "- Update Spotify app redirect URIs for production"
echo "- Set environment variables in your hosting platform"
echo "- Update REACT_APP_SERVER_URL in client .env for production"
echo ""
echo "🎉 Ready to deploy!"
