# Spotify Top Tracks App

A full-stack web application that connects to your Spotify account to show your top 50 most listened songs from the beginning of the year to the current date, plus an interactive world map where you can explore popular music in different regions.

## Features

- 🎵 **Personal Top 50 Tracks**: View your most listened to tracks from the start of this year
- 🗺️ **Interactive World Map**: Click on any country to see popular music in that region
- 🌍 **Global Music Discovery**: Explore trending music across 20+ countries
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🎨 **Modern UI**: Beautiful Spotify-themed interface with smooth animations

## Screenshots

![Login Screen](./screenshots/login.png)
![Main Dashboard](./screenshots/dashboard.png)
![World Map](./screenshots/worldmap.png)

## Tech Stack

### Frontend
- React 19
- React Leaflet (for interactive maps)
- Axios (for API calls)
- CSS3 with modern styling

### Backend
- Node.js
- Express.js
- Spotify Web API
- CORS enabled

## Prerequisites

Before you begin, ensure you have:
- Node.js (v14 or higher)
- npm or yarn
- A Spotify Developer account

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/spotify-top-tracks-app.git
cd spotify-top-tracks-app
```

### 2. Spotify App Setup

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Note your `Client ID` and `Client Secret`
4. Add redirect URI: `http://localhost:8888/callback` (for development)

### 3. Environment Configuration

#### Server Environment
```bash
cd server
cp .env.example .env
```

Edit `.env` file:
```env
CLIENT_ID=your_spotify_client_id_here
CLIENT_SECRET=your_spotify_client_secret_here
REDIRECT_URI=http://localhost:8888/callback
CLIENT_URL=http://localhost:3000
```

#### Client Environment
```bash
cd ../client
cp .env.example .env
```

Edit `.env` file:
```env
REACT_APP_SERVER_URL=http://localhost:8888
```

### 4. Install Dependencies

From the root directory:
```bash
npm run install:all
```

### 5. Start Development Servers

```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:8888`
- Frontend app on `http://localhost:3000`

## Usage

1. Open `http://localhost:3000` in your browser
2. Click "Login with Spotify" to authenticate
3. Grant permissions to access your Spotify data
4. View your top 50 tracks from this year
5. Click on countries on the map to explore regional music

## API Endpoints

### Authentication
- `GET /login` - Initiate Spotify OAuth flow
- `GET /callback` - Handle OAuth callback

### Data Endpoints
- `GET /user-profile` - Get user's Spotify profile
- `GET /top-tracks-year` - Get user's top 50 tracks from this year
- `GET /regional-charts/:country` - Get popular tracks for a specific country
- `GET /countries` - Get list of available countries
- `GET /health` - Health check endpoint

## Deployment

### Using Vercel (Recommended)

#### Deploy Frontend (Client)
1. Install Vercel CLI: `npm i -g vercel`
2. Build the client: `cd client && npm run build`
3. Deploy: `vercel --prod`
4. Update `REACT_APP_SERVER_URL` in client `.env` to your backend URL

#### Deploy Backend (Server)
1. From server directory: `vercel --prod`
2. Add environment variables in Vercel dashboard
3. Update Spotify app redirect URI to production URL

### Using Heroku

#### Deploy Backend
```bash
# From root directory
git subtree push --prefix server heroku-backend main
```

#### Deploy Frontend
```bash
# From root directory  
git subtree push --prefix client heroku-frontend main
```

### Environment Variables for Production

Update your Spotify app settings and environment variables:

**Server (.env)**:
```env
CLIENT_ID=your_spotify_client_id
CLIENT_SECRET=your_spotify_client_secret
REDIRECT_URI=https://your-backend-domain.com/callback
CLIENT_URL=https://your-frontend-domain.com
```

**Client (.env)**:
```env
REACT_APP_SERVER_URL=https://your-backend-domain.com
```

## Project Structure

```
spotify-top-tracks-app/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── WorldMap.js
│   │   │   ├── TopTracks.js
│   │   │   ├── RegionalChart.js
│   │   │   └── UserProfile.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
├── server/                # Node.js backend
│   ├── index.js          # Main server file
│   ├── package.json
│   └── .env.example
├── package.json          # Root package.json
└── README.md
```

## Features Explained

### Personal Top Tracks
- Uses Spotify's `user-top-read` scope
- Fetches long-term listening data (approximately 1 year)
- Shows track names, artists, albums, and popularity scores
- Includes audio previews when available

### World Map Integration
- Interactive map powered by Leaflet/OpenStreetMap
- Click-to-explore functionality for 20+ countries
- Uses Spotify's featured playlists as regional music data
- Real-time data fetching for selected regions

### Regional Music Data
- Accesses Spotify's featured playlists by country
- Shows currently trending tracks in selected regions
- Displays track popularity and metadata
- Provides audio previews for regional tracks

## Limitations & Notes

- **Regional Data**: Uses Spotify's featured playlists as a proxy for regional popularity, which may not reflect exact daily charts
- **Rate Limiting**: Spotify API has rate limits; the app includes error handling for this
- **Scope**: Currently focuses on track data; could be extended to include artist/album insights
- **Time Range**: "This year" data uses Spotify's long-term range (~1 year) as the API doesn't support exact date ranges

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues:
1. Check the [Issues](https://github.com/yourusername/spotify-top-tracks-app/issues) page
2. Ensure your Spotify app credentials are correctly configured
3. Verify all environment variables are set properly
4. Check that your Spotify account has sufficient listening history

## Acknowledgments

- [Spotify Web API](https://developer.spotify.com/documentation/web-api/) for music data
- [React Leaflet](https://react-leaflet.js.org/) for map functionality
- [OpenStreetMap](https://www.openstreetmap.org/) for map tiles
- Spotify for their excellent developer platform

---

**Note**: This app is for educational and personal use. Make sure to comply with Spotify's [Developer Terms of Service](https://developer.spotify.com/terms/).
