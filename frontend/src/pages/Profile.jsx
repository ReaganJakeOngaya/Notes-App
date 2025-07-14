import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNotes } from '../context/NotesContext';
import UserProfile from '../components/UserProfile';
import { API_URL } from '../services/api';
import '../css/Profile.css';

const Profile = () => {
  const { user, logout } = useAuth();
  const { notes } = useNotes();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [theme, setTheme] = useState('light');
  const [stats, setStats] = useState({
    totalNotes: 0,
    favoriteNotes: 0,
    categoryCounts: {},
    recentActivity: []
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (notes && notes.length > 0) {
      const favoriteCount = notes.filter(note => note.favorite).length;
      const categoryCount = notes.reduce((acc, note) => {
        acc[note.category] = (acc[note.category] || 0) + 1;
        return acc;
      }, {});
      
      setStats({
        totalNotes: notes.length,
        favoriteNotes: favoriteCount,
        categoryCounts: categoryCount,
        recentActivity: notes.slice(0, 5).map(note => ({
          id: note.id,
          title: note.title,
          modified: note.modified_at
        }))
      });
    }
  }, [notes]);

  const handleBackToHome = () => {
    navigate('/home');
  };

  const getAvatarUrl = () => {
    if (!user?.avatar) return '';
    if (user.avatar.startsWith('http')) return user.avatar;
    return `${API_URL}${user.avatar.startsWith('/') ? '' : '/'}${user.avatar}`;
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <button 
          className="back-btn"
          onClick={handleBackToHome}
          title="Back to Home"
        >
          <i className="fas fa-arrow-left"></i>
        </button>
        <h1>Your Profile</h1>
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-avatar">
            <img 
              src={getAvatarUrl()} 
              alt={`${user?.username} avatar`}
              onError={(e) => {
                e.target.src = ''; 
                e.target.onerror = null;
              }}
            />
            {user?.avatar && (
              <div className="avatar-overlay">
                <i className="fas fa-camera"></i>
              </div>
            )}
          </div>
          <div className="profile-details">
            <h2>
              <i className="fas fa-user"></i> {user?.username}
            </h2>
            <p>
              <i className="fas fa-envelope"></i> {user?.email}
            </p>
            <p className="provider-badge">
              <i className={`fab fa-${user?.provider === 'google' ? 'google' : 'apple'}`}></i>
              Signed in with {user?.provider || 'email'}
            </p>
            {user?.bio ? (
              <div className="profile-bio">
                <i className="fas fa-info-circle"></i>
                <div dangerouslySetInnerHTML={{ __html: user.bio }} />
              </div>
            ) : (
              <p className="empty-bio">
                <i className="fas fa-info-circle"></i> No bio added yet
              </p>
            )}
          </div>
          <div className="profile-actions">
            <button 
              className="btn btn-primary"
              onClick={() => setShowProfileModal(true)}
            >
              <i className="fas fa-edit"></i> Edit Profile
            </button>
            <button 
              className="btn btn-secondary"
              onClick={logout}
            >
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
        </div>

        <div className="profile-stats">
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-sticky-note"></i>
            </div>
            <h3>Notes Created</h3>
            <p>{user?.noteCount || 0}</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-heart"></i>
            </div>
            <h3>Favorites</h3>
            <p>{user?.favoriteCount || 0}</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-share-alt"></i>
            </div>
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