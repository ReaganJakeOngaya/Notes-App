import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { NotesContext } from '../context/NotesContext';
import { ArrowLeft, Share2, User, Calendar, FileText, Sparkles, Users, Clock } from 'lucide-react';
import { formatDate } from '../utils/dateUtils';

const getCategoryIcon = (category) => {
  const icons = {
    personal: 'fas fa-user',
    work: 'fas fa-briefcase',
    ideas: 'fas fa-lightbulb',
    favorites: 'fas fa-star',
    default: 'fas fa-file-alt'
  };
  return <i className={icons[category] || icons.default}></i>;
};

const getCategoryColor = (category) => {
  const colors = {
    personal: '#00CCFF',
    work: '#0066FF',
    ideas: '#FF6B6B',
    favorites: '#FFD700',
    default: '#0066FF'
  };
  return colors[category] || colors.default;
};

const SharedNotes = () => {
  const { sharedNotes, markNoteAsRead } = useContext(NotesContext);
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/home');
  };

  const handleNoteClick = (noteId) => {
    markNoteAsRead(noteId);
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
          top: '20%',
          right: '5%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(0, 102, 255, 0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none'
        }}
      />

      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          padding: '2rem',
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          position: 'relative'
        }}
      >
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '2rem'
        }}>
          {/* Back Button and Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flex: 1 }}>
            <motion.button
              whileHover={{ scale: 1.05, background: 'rgba(0, 102, 255, 0.2)' }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBackToHome}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1.5rem',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color: '#FFFFFF',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: 500,
                transition: 'all 0.3s ease'
              }}
            >
              <ArrowLeft size={20} />
              Back to Notes
            </motion.button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                style={{
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(135deg, #0066FF, #00CCFF)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Share2 size={24} color="#FFFFFF" />
              </motion.div>
              
              <div>
                <motion.h1
                  style={{
                    fontSize: '2.5rem',
                    fontWeight: 900,
                    background: 'linear-gradient(90deg, #FFFFFF, #0066FF)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    margin: 0,
                    lineHeight: 1.2
                  }}
                >
                  Shared with Me
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    margin: 0,
                    fontSize: '1rem'
                  }}
                >
                  Notes shared by your collaborators
                </motion.p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              style={{
                padding: '1rem 1.5rem',
                background: 'rgba(0, 102, 255, 0.1)',
                border: '1px solid rgba(0, 102, 255, 0.3)',
                borderRadius: '12px',
                textAlign: 'center'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <FileText size={20} color="#0066FF" />
                <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#FFFFFF' }}>
                  {sharedNotes.length}
                </span>
              </div>
              <span style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                {sharedNotes.length === 1 ? 'note' : 'notes'}
              </span>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              style={{
                padding: '1rem 1.5rem',
                background: 'rgba(255, 107, 107, 0.1)',
                border: '1px solid rgba(255, 107, 107, 0.3)',
                borderRadius: '12px',
                textAlign: 'center'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <Clock size={20} color="#FF6B6B" />
                <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#FFFFFF' }}>
                  {sharedNotes.filter(note => !note.read).length}
                </span>
              </div>
              <span style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                unread
              </span>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Content Area */}
      <div style={{
        padding: '2rem',
        maxWidth: '1200px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 10
      }}>
        <AnimatePresence mode="wait">
          {sharedNotes.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '6rem 2rem',
                textAlign: 'center'
              }}
            >
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  width: '120px',
                  height: '120px',
                  background: 'rgba(0, 102, 255, 0.1)',
                  border: '2px solid rgba(0, 102, 255, 0.3)',
                  borderRadius: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '2rem'
                }}
              >
                <Share2 size={48} color="#0066FF" />
              </motion.div>
              
              <motion.h3 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                style={{ 
                  fontSize: '2rem', 
                  fontWeight: 700, 
                  marginBottom: '1rem',
                  background: 'linear-gradient(90deg, #FFFFFF, #0066FF)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                No shared notes yet
              </motion.h3>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{ 
                  color: 'rgba(255, 255, 255, 0.7)', 
                  marginBottom: '2rem',
                  fontSize: '1.125rem',
                  lineHeight: 1.6
                }}
              >
                Notes that others share with you will appear here.
                <br />
                Start collaborating to see shared content!
              </motion.p>
              
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBackToHome}
                style={{
                  padding: '1rem 2rem',
                  background: '#0066FF',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  fontSize: '1rem',
                  fontWeight: 600,
                  boxShadow: '0 4px 20px rgba(0, 102, 255, 0.3)'
                }}
              >
                <Sparkles size={20} />
                Go to My Notes
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="notes"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
                gap: '1.5rem'
              }}
            >
              {sharedNotes.map((note, index) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5, transition: { type: "spring", stiffness: 300 } }}
                  onClick={() => handleNoteClick(note.id)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${!note.read ? 'rgba(0, 102, 255, 0.5)' : 'rgba(255, 255, 255, 0.1)'}`,
                    borderRadius: '16px',
                    padding: '1.5rem',
                    cursor: 'pointer',
                    position: 'relative',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease',
                    overflow: 'hidden'
                  }}
                >
                  {/* Unread Indicator */}
                  {!note.read && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        width: '8px',
                        height: '8px',
                        background: '#0066FF',
                        borderRadius: '50%',
                        boxShadow: '0 0 10px rgba(0, 102, 255, 0.5)'
                      }}
                    />
                  )}

                  {/* Shared Indicator */}
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    left: '1rem',
                    width: '32px',
                    height: '32px',
                    background: 'rgba(0, 102, 255, 0.2)',
                    border: '1px solid rgba(0, 102, 255, 0.3)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Share2 size={16} color="#0066FF" />
                  </div>

                  {/* Note Header */}
                  <div style={{ marginBottom: '1rem', paddingLeft: '2.5rem' }}>
                    <h3 style={{
                      fontSize: '1.25rem',
                      fontWeight: 600,
                      color: '#FFFFFF',
                      margin: '0 0 0.5rem 0',
                      lineHeight: 1.4
                    }}>
                      {note.title}
                    </h3>
                    
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontSize: '0.875rem'
                    }}>
                      <User size={14} />
                      <span>Shared by: {note.author || 'Unknown'}</span>
                    </div>
                  </div>

                  {/* Note Content Preview */}
                  <div style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '0.95rem',
                    lineHeight: 1.5,
                    marginBottom: '1rem',
                    maxHeight: '80px',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {note.content.replace(/<[^>]*>/g, '').substring(0, 150)}
                    {note.content.length > 150 ? '...' : ''}
                  </div>

                  {/* Note Footer */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    flexWrap: 'wrap'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      flexWrap: 'wrap'
                    }}>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        background: `rgba(${getCategoryColor(note.category).replace('#', '')}, 0.1)`,
                        border: `1px solid ${getCategoryColor(note.category)}`,
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        color: getCategoryColor(note.category),
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}>
                        {getCategoryIcon(note.category)}
                        {note.category}
                      </span>
                      
                      <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontSize: '0.75rem'
                      }}>
                        <Calendar size={12} />
                        Shared: {formatDate(note.shared_at || note.modified_at)}
                      </span>
                    </div>
                  </div>

                  {/* Hover Overlay */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, rgba(0, 102, 255, 0.1), transparent)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                    pointerEvents: 'none'
                  }} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SharedNotes;