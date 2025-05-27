import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [accessToken, setAccessToken] = useState(null);
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get("access_token");
    if (token) {
      setAccessToken(token);
      getTopTracks(token);
    }
  }, []);

  const getTopTracks = async (token) => {
    try {
      const response = await axios.get("https://localhost:8888/top-tracks", {
        headers: { 
          Authorization: `Bearer ${token}` // Fixed authorization header
        },
      });
      setTracks(response.data.items);
    } catch (err) {
      console.error("Failed to fetch top tracks:", err);
      // Consider adding error state handling here
    }
  };

  return (
    <div className="App">
      <h1>🎧 Your Spotify Top Tracks</h1>
      {!accessToken ? (
        <a href="https://localhost:8888/login">
          <button>Login with Spotify</button>
        </a>
      ) : (
        <ul>
          {tracks.map((track, idx) => (
            <li key={track.id}>
              {idx + 1}. {track.name} by{" "}
              {track.artists.map((a) => a.name).join(", ")}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;