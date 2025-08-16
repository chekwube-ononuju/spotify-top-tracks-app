// server/index.js

/*
 * Backend for the Spotify Top Tracks app.
 *
 * This version uses only environment variables for sensitive configuration
 * and defaults to HTTPS for local development.  The previous implementation
 * fell back to hard‑coded client credentials and http:// URLs; however, the
 * Spotify Web API requires that redirect URIs use HTTPS and it’s best
 * practice never to check secrets into source code.  See README.md and
 * server/.env.example for instructions on configuring these values.
 */

require('dotenv').config();
const express = require('express');
const axios   = require('axios');
const cors    = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Spotify OAuth configuration.  These values must be set in `server/.env`.
const CLIENT_ID     = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI  = process.env.REDIRECT_URI;

// When redirecting back to the React frontend, fall back to HTTPS on
// localhost if CLIENT_URL is not defined.  This avoids using plain HTTP,
// which the Spotify OAuth flow will reject.  You can override this by
// setting CLIENT_URL in your environment.
const CLIENT_URL = process.env.CLIENT_URL || 'https://localhost:3000';

// Country code mapping for regional charts.  Feel free to add/remove
// countries here as desired.
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
  const params  = {
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
    // Exchange the authorization code for an access token
    const tokenResponse = await axios.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    // Send the user back to the frontend with the access token
    res.redirect(`${CLIENT_URL}/?access_token=${tokenResponse.data.access_token}`);
  } catch (error) {
    console.error('Token exchange error:', error.response?.data || error.message);
    res.status(500).send('Authentication failed');
  }
});

// Get top 50 tracks from the beginning of the year
app.get('/top-tracks-year', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const response = await axios.get('https://api.spotify.com/v1/me/top/tracks', {
      headers: { Authorization: `Bearer ${token}` },
      params: { time_range: 'long_term', limit: 50 },
    });
    res.json(response.data.items);
  } catch (error) {
    console.error('Top tracks year error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch top tracks for the year' });
  }
});

// Get user's Spotify profile
app.get('/user-profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const response = await axios.get('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    res.json(response.data);
  } catch (error) {
    console.error('User profile error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Get regional charts data for a given country
app.get('/regional-charts/:country', async (req, res) => {
  try {
    const { country } = req.params;
    const countryCode = COUNTRY_CODES[country] || country.toUpperCase();
    // Request a client credentials token for public data
    const tokenResponse = await axios.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    const accessToken = tokenResponse.data.access_token;
    // Get featured playlists for the selected country
    const playlistsResponse = await axios.get(
      'https://api.spotify.com/v1/browse/featured-playlists',
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { country: countryCode, limit: 5 },
      }
    );
    if (playlistsResponse.data.playlists.items.length === 0) {
      return res.json({ tracks: [], message: 'No data available for this region' });
    }
    // Get tracks from the first featured playlist
    const playlistId = playlistsResponse.data.playlists.items[0].id;
    const tracksResponse = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: { limit: 10 },
    });
    const tracks = tracksResponse.data.items
      .filter((item) => item.track && item.track.name)
      .map((item) => ({
        id: item.track.id,
        name: item.track.name,
        artists: item.track.artists.map((artist) => ({ name: artist.name })),
        album: { name: item.track.album.name },
        popularity: item.track.popularity,
        preview_url: item.track.preview_url,
      }));
    res.json({ tracks, country: country, playlistName: playlistsResponse.data.playlists.items[0].name });
  } catch (error) {
    console.error('Regional charts error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch regional charts' });
  }
});

// Provide a list of all supported countries
app.get('/countries', (req, res) => {
  res.json(Object.keys(COUNTRY_CODES));
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start the server
const PORT = process.env.PORT || 8888;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});