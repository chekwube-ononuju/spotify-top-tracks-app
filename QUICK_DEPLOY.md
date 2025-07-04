# 🚀 Quick Deployment Guide

## Manual Deployment Steps

### 1. Login to Vercel
```bash
npx vercel login
```
Choose "Continue with GitHub" and authenticate in your browser.

### 2. Deploy Backend
```bash
cd server
npx vercel --prod
```
- Choose your account
- Project name: `spotify-tracks-api` 
- Copy the provided URL (e.g., `https://spotify-tracks-api.vercel.app`)

### 3. Update Client Configuration
```bash
cd ../client
```
Edit `.env` file and update:
```
REACT_APP_SERVER_URL=https://your-backend-url.vercel.app
```

### 4. Deploy Frontend  
```bash
npx vercel --prod
```
- Project name: `spotify-tracks-client`
- Copy the provided URL (e.g., `https://spotify-tracks-client.vercel.app`)

### 5. Configure Spotify App
Go to https://developer.spotify.com/dashboard
- Select your app
- Edit Settings 
- Add Redirect URI: `https://your-backend-url.vercel.app/callback`

### 6. Set Vercel Environment Variables
In Vercel dashboard for your **backend** project:
- Go to Settings → Environment Variables
- Add:
  - `CLIENT_ID` = your_spotify_client_id
  - `CLIENT_SECRET` = your_spotify_client_secret  
  - `REDIRECT_URI` = https://your-backend-url.vercel.app/callback
  - `CLIENT_URL` = https://your-frontend-url.vercel.app

### 7. Redeploy Backend (if needed)
```bash
cd server
npx vercel --prod
```

## 🎉 Your app is now live!
Visit your frontend URL to test the complete flow.

## Alternative: One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/spotify-top-tracks-app)
