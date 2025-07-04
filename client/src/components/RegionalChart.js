import React from 'react';

function RegionalChart({ data }) {
  if (!data || !data.tracks || data.tracks.length === 0) {
    return (
      <div className="regional-chart">
        <p className="no-data">{data?.message || 'No regional data available'}</p>
      </div>
    );
  }

  return (
    <div className="regional-chart">
      <div className="chart-header">
        <h4>From playlist: {data.playlistName}</h4>
        <p className="chart-description">
          Popular tracks currently trending in {data.country}
        </p>
      </div>
      
      <div className="regional-tracks">
        {data.tracks.slice(0, 5).map((track, index) => (
          <div key={track.id || index} className="regional-track-item">
            <div className="track-ranking">{index + 1}</div>
            <div className="track-content">
              <div className="track-main-info">
                <h4 className="track-title">{track.name}</h4>
                <p className="track-artist">
                  {track.artists.map(artist => artist.name).join(', ')}
                </p>
              </div>
              <div className="track-meta">
                <span className="track-album">{track.album?.name}</span>
                {track.popularity && (
                  <span className="track-popularity">
                    🔥 {track.popularity}% popular
                  </span>
                )}
              </div>
              {track.preview_url && (
                <audio controls className="regional-track-preview">
                  <source src={track.preview_url} type="audio/mpeg" />
                  Preview not available
                </audio>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="chart-footer">
        <p>Data sourced from Spotify's featured playlists for {data.country}</p>
      </div>
    </div>
  );
}

export default RegionalChart;
