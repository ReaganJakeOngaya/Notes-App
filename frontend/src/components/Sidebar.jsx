import React, { useContext, useState, useEffect, useCallback } from 'react';
import { NotesContext } from '../context/NotesContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import NoteEditor from '../components/NoteEditor';
import { API_URL } from '../services/api';
import '../css/Sidebar.css';

const Sidebar = ({ isMobileOpen, toggleMobileSidebar }) => {
  const { 
    currentFilter, 
    setCurrentFilter, 
    setSearchQuery,
    fetchSharedNotes
  } = useContext(NotesContext);
  
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showEditor, setShowEditor] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  const categories = [
    { id: 'all', name: 'All Notes', icon: 'fa-solid fa-inbox' },
    { id: 'favorites', name: 'Favorites', icon: 'fa-solid fa-star' },
    { id: 'work', name: 'Work', icon: 'fa-solid fa-briefcase' },
    { id: 'personal', name: 'Personal', icon: 'fa-solid fa-user' },
    { id: 'ideas', name: 'Ideas', icon: 'fa-solid fa-lightbulb' }
  ];

  // Function to handle avatar URL
  const getAvatarUrl = () => {
    if (!user?.avatar) {
      return '';
    }
    if (user.avatar.startsWith('http')) return user.avatar;
      return `${API_URL}${user.avatar.startsWith('/') ? '' : '/'}${user.avatar}`;
  };
  // Handle window resize to toggle mobile view
  const handleResize = useCallback(() => {
    const isMobileView = window.innerWidth < 768;
    setIsMobile(isMobileView);
    if (window.innerWidth >= 768) {
      setIsCollapsed(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);
  
  const handleNewNote = useCallback(() => {
    setEditingNote(null);
    setShowEditor(true);
  }, []);

  const handleCloseEditor = useCallback(() => {
    setShowEditor(false);
    setEditingNote(null);
  }, []);

  const handleSearch = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, [setSearchQuery]);

  const handleFilter = useCallback((category) => {
    setCurrentFilter(category);
    if (isMobile) {
      toggleMobileSidebar();
    }
  }, [isMobile, setCurrentFilter, toggleMobileSidebar]);

  const handleSharedNotesClick = useCallback(() => {
    fetchSharedNotes();
    navigate('/shared');
    if (isMobile) {
      toggleMobileSidebar();
    }
  }, [fetchSharedNotes, navigate, isMobile, toggleMobileSidebar]);

  const toggleSidebar = useCallback(() => {
    setIsCollapsed(!isCollapsed);
  }, [isCollapsed]);

  const handleKeyDown = useCallback((e, action) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  }, []);

  const handleProfileClick = useCallback(() => {
    navigate('/profile');
    if (isMobile) {
      toggleMobileSidebar();
    }
  }, [navigate, isMobile, toggleMobileSidebar]);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/login');
  }, [logout, navigate]);

  return (
    <>
      <aside 
        className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobile ? 'mobile' : ''} ${isMobileOpen ? 'open' : ''}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="sidebar-header">
          {!isCollapsed && (
            <div className="logo">
              <i className="fa-solid fa-note-sticky" aria-hidden="true"></i>
              <span>NoteFlow</span>
            </div>
          )}
          {isCollapsed && (
            <div className="logo-collapsed">
              <i className="fa-solid fa-note-sticky" aria-hidden="true"></i>
            </div>
          )}
          {!isCollapsed && (
            <button 
              className="new-note-btn" 
              onClick={handleNewNote}
              onKeyDown={(e) => handleKeyDown(e, handleNewNote)}
              aria-label="Create new note"
            >
              <i className="fa-solid fa-plus" aria-hidden="true"></i>
              <span>New Note</span>
            </button>
          )}
          {isCollapsed && (
            <button 
              className="new-note-btn collapsed" 
              onClick={handleNewNote}
              onKeyDown={(e) => handleKeyDown(e, handleNewNote)}
              aria-label="Create new note"
              title="New Note"
            >
              <i className="fa-solid fa-plus" aria-hidden="true"></i>
            </button>
          )}
          {!isMobile && (
            <button 
              className="collapse-btn" 
              onClick={toggleSidebar}
              onKeyDown={(e) => handleKeyDown(e, toggleSidebar)}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <i 
                className={`fa-solid fa-${isCollapsed ? 'chevron-right' : 'chevron-left'}`} 
                aria-hidden="true"
              ></i>
            </button>
          )}
        </div>
        
        <div className="search-section">
          {!isCollapsed ? (
            <div className="search-box">
              <i className="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
              <input 
                type="text" 
                placeholder="Search notes..." 
                onChange={handleSearch}
                aria-label="Search notes"
              />
            </div>
          ) : (
            <div 
              className="search-box collapsed" 
              onClick={() => setIsCollapsed(false)}
              onKeyDown={(e) => handleKeyDown(e, () => setIsCollapsed(false))}
              role="button"
              tabIndex={0}
              aria-label="Expand to search notes"
              title="Search notes"
            >
              <i className="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
            </div>
          )}
        </div>

        <div className="categories">
          {!isCollapsed && <h3>Categories</h3>}
          <div className="category-list" role="list">
            {categories.map(category => (
              <div 
                key={category.id}
                className={`category-item ${currentFilter === category.id ? 'active' : ''}`}
                onClick={() => handleFilter(category.id)}
                onKeyDown={(e) => handleKeyDown(e, () => handleFilter(category.id))}
                role="listitem button"
                tabIndex={0}
                title={isCollapsed ? category.name : ''}
                aria-label={`Filter by ${category.name}`}
                aria-current={currentFilter === category.id ? 'page' : undefined}
              >
                <i className={category.icon} aria-hidden="true"></i>
                {!isCollapsed && <span>{category.name}</span>}
              </div>
            ))}
            <div 
              className="category-item"
              onClick={handleSharedNotesClick}
              onKeyDown={(e) => handleKeyDown(e, handleSharedNotesClick)}
              role="listitem button"
              tabIndex={0}
              title={isCollapsed ? "Shared with me" : ''}
              aria-label="View shared notes"
            >
              <i className="fa-solid fa-share-nodes" aria-hidden="true"></i>
              {!isCollapsed && <span>Shared with me</span>}
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
              src={getAvatarUrl()} 
              alt={`${user?.username || 'User'} avatar`}
              onError={(e) => {
                e.target.src = '/default-avatar.png';
                e.target.onerror = null; 
              }}
            />
            {!isCollapsed && <span>{user?.username}</span>}
          </div>
          <div className="theme-toggle">
            <button 
              title={isCollapsed ? "Toggle theme" : ''}
              aria-label="Toggle dark mode"
            >
              <i className="fa-solid fa-moon" id="theme-icon" aria-hidden="true"></i>
              {!isCollapsed && <span>Dark Mode</span>}
            </button>
          </div>
          <button 
            className="logout-btn" 
            title={isCollapsed ? "Logout" : ''} 
            onClick={handleLogout}
            onKeyDown={(e) => handleKeyDown(e, handleLogout)}
            aria-label="Logout"
          >
            <i className="fa-solid fa-right-from-bracket" aria-hidden="true"></i>
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {isMobile && isMobileOpen && (
        <div 
          className="sidebar-overlay visible" 
          onClick={toggleMobileSidebar}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => handleKeyDown(e, toggleMobileSidebar)}
          aria-label="Close sidebar"
        />
      )}

      {showEditor && (
        <NoteEditor 
          note={editingNote}
          onSave={handleCloseEditor}
          onCancel={handleCloseEditor}
        />
      )} 
    </>
  );
};

export default Sidebar;