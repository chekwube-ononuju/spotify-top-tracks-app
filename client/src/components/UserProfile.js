import React from 'react';

function UserProfile({ user }) {
  return (
    <div className="user-profile">
      <div className="profile-info">
        {user.images && user.images[0] && (
          <img 
            src={user.images[0].url} 
            alt={user.display_name}
            className="profile-image"
          />
        )}
        <div className="profile-details">
          <h2 className="profile-name">Welcome, {user.display_name}!</h2>
          <div className="profile-stats">
            <span className="stat">
              👥 {user.followers?.total || 0} followers
            </span>
            {user.country && (
              <span className="stat">
                🌍 {user.country}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
