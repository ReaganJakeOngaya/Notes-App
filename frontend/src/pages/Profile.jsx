import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNotes } from '../context/NotesContext';
import UserProfile from '../components/UserProfile';
import { API_URL } from '../services/api';
import { ArrowLeft, Edit3, LogOut, Star, FileText, Share2, User, Mail, Sparkles, Camera } from 'lucide-react';

const Profile = () => {
  const { user, logout } = useAuth();
  const { notes } = useNotes();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [stats, setStats] = useState({
    totalNotes: 0,
    favoriteNotes: 0,
    sharedNotes: 0,
    categoryCounts: {},
    recentActivity: []
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (notes && notes.length > 0) {
      const favoriteCount = notes.filter(note => note.isFavorite).length;
      const sharedCount = notes.filter(note => note.shared).length;
      const categoryCount = notes.reduce((acc, note) => {
        acc[note.category] = (acc[note.category] || 0) + 1;
        return acc;
      }, {});
      
      setStats({
        totalNotes: notes.length,
        favoriteNotes: favoriteCount,
        sharedNotes: sharedCount,
        categoryCounts: categoryCount,
        recentActivity: notes
          .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
          .slice(0, 5)
          .map(note => ({
            id: note.id,
            title: note.title,
            modified: note.updatedAt || note.createdAt
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getProviderIcon = (provider) => {
    switch (provider) {
      case 'google':
        return '🔐';
      case 'apple':
        return '🍎';
      case 'github':
        return '⚡';
      default:
        return '📧';
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000000',
      color: '#FFFFFF',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Elements */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `linear-gradient(rgba(0, 102, 255, 0.05) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(0, 102, 255, 0.05) 1px, transparent 1px)`,
        backgroundSize: '50px 50px',
        opacity: 0.3
      }} />

      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          position: 'absolute',
          top: '10%',
          right: '10%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(0, 102, 255, 0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none'
        }}
      />

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          padding: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          position: 'relative',
          zIndex: 10
        }}
      >
        <motion.button
          whileHover={{ scale: 1.05, background: 'rgba(255, 255, 255, 0.1)' }}
          whileTap={{ scale: 0.95 }}
          onClick={handleBackToHome}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '0.75rem',
            color: '#FFFFFF',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          aria-label="Back to home"
        >
          <ArrowLeft size={20} />
        </motion.button>

        <motion.h1
          style={{
            fontSize: '2.5rem',
            fontWeight: 900,
            background: 'linear-gradient(90deg, #FFFFFF, #0066FF)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: 0
          }}
        >
          Your Profile
        </motion.h1>
      </motion.header>

      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{
          padding: '0 2rem 2rem',
          position: 'relative',
          zIndex: 10
        }}
      >
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 400px',
          gap: '2rem',
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          {/* Left Column - Profile Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                padding: '2rem',
                display: 'flex',
                gap: '2rem',
                alignItems: 'flex-start'
              }}
            >
              {/* Avatar Section */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                style={{
                  position: 'relative',
                  cursor: 'pointer'
                }}
                onClick={() => setShowProfileModal(true)}
              >
                <div style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, #0066FF, #00CCFF)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  border: '3px solid rgba(255, 255, 255, 0.1)'
                }}>
                  {getAvatarUrl() ? (
                    <img 
                      src={getAvatarUrl()} 
                      alt={`${user?.username} avatar`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div style={{
                    display: getAvatarUrl() ? 'none' : 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(135deg, #0066FF, #00CCFF)',
                    color: '#FFFFFF',
                    fontSize: '2rem',
                    fontWeight: 'bold'
                  }}>
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                </div>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  style={{
                    position: 'absolute',
                    bottom: '8px',
                    right: '8px',
                    background: '#0066FF',
                    borderRadius: '50%',
                    padding: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Camera size={16} color="#FFFFFF" />
                </motion.div>
              </motion.div>

              {/* Profile Details */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <motion.h2
                    style={{
                      fontSize: '2rem',
                      fontWeight: 700,
                      margin: 0,
                      background: 'linear-gradient(90deg, #FFFFFF, #0066FF)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}
                  >
                    {user?.username || 'User'}
                  </motion.h2>
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    style={{
                      padding: '0.25rem 0.75rem',
                      background: 'rgba(0, 102, 255, 0.2)',
                      border: '1px solid rgba(0, 102, 255, 0.3)',
                      borderRadius: '50px',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    {getProviderIcon(user?.provider)}
                    Signed in with {user?.provider || 'email'}
                  </motion.span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                  <Mail size={20} />
                  <span>{user?.email}</span>
                </div>

                {user?.bio ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '1rem',
                      marginTop: '1rem'
                    }}
                  >
                    <div style={{ fontSize: '0.95rem', lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: user.bio }} />
                  </motion.div>
                ) : (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                      color: 'rgba(255, 255, 255, 0.5)',
                      fontStyle: 'italic',
                      marginTop: '1rem'
                    }}
                  >
                    No bio added yet. Click edit profile to add one.
                  </motion.p>
                )}

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowProfileModal(true)}
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: '#0066FF',
                      border: 'none',
                      borderRadius: '12px',
                      color: '#FFFFFF',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      boxShadow: '0 4px 20px rgba(0, 102, 255, 0.3)'
                    }}
                  >
                    <Edit3 size={20} />
                    Edit Profile
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05, background: 'rgba(255, 59, 59, 0.2)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={logout}
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: 'rgba(255, 59, 59, 0.1)',
                      border: '1px solid rgba(255, 59, 59, 0.3)',
                      borderRadius: '12px',
                      color: '#FF6B6B',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.95rem',
                      fontWeight: 600
                    }}
                  >
                    <LogOut size={20} />
                    Logout
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                padding: '2rem'
              }}
            >
              <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={24} color="#0066FF" />
                Recent Activity
              </h3>
              
              {stats.recentActivity.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {stats.recentActivity.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '1rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        cursor: 'pointer'
                      }}
                      whileHover={{ scale: 1.02, background: 'rgba(255, 255, 255, 0.1)' }}
                    >
                      <FileText size={20} color="#0066FF" />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 500 }}>{activity.title}</div>
                        <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                          Modified {formatDate(activity.modified)}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ color: 'rgba(255, 255, 255, 0.5)', textAlign: 'center', padding: '2rem' }}
                >
                  No recent activity
                </motion.p>
              )}
            </motion.div>
          </div>

          {/* Right Column - Stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                padding: '2rem'
              }}
            >
              <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={24} color="#0066FF" />
                Your Stats
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Total Notes */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1.5rem',
                    background: 'rgba(0, 102, 255, 0.1)',
                    border: '1px solid rgba(0, 102, 255, 0.2)',
                    borderRadius: '16px',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{
                    width: '50px',
                    height: '50px',
                    background: 'linear-gradient(135deg, #0066FF, #00CCFF)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <FileText size={24} color="#FFFFFF" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)' }}>Total Notes</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats.totalNotes}</div>
                  </div>
                </motion.div>

                {/* Favorite Notes */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1.5rem',
                    background: 'rgba(255, 193, 7, 0.1)',
                    border: '1px solid rgba(255, 193, 7, 0.2)',
                    borderRadius: '16px',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{
                    width: '50px',
                    height: '50px',
                    background: 'linear-gradient(135deg, #FFC107, #FF9800)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Star size={24} color="#FFFFFF" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)' }}>Favorites</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats.favoriteNotes}</div>
                  </div>
                </motion.div>

                {/* Shared Notes */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1.5rem',
                    background: 'rgba(76, 175, 80, 0.1)',
                    border: '1px solid rgba(76, 175, 80, 0.2)',
                    borderRadius: '16px',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{
                    width: '50px',
                    height: '50px',
                    background: 'linear-gradient(135deg, #4CAF50, #8BC34A)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Share2 size={24} color="#FFFFFF" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)' }}>Shared</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats.sharedNotes}</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Category Distribution */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                padding: '2rem'
              }}
            >
              <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>Categories</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {Object.entries(stats.categoryCounts).map(([category, count]) => (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.75rem 1rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px'
                    }}
                    whileHover={{ scale: 1.02, background: 'rgba(255, 255, 255, 0.1)' }}
                  >
                    <span style={{ textTransform: 'capitalize', fontWeight: 500 }}>{category}</span>
                    <span style={{ 
                      background: 'rgba(0, 102, 255, 0.2)', 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '20px',
                      fontSize: '0.875rem',
                      fontWeight: 600
                    }}>
                      {count}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.main>

      {/* Profile Modal */}
      <AnimatePresence>
        {showProfileModal && (
          <UserProfile 
            onClose={() => setShowProfileModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;