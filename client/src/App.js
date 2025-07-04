import React, { useState, useEffect } from "react";
import axios from "axios";
import WorldMap from "./components/WorldMap";
import TopTracks from "./components/TopTracks";
import RegionalChart from "./components/RegionalChart";
import UserProfile from "./components/UserProfile";
import "./App.css";

function App() {
  const [accessToken, setAccessToken] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [topTracks, setTopTracks] = useState([]);
  const [regionalData, setRegionalData] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const SERVER_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:8888";

  useEffect(() => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get("access_token");
    if (token) {
      setAccessToken(token);
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
      fetchUserData(token);
    }
  }, []);

  const fetchUserData = async (token) => {
    setLoading(true);
    try {
      // Fetch user profile
      const profileResponse = await axios.get(`${SERVER_URL}/user-profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserProfile(profileResponse.data);

      // Fetch top tracks from the year
      const tracksResponse = await axios.get(`${SERVER_URL}/top-tracks-year`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTopTracks(tracksResponse.data);
    } catch (err) {
      console.error("Failed to fetch user data:", err);
      setError("Failed to load your Spotify data. Please try logging in again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCountrySelect = async (country) => {
    setSelectedCountry(country);
    setLoading(true);
    try {
      const response = await axios.get(`${SERVER_URL}/regional-charts/${encodeURIComponent(country)}`);
      setRegionalData(response.data);
    } catch (err) {
      console.error("Failed to fetch regional data:", err);
      setError(`Failed to load data for ${country}`);
    } finally {
      setLoading(false);
    }
  };

  if (!accessToken) {
    return (
      <div className="app">
        <div className="login-container">
          <div className="login-card">
            <h1>🎧 Spotify Global Music Explorer</h1>
            <p>Discover your top tracks from this year and explore music around the world</p>
            <a href={`${SERVER_URL}/login`}>
              <button className="login-button">Login with Spotify</button>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎧 Spotify Global Music Explorer</h1>
        {userProfile && <UserProfile user={userProfile} />}
      </header>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      <main className="app-main">
        <div className="content-grid">
          <section className="tracks-section">
            <h2>Your Top 50 Tracks This Year</h2>
            {loading && !topTracks.length ? (
              <div className="loading">Loading your music...</div>
            ) : (
              <TopTracks tracks={topTracks} />
            )}
          </section>

          <section className="map-section">
            <h2>Explore Music Around the World</h2>
            <p>Click on any location to see popular music in that region</p>
            <WorldMap onCountrySelect={handleCountrySelect} />
            
            {selectedCountry && (
              <div className="selected-region">
                <h3>Popular in {selectedCountry}</h3>
                {loading ? (
                  <div className="loading">Loading regional data...</div>
                ) : regionalData ? (
                  <RegionalChart data={regionalData} />
                ) : (
                  <p>Click on a country to see popular music there</p>
                )}
              </div>
            )}
          </section>
        </div>
      </main>

      <footer className="app-footer">
        <p>Data provided by Spotify Web API</p>
      </footer>
    </div>
  );
}

export default App;