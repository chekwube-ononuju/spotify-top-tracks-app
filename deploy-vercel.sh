#!/bin/bash

echo "🚀 Deploying to Vercel"
echo "====================="

# Install Vercel CLI globally
echo "📦 Installing Vercel CLI..."
npm install -g vercel

echo ""
echo "🔧 Step 1: Deploy Backend (Server)"
echo "=================================="
cd server
echo "Run: vercel --prod"
echo "- Choose 'N' for link to existing project"
echo "- Choose your team/personal account"
echo "- Enter project name: spotify-tracks-api"
echo "- Copy the deployment URL (e.g., https://spotify-tracks-api.vercel.app)"

echo ""
echo "🔧 Step 2: Deploy Frontend (Client)"
echo "===================================="
cd ../client
echo "1. First update .env with your backend URL:"
echo "   REACT_APP_SERVER_URL=https://your-backend-url.vercel.app"
echo ""
echo "2. Then run: vercel --prod"
echo "- Choose 'N' for link to existing project"
echo "- Enter project name: spotify-tracks-client"
echo "- Copy the deployment URL (e.g., https://spotify-tracks-client.vercel.app)"

echo ""
echo "🔧 Step 3: Update Spotify App Settings"
echo "======================================="
echo "Go to Spotify Developer Dashboard and add:"
echo "- https://your-backend-url.vercel.app/callback"

echo ""
echo "🔧 Step 4: Update Environment Variables"
echo "========================================"
echo "In Vercel dashboard for your backend, add:"
echo "- CLIENT_ID=your_spotify_client_id"
echo "- CLIENT_SECRET=your_spotify_client_secret"
echo "- REDIRECT_URI=https://your-backend-url.vercel.app/callback"
echo "- CLIENT_URL=https://your-frontend-url.vercel.app"

echo ""
echo "✅ Done! Your app will be live at:"
echo "https://your-frontend-url.vercel.app"
