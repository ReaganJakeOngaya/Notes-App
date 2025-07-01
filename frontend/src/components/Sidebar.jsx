import React, { useContext, useState, useEffect, useCallback } from 'react';
import { NotesContext } from '../context/NotesContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../services/api';

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
    { id: 'all', name: 'All Notes', icon: 'fas fa-inbox' },
    { id: 'favorites', name: 'Favorites', icon: 'fas fa-star' },
    { id: 'work', name: 'Work', icon: 'fas fa-briefcase' },
    { id: 'personal', name: 'Personal', icon: 'fas fa-user' },
    { id: 'ideas', name: 'Ideas', icon: 'fas fa-lightbulb' }
  ];

  useEffect(() => {
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
        className={`fixed md:relative h-full w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out z-20
          ${isMobile ? (isOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <i className="fas fa-sticky-note text-indigo-600 dark:text-indigo-400 text-xl mr-2"></i>
              <span className="text-xl font-semibold text-gray-800 dark:text-white">NoteFlow</span>
            </div>
            <button 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg flex items-center justify-center"
              onClick={onNewNote}
              onKeyDown={(e) => handleKeyDown(e, onNewNote)}
              aria-label="Create new note"
            >
              <i className="fas fa-plus mr-2"></i>
              New Note
            </button>
          </div>
          
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
              <input 
                type="text" 
                placeholder="Search notes..." 
                value={searchValue}
                onChange={handleSearch}
                className="w-full pl-10 pr-8 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Search notes"
              />
              {searchValue && (
                <button 
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  onClick={handleClearSearch}
                  aria-label="Clear search"
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Categories</h3>
            <div className="space-y-1">
              {categories.map(category => (
                <div 
                  key={category.id}
                  className={`flex items-center px-3 py-2 rounded-lg cursor-pointer transition-colors ${currentFilter === category.id ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                  onClick={() => handleFilter(category.id)}
                  onKeyDown={(e) => handleKeyDown(e, () => handleFilter(category.id))}
                  role="button"
                  tabIndex={0}
                  aria-label={`Filter by ${category.name}`}
                  aria-current={currentFilter === category.id ? 'page' : undefined}
                >
                  <i className={`${category.icon} mr-3`} aria-hidden="true"></i>
                  <span>{category.name}</span>
                </div>
              ))}
              <div 
                className="flex items-center px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 relative"
                onClick={handleSharedNotesClick}
                onKeyDown={(e) => handleKeyDown(e, handleSharedNotesClick)}
                role="button"
                tabIndex={0}
                aria-label="View shared notes"
              >
                <i className="fas fa-share-nodes mr-3" aria-hidden="true"></i>
                <span>Shared with me</span>
                {hasUnreadSharedNotes && (
                  <span className="absolute right-3 top-3 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div 
              className="flex items-center mb-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
              onClick={handleProfileClick}
              onKeyDown={(e) => handleKeyDown(e, handleProfileClick)}
              role="button"
              tabIndex={0}
              aria-label="Go to profile"
            >
              <img 
                src={getAvatarUrl() || '/default-avatar.png'}
                alt={`${user?.username || 'User'} avatar`}
                className="w-10 h-10 rounded-full object-cover"
                onError={(e) => {
                  e.target.src = '/default-avatar.png';
                  e.target.onerror = null;
                }}
              />
              <div className="ml-3">
                <div className="text-sm font-medium text-gray-800 dark:text-white">{user?.username || 'User'}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</div>
              </div>
            </div>

            <div 
              className="flex items-center px-2 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-700 dark:text-gray-300"
              onClick={handleThemeToggle}
              onKeyDown={(e) => handleKeyDown(e, handleThemeToggle)}
              role="button"
              tabIndex={0}
              aria-label="Toggle theme"
            >
              <i className="fas fa-moon mr-3" aria-hidden="true"></i>
              <span>Toggle Theme</span>
            </div>

            <button 
              className="w-full flex items-center px-2 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              onClick={handleLogout}
              onKeyDown={(e) => handleKeyDown(e, handleLogout)}
              aria-label="Logout"
            >
              <i className="fas fa-right-from-bracket mr-3" aria-hidden="true"></i>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
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