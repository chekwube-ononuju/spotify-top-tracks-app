#!/bin/bash

echo "🔍 Spotify App Deployment Checker"
echo "================================="

# Check if logged into Vercel
echo "Checking Vercel authentication..."
if npx vercel whoami &> /dev/null; then
    VERCEL_USER=$(npx vercel whoami)
    echo "✅ Logged in as: $VERCEL_USER"
else
    echo "❌ Not logged into Vercel"
    echo "   Run: npx vercel login"
    exit 1
fi

# Check environment files
echo ""
echo "Checking environment configuration..."
if [ -f "server/.env" ]; then
    echo "✅ Server .env exists"
else
    echo "❌ Server .env missing"
fi

if [ -f "client/.env" ]; then
    echo "✅ Client .env exists"
else
    echo "❌ Client .env missing"
fi

# Check dependencies
echo ""
echo "Checking dependencies..."
if [ -d "server/node_modules" ]; then
    echo "✅ Server dependencies installed"
else
    echo "❌ Server dependencies missing (run: cd server && npm install)"
fi

if [ -d "client/node_modules" ]; then
    echo "✅ Client dependencies installed"
else
    echo "❌ Client dependencies missing (run: cd client && npm install)"
fi

echo ""
echo "🚀 Ready to deploy? Run:"
echo "   npx vercel --prod (in server/ then client/)"
