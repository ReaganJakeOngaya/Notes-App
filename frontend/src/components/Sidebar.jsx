import React, { useContext, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NotesContext } from '../context/NotesContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../services/api';
import { 
  Search, 
  X, 
  Plus, 
  Inbox, 
  Star, 
  Briefcase, 
  User, 
  Lightbulb, 
  Share2, 
  Moon, 
  Sun,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';

const Sidebar = ({ isMobile, isOpen, onClose, onNewNote, onCollapseChange }) => {
  const { 
    currentFilter, 
    setCurrentFilter, 
    setSearchQuery,
    fetchSharedNotes,
    sharedNotes
  } = useContext(NotesContext);
  
  const { user, logout, theme, toggleTheme } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [hasUnreadSharedNotes, setHasUnreadSharedNotes] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(theme || 'dark');

  const categories = [
    { id: 'all', name: 'All Notes', icon: Inbox },
    { id: 'favorites', name: 'Favorites', icon: Star },
    { id: 'work', name: 'Work', icon: Briefcase },
    { id: 'personal', name: 'Personal', icon: User },
    { id: 'ideas', name: 'Ideas', icon: Lightbulb }
  ];

  useEffect(() => {
    const unreadNotes = sharedNotes.some(note => !note.read);
    setHasUnreadSharedNotes(unreadNotes);
  }, [sharedNotes]);

  useEffect(() => {
    if (theme) {
      setCurrentTheme(theme);
    }
  }, [theme]);

  // Notify parent component about collapse state changes
  useEffect(() => {
    if (onCollapseChange) {
      onCollapseChange(isCollapsed);
    }
  }, [isCollapsed, onCollapseChange]);

  const getAvatarUrl = () => {
    if (!user?.avatar) return '';
    if (user.avatar.startsWith('http')) return user.avatar;
    return `${API_URL}${user.avatar.startsWith('/') ? '' : '/'}${user.avatar}`;
  };

  const handleSearch = useCallback((e) => {
    const value = e.target.value;
    setSearchValue(value);
    setSearchQuery(value);
  }, [setSearchQuery]);

  const handleClearSearch = useCallback(() => {
    setSearchValue('');
    setSearchQuery('');
  }, [setSearchQuery]);

  const handleFilter = useCallback((category) => {
    setCurrentFilter(category);
    if (isMobile) onClose();
  }, [isMobile, setCurrentFilter, onClose]);

  const handleSharedNotesClick = useCallback(() => {
    fetchSharedNotes();
    navigate('/shared');
    if (isMobile) onClose();
  }, [fetchSharedNotes, navigate, isMobile, onClose]);

  const handleKeyDown = useCallback((e, action) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  }, []);

  const handleProfileClick = useCallback(() => {
    navigate('/profile');
    if (isMobile) onClose();
  }, [navigate, isMobile, onClose]);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/login');
  }, [logout, navigate]);

  // Safe theme toggle function
  const handleThemeToggle = useCallback(() => {
    if (toggleTheme) {
      toggleTheme();
    } else {
      // Fallback if toggleTheme is not provided in context
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setCurrentTheme(newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
    }
  }, [toggleTheme, currentTheme]);

  const toggleCollapse = useCallback(() => {
    setIsCollapsed(!isCollapsed);
  }, [isCollapsed]);

  const sidebarWidth = isCollapsed ? 80 : 280;
  const showExpanded = isCollapsed && isHovered;

  return (
    <>
      <motion.aside 
        className={`sidebar ${isMobile ? 'mobile' : ''} ${isOpen ? 'open' : ''}`}
        role="navigation"
        aria-label="Main navigation"
        initial={false}
        animate={{ 
          width: isMobile ? (isOpen ? 280 : 0) : (showExpanded ? 280 : sidebarWidth)
        }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        style={{
          position: isMobile ? 'fixed' : 'relative',
          height: '100vh',
          background: 'rgba(0, 0, 0, 0.9)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
          zIndex: 1000,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Sidebar Header */}
        <div style={{ 
          padding: isCollapsed && !showExpanded ? '1.5rem 0.5rem' : '1.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          position: 'relative'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: isCollapsed && !showExpanded ? 'center' : 'space-between',
            gap: '0.75rem'
          }}>
            {(!isCollapsed || showExpanded) && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem',
                  flex: 1
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  background: 'linear-gradient(135deg, #0066FF, #00CCFF)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Sparkles size={16} color="#FFFFFF" />
                </div>
                <span style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  background: 'linear-gradient(90deg, #FFFFFF, #0066FF)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  NoteFlow
                </span>
              </motion.div>
            )}
            
            {isCollapsed && !showExpanded && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  width: '32px',
                  height: '32px',
                  background: 'linear-gradient(135deg, #0066FF, #00CCFF)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Sparkles size={16} color="#FFFFFF" />
              </motion.div>
            )}

            {/* Collapse Toggle Button - Only show on desktop */}
            {!isMobile && (
              <motion.button
                whileHover={{ scale: 1.1, background: 'rgba(255, 255, 255, 0.1)' }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleCollapse}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '0.5rem',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
              </motion.button>
            )}
          </div>

          {/* New Note Button */}
          {(!isCollapsed || showExpanded) && (
            <motion.button 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onNewNote}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: '#0066FF',
                border: 'none',
                borderRadius: '12px',
                color: '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                fontSize: '0.95rem',
                fontWeight: 600,
                marginTop: '1rem',
                boxShadow: '0 4px 20px rgba(0, 102, 255, 0.3)'
              }}
              aria-label="Create new note"
            >
              <Plus size={20} />
              <span>New Note</span>
            </motion.button>
          )}

          {isCollapsed && !showExpanded && (
            <motion.button 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onNewNote}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: '#0066FF',
                border: 'none',
                borderRadius: '12px',
                color: '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '1rem',
                boxShadow: '0 4px 20px rgba(0, 102, 255, 0.3)'
              }}
              aria-label="Create new note"
            >
              <Plus size={20} />
            </motion.button>
          )}
        </div>

        {/* Search Section */}
        <div style={{ padding: isCollapsed && !showExpanded ? '1rem 0.5rem' : '1rem' }}>
          {(!isCollapsed || showExpanded) ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                position: 'relative',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                overflow: 'hidden'
              }}
            >
              <Search 
                size={20} 
                color="rgba(255, 255, 255, 0.5)" 
                style={{ 
                  position: 'absolute', 
                  left: '12px', 
                  top: '50%', 
                  transform: 'translateY(-50%)' 
                }} 
              />
              <input 
                type="text" 
                placeholder="Search notes..." 
                value={searchValue}
                onChange={handleSearch}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#FFFFFF',
                  padding: '0.75rem 1rem 0.75rem 2.5rem',
                  width: '100%',
                  fontSize: '0.95rem',
                  outline: 'none'
                }}
                aria-label="Search notes"
              />
              {searchValue && (
                <motion.button 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={handleClearSearch}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255, 255, 255, 0.5)',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                  aria-label="Clear search"
                >
                  <X size={16} />
                </motion.button>
              )}
            </motion.div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.1, background: 'rgba(255, 255, 255, 0.1)' }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {/* Focus search when expanded */}}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color: 'rgba(255, 255, 255, 0.5)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              aria-label="Search notes"
            >
              <Search size={20} />
            </motion.button>
          )}
        </div>

        {/* Categories */}
        <div style={{ 
          flex: 1, 
          padding: isCollapsed && !showExpanded ? '0 0.5rem' : '0 1rem',
          overflowY: 'auto'
        }}>
          {(!isCollapsed || showExpanded) && (
            <motion.h3 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'rgba(255, 255, 255, 0.5)',
                marginBottom: '1rem',
                padding: '0 0.5rem'
              }}
            >
              Categories
            </motion.h3>
          )}
          
          <div role="list" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {categories.map(category => {
              const Icon = category.icon;
              return (
                <motion.div 
                  key={category.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.02, background: 'rgba(255, 255, 255, 0.1)' }}
                  className={`category-item ${currentFilter === category.id ? 'active' : ''}`}
                  onClick={() => handleFilter(category.id)}
                  onKeyDown={(e) => handleKeyDown(e, () => handleFilter(category.id))}
                  role="listitem button"
                  tabIndex={0}
                  aria-label={`Filter by ${category.name}`}
                  aria-current={currentFilter === category.id ? 'page' : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: isCollapsed && !showExpanded ? '0.75rem' : '0.75rem 1rem',
                    background: currentFilter === category.id ? 'rgba(0, 102, 255, 0.2)' : 'transparent',
                    border: currentFilter === category.id ? '1px solid rgba(0, 102, 255, 0.3)' : '1px solid transparent',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}
                >
                  <Icon 
                    size={20} 
                    color={currentFilter === category.id ? '#0066FF' : 'rgba(255, 255, 255, 0.7)'} 
                  />
                  {(!isCollapsed || showExpanded) && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{
                        fontSize: '0.95rem',
                        fontWeight: 500,
                        color: currentFilter === category.id ? '#FFFFFF' : 'rgba(255, 255, 255, 0.8)'
                      }}
                    >
                      {category.name}
                    </motion.span>
                  )}
                </motion.div>
              );
            })}

            {/* Shared Notes */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.02, background: 'rgba(255, 255, 255, 0.1)' }}
              onClick={handleSharedNotesClick}
              onKeyDown={(e) => handleKeyDown(e, handleSharedNotesClick)}
              role="listitem button"
              tabIndex={0}
              aria-label="View shared notes"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: isCollapsed && !showExpanded ? '0.75rem' : '0.75rem 1rem',
                background: 'transparent',
                border: '1px solid transparent',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
            >
              <Share2 size={20} color="rgba(255, 255, 255, 0.7)" />
              {(!isCollapsed || showExpanded) && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    color: 'rgba(255, 255, 255, 0.8)'
                  }}
                >
                  Shared with me
                </motion.span>
              )}
              {hasUnreadSharedNotes && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{
                    position: isCollapsed && !showExpanded ? 'absolute' : 'static',
                    top: isCollapsed && !showExpanded ? '8px' : 'auto',
                    right: isCollapsed && !showExpanded ? '8px' : 'auto',
                    width: '8px',
                    height: '8px',
                    background: '#FF6B6B',
                    borderRadius: '50%',
                    marginLeft: isCollapsed && !showExpanded ? 0 : 'auto'
                  }}
                  aria-label="Unread shared notes"
                />
              )}
            </motion.div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div style={{ 
          padding: isCollapsed && !showExpanded ? '1rem 0.5rem' : '1rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          {/* User Profile */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="user-profile" 
            onClick={handleProfileClick}
            onKeyDown={(e) => handleKeyDown(e, handleProfileClick)}
            role="button"
            tabIndex={0}
            aria-label="Go to profile"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              cursor: 'pointer',
              marginBottom: '0.75rem'
            }}
          >
            <img 
              src={getAvatarUrl() || '/default-avatar.png'}
              alt={`${user?.username || 'User'} avatar`}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                objectFit: 'cover'
              }}
              onError={(e) => {
                e.target.src = '/default-avatar.png';
                e.target.onerror = null;
              }}
            />
            {(!isCollapsed || showExpanded) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="user-info"
                style={{ flex: 1, minWidth: 0 }}
              >
                <div style={{
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {user?.username || 'User'}
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: 'rgba(255, 255, 255, 0.6)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {user?.email}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Theme Toggle and Logout */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <motion.button
              whileHover={{ scale: 1.02, background: 'rgba(255, 255, 255, 0.1)' }}
              whileTap={{ scale: 0.98 }}
              onClick={handleThemeToggle}
              onKeyDown={(e) => handleKeyDown(e, handleThemeToggle)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: '#FFFFFF',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: 500
              }}
              aria-label="Toggle theme"
            >
              {currentTheme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              {(!isCollapsed || showExpanded) && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {currentTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </motion.span>
              )}
            </motion.button>

            <motion.button 
              whileHover={{ scale: 1.02, background: 'rgba(255, 59, 59, 0.2)' }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              onKeyDown={(e) => handleKeyDown(e, handleLogout)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem',
                background: 'rgba(255, 59, 59, 0.1)',
                border: '1px solid rgba(255, 59, 59, 0.3)',
                borderRadius: '8px',
                color: '#FF6B6B',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: 500
              }}
              aria-label="Logout"
            >
              <LogOut size={20} />
              {(!isCollapsed || showExpanded) && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  Logout
                </motion.span>
              )}
            </motion.button>
          </div>
        </div>
      </motion.aside>

      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <motion.div 
          className="sidebar-overlay" 
          onClick={onClose}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => handleKeyDown(e, onClose)}
          aria-label="Close sidebar"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 999
          }}
        />
      )}
    </>
  );
};

export default Sidebar;
