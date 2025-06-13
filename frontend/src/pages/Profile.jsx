import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import UserProfile from '../components/UserProfile';

const Profile = () => {
  const { user, updateProfile, logout } = useContext(AuthContext);
  const [showProfileModal, setShowProfileModal] = useState(false);

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Your Profile</h1>
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-avatar">
            <img src={user?.avatar || '/default-avatar.png'} alt="Profile" />
          </div>
          <div className="profile-details">
            <h2>{user?.username}</h2>
            <p>{user?.email}</p>
            <p className="provider-badge">
              Signed in with {user?.provider || 'email'}
            </p>
          </div>
          <div className="profile-actions">
            <button 
              className="btn btn-primary"
              onClick={() => setShowProfileModal(true)}
            >
              Edit Profile
            </button>
            <button 
              className="btn btn-secondary"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </div>

        <div className="profile-stats">
          <div className="stat-card">
            <h3>Notes Created</h3>
            <p>{user?.noteCount || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Favorites</h3>
            <p>{user?.favoriteCount || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Notes Shared</h3>
            <p>{user?.sharedCount || 0}</p>
          </div>
        </div>
      </div>

      {showProfileModal && (
        <UserProfile 
          onClose={() => setShowProfileModal(false)}
        />
      )}
    </div>
  );
};

export default Profile;