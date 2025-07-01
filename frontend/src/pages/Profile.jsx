import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserProfile from '../components/UserProfile';
import { API_URL } from '../services/api';

const Profile = () => {
  const { user, logout } = useAuth();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/home');
  };

  const getAvatarUrl = () => {
    if (!user?.avatar) return '';
    if (user.avatar.startsWith('http')) return user.avatar;
    return `${API_URL}${user.avatar.startsWith('/') ? '' : '/'}${user.avatar}`;
  };

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading user data...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex items-center mb-6">
          <button 
            className="p-2 mr-4 text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-full backdrop-blur-sm transition-all"
            onClick={handleBackToHome}
            title="Back to Home"
            aria-label="Back to home"
          >
            <i className="fas fa-arrow-left"></i>
          </button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Your Profile</h1>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-sm overflow-hidden mb-6 border border-white/30 dark:border-gray-700/50">
          <div className="p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="relative group">
                <img 
                  src={getAvatarUrl() || '/default-avatar.png'} 
                  alt={`${user.username}'s avatar`}
                  className="w-32 h-32 rounded-full object-cover border-4 border-indigo-100/80 dark:border-indigo-900/80 backdrop-blur-sm"
                  onError={(e) => {
                    e.target.src = '/default-avatar.png';
                    e.target.onerror = null;
                  }}
                />
                {user.avatar && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                    <i className="fas fa-camera text-white text-xl"></i>
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                  <i className="fas fa-user mr-2 text-indigo-600 dark:text-indigo-400"></i>
                  {user.username}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-2">
                  <i className="fas fa-envelope mr-2 text-indigo-600 dark:text-indigo-400"></i>
                  {user.email}
                </p>
                <p className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-white/50 dark:bg-gray-700/50 text-gray-800 dark:text-gray-300 mb-4 backdrop-blur-sm">
                  <i className={`fab fa-${user.provider === 'google' ? 'google' : 'apple'} mr-2`}></i>
                  Signed in with {user.provider || 'email'}
                </p>
                {user.bio ? (
                  <div className="prose dark:prose-invert max-w-none bg-white/50 dark:bg-gray-700/50 p-4 rounded-lg backdrop-blur-sm">
                    <div dangerouslySetInnerHTML={{ __html: user.bio }} />
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 italic bg-white/50 dark:bg-gray-700/50 p-3 rounded-lg backdrop-blur-sm">
                    <i className="fas fa-info-circle mr-2"></i>
                    No bio added yet
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-6">
              <button 
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg flex items-center shadow-lg hover:shadow-xl transition-all backdrop-blur-sm"
                onClick={() => setShowProfileModal(true)}
              >
                <i className="fas fa-edit mr-2"></i>
                Edit Profile
              </button>
              <button 
                className="px-4 py-2 bg-white/80 hover:bg-white dark:bg-gray-700/80 dark:hover:bg-gray-600/80 text-gray-800 dark:text-white rounded-lg flex items-center shadow-sm hover:shadow transition-all backdrop-blur-sm"
                onClick={logout}
              >
                <i className="fas fa-sign-out-alt mr-2"></i>
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-sm p-6 text-center border border-white/30 dark:border-gray-700/50">
            <div className="w-16 h-16 bg-indigo-100/80 dark:bg-indigo-900/80 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <i className="fas fa-sticky-note text-indigo-600 dark:text-indigo-300 text-2xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Notes Created</h3>
            <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{user.noteCount || 0}</p>
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-sm p-6 text-center border border-white/30 dark:border-gray-700/50">
            <div className="w-16 h-16 bg-pink-100/80 dark:bg-pink-900/80 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <i className="fas fa-heart text-pink-600 dark:text-pink-300 text-2xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Favorites</h3>
            <p className="text-3xl font-bold text-pink-600 dark:text-pink-400">{user.favoriteCount || 0}</p>
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-sm p-6 text-center border border-white/30 dark:border-gray-700/50">
            <div className="w-16 h-16 bg-green-100/80 dark:bg-green-900/80 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <i className="fas fa-share-alt text-green-600 dark:text-green-300 text-2xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Notes Shared</h3>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{user.sharedCount || 0}</p>
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