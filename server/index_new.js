// server/index.js
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Spotify OAuth Configuration
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

// Country code mapping for regional data
const COUNTRY_CODES = {
  'United States': 'US',
  'United Kingdom': 'GB', 
  'Canada': 'CA',
  'Australia': 'AU',
  'Germany': 'DE',
  'France': 'FR',
  'Japan': 'JP',
  'Brazil': 'BR',
  'Mexico': 'MX',
  'Spain': 'ES',
  'Italy': 'IT',
  'Netherlands': 'NL',
  'Sweden': 'SE',
  'Norway': 'NO',
  'Denmark': 'DK',
  'Finland': 'FI',
  'Poland': 'PL',
  'India': 'IN',
  'South Korea': 'KR',
  'Argentina': 'AR'
};

// Login Route
app.get('/login', (req, res) => {
  const scope = 'user-top-read user-library-read user-read-recently-played';
  const authURL = new URL('https://accounts.spotify.com/authorize');
  
  const params = {
    response_type: 'code',
    client_id: CLIENT_ID,
    scope: scope,
    redirect_uri: REDIRECT_URI,
  };

  authURL.search = new URLSearchParams(params).toString();
  res.redirect(authURL.toString());
});

// Callback Route
app.get('/callback', async (req, res) => {
  try {
    const code = req.query.code;
    
    // Exchange code for access token
    const tokenResponse = await axios.post('https://accounts.spotify.com/api/token', 
      new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET
      }), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }
    );

    // Redirect to frontend with access token
    res.redirect(`${process.env.CLIENT_URL}/?access_token=${tokenResponse.data.access_token}`);
    
  } catch (error) {
    console.error('Token exchange error:', error.response?.data || error.message);
    res.status(500).send('Authentication failed');
  }
});

// Get top 50 tracks from beginning of year
app.get('/top-tracks-year', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    // Get user's top tracks for the year
    const response = await axios.get('https://api.spotify.com/v1/me/top/tracks', {
      headers: { Authorization: `Bearer ${token}` },
      params: { 
        time_range: 'long_term',
        limit: 50 
      }
    });
    
    res.json(response.data.items);
  } catch (error) {
    console.error('Top tracks year error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch top tracks for the year' });
  }
});

// Get user's profile info
app.get('/user-profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const response = await axios.get('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    res.json(response.data);
  } catch (error) {
    console.error('User profile error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Get regional charts data
app.get('/regional-charts/:country', async (req, res) => {
  try {
    const { country } = req.params;
    const countryCode = COUNTRY_CODES[country] || country.toUpperCase();
    
    // Get client credentials token for public data
    const tokenResponse = await axios.post('https://accounts.spotify.com/api/token',
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET
      }), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }
    );

    const accessToken = tokenResponse.data.access_token;

    // Get featured playlists for the country
    const playlistsResponse = await axios.get('https://api.spotify.com/v1/browse/featured-playlists', {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: {
        country: countryCode,
        limit: 5
      }
    });

    if (playlistsResponse.data.playlists.items.length === 0) {
      return res.json({ tracks: [], message: 'No data available for this region' });
    }

    // Get tracks from the first featured playlist
    const playlistId = playlistsResponse.data.playlists.items[0].id;
    const tracksResponse = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: { limit: 10 }
    });

    const tracks = tracksResponse.data.items
      .filter(item => item.track && item.track.name)
      .map(item => ({
        id: item.track.id,
        name: item.track.name,
        artists: item.track.artists.map(artist => ({ name: artist.name })),
        album: { name: item.track.album.name },
        popularity: item.track.popularity,
        preview_url: item.track.preview_url
      }));

    res.json({ 
      tracks, 
      country: country,
      playlistName: playlistsResponse.data.playlists.items[0].name 
    });

  } catch (error) {
    console.error('Regional charts error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch regional charts' });
  }
});

// Get available countries
app.get('/countries', (req, res) => {
  res.json(Object.keys(COUNTRY_CODES));
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start Server
const PORT = process.env.PORT || 8888;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 Access via ngrok: https://8c25-50-30-222-243.ngrok-free.app`);
});
