// server/index.js
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

// Spotify OAuth Configuration
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

// Login Route
app.get('/login', (req, res) => {
  const scope = 'user-top-read';
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
    console.error('Token exchange error:', error.response.data);
    res.status(500).send('Authentication failed');
  }
});

// Protected Route
app.get('/top-tracks', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const response = await axios.get('https://api.spotify.com/v1/me/top/tracks', {
      headers: { Authorization: `Bearer ${token}` },
      params: { time_range: 'short_term', limit: 10 }
    });
    res.json(response.data.items);
  } catch (error) {
    console.error('Top tracks error:', error.response.data);
    res.status(500).json({ error: 'Failed to fetch top tracks' });
  }
});

// Start Server
app.listen(8888, () => {
  console.log('Server running on port 8888');
});