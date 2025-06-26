import React, { useContext, useState, useEffect, useCallback } from 'react';
import { NotesContext } from '../context/NotesContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../services/api';
import '../css/Sidebar.css';

const Sidebar = ({ isMobile, isOpen, onClose, onNewNote }) => {
  const { 
    currentFilter, 
    setCurrentFilter, 
    setSearchQuery,
    fetchSharedNotes,
    sharedNotes
  } = useContext(NotesContext);
  
  const { user, logout, toggleTheme } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [hasUnreadSharedNotes, setHasUnreadSharedNotes] = useState(false);

  const categories = [
    { id: 'all', name: 'All Notes', icon: 'fa-solid fa-inbox' },
    { id: 'favorites', name: 'Favorites', icon: 'fa-solid fa-star' },
    { id: 'work', name: 'Work', icon: 'fa-solid fa-briefcase' },
    { id: 'personal', name: 'Personal', icon: 'fa-solid fa-user' },
    { id: 'ideas', name: 'Ideas', icon: 'fa-solid fa-lightbulb' }
  ];

  useEffect(() => {
    // Check for unread shared notes
    const unreadNotes = sharedNotes.some(note => !note.read);
    setHasUnreadSharedNotes(unreadNotes);
  }, [sharedNotes]);

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

  const handleThemeToggle = useCallback(() => {
    toggleTheme();
  }, [toggleTheme]);

  return (
    <>
      <aside 
        className={`sidebar ${isMobile ? 'mobile' : ''} ${isOpen ? 'open' : ''}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="sidebar-header">
          <div className="logo">
            <i className="fa-solid fa-note-sticky" aria-hidden="true"></i>
            <span>NoteFlow</span>
          </div>
          <button 
            className="new-note-btn" 
            onClick={onNewNote}
            onKeyDown={(e) => handleKeyDown(e, onNewNote)}
            aria-label="Create new note"
          >
            <i className="fa-solid fa-plus" aria-hidden="true"></i>
            <span>New Note</span>
          </button>
        </div>
        
        <div className="search-section">
          <div className="search-box">
            <i className="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
            <input 
              type="text" 
              placeholder="Search notes..." 
              value={searchValue}
              onChange={handleSearch}
              aria-label="Search notes"
            />
            {searchValue && (
              <button 
                className="clear-search-btn"
                onClick={handleClearSearch}
                aria-label="Clear search"
              >
                <i className="fa-solid fa-times" aria-hidden="true"></i>
              </button>
            )}
          </div>
        </div>

        <div className="categories">
          <h3>Categories</h3>
          <div className="category-list" role="list">
            {categories.map(category => (
              <div 
                key={category.id}
                className={`category-item ${currentFilter === category.id ? 'active' : ''}`}
                onClick={() => handleFilter(category.id)}
                onKeyDown={(e) => handleKeyDown(e, () => handleFilter(category.id))}
                role="listitem button"
                tabIndex={0}
                aria-label={`Filter by ${category.name}`}
                aria-current={currentFilter === category.id ? 'page' : undefined}
              >
                <i className={category.icon} aria-hidden="true"></i>
                <span>{category.name}</span>
              </div>
            ))}
            <div 
              className="category-item"
              onClick={handleSharedNotesClick}
              onKeyDown={(e) => handleKeyDown(e, handleSharedNotesClick)}
              role="listitem button"
              tabIndex={0}
              aria-label="View shared notes"
            >
              <i className="fa-solid fa-share-nodes" aria-hidden="true"></i>
              <span>Shared with me</span>
              {hasUnreadSharedNotes && <span className="notification-dot"></span>}
            </div>
          </div>
        </div>

        <div className="sidebar-footer">
          <div 
            className="user-profile" 
            onClick={handleProfileClick}
            onKeyDown={(e) => handleKeyDown(e, handleProfileClick)}
            role="button"
            tabIndex={0}
            aria-label="Go to profile"
          >
            <img 
              src={getAvatarUrl() || '/default-avatar.png'}
              alt={`${user?.username || 'User'} avatar`}
              onError={(e) => {
                e.target.src = '/default-avatar.png';
                e.target.onerror = null;
              }}
            />
            <div className="user-info">
              <span className="username">{user?.username || 'User'}</span>
              <span className="email">{user?.email}</span>
            </div>
          </div>
          <div 
            className="theme-toggle"
            onClick={handleThemeToggle}
            onKeyDown={(e) => handleKeyDown(e, handleThemeToggle)}
            role="button"
            tabIndex={0}
            aria-label="Toggle theme"
          >
            <i className="fa-solid fa-moon" id="theme-icon" aria-hidden="true"></i>
            <span>Toggle Theme</span>
          </div>
          <button 
            className="logout-btn" 
            onClick={handleLogout}
            onKeyDown={(e) => handleKeyDown(e, handleLogout)}
            aria-label="Logout"
          >
            <i className="fa-solid fa-right-from-bracket" aria-hidden="true"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {isMobile && isOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={onClose}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => handleKeyDown(e, onClose)}
          aria-label="Close sidebar"
        />
      )}
    </>
  );
};

export default Sidebar;