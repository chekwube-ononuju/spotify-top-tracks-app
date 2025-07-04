#!/bin/bash

echo "🌐 Deploying to Netlify"
echo "======================="

echo "🔧 Step 1: Deploy Backend to Railway/Render"
echo "============================================"
echo "Backend options:"
echo "- Railway: https://railway.app (Free tier)"
echo "- Render: https://render.com (Free tier)"
echo "- Heroku: https://heroku.com (Paid only now)"

echo ""
echo "🔧 Step 2: Deploy Frontend to Netlify"
echo "======================================"
echo "1. Build the app:"
cd client
npm run build

echo ""
echo "2. Deploy options:"
echo "   a) Drag & drop: Go to netlify.com and drag the 'build' folder"
echo "   b) CLI: npm install -g netlify-cli && netlify deploy --prod --dir=build"
echo "   c) Git: Connect your GitHub repo to Netlify"

echo ""
echo "✅ Benefits:"
echo "- Custom domains"
echo "- Automatic HTTPS"
echo "- CDN worldwide"
echo "- Git-based deployments"
