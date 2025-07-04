import React from 'react';

function TopTracks({ tracks }) {
  if (!tracks || tracks.length === 0) {
    return (
      <div className="no-tracks">
        <p>No tracks found. Make sure you have listened to music on Spotify!</p>
      </div>
    );
  }

  return (
    <div className="top-tracks">
      <div className="tracks-list">
        {tracks.map((track, index) => (
          <div key={track.id} className="track-item">
            <div className="track-number">{index + 1}</div>
            <div className="track-info">
              {track.album?.images?.[2] && (
                <img 
                  src={track.album.images[2].url} 
                  alt={track.album.name}
                  className="track-image"
                />
              )}
              <div className="track-details">
                <h3 className="track-name">{track.name}</h3>
                <p className="track-artists">
                  {track.artists.map(artist => artist.name).join(', ')}
                </p>
                <p className="track-album">{track.album?.name}</p>
                {track.popularity && (
                  <div className="popularity-bar">
                    <div 
                      className="popularity-fill" 
                      style={{ width: `${track.popularity}%` }}
                    ></div>
                    <span className="popularity-text">{track.popularity}% popularity</span>
                  </div>
                )}
              </div>
            </div>
            {track.preview_url && (
              <audio controls className="track-preview">
                <source src={track.preview_url} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TopTracks;
