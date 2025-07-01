import React, { useContext, useState, useEffect, useCallback } from 'react';
import { NotesContext } from '../context/NotesContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../services/api';

const Sidebar = ({ isMobile, isOpen, onClose, onNewNote, isCollapsed, onToggleCollapse }) => {
  const { 
    currentFilter, 
    setCurrentFilter, 
    setSearchQuery,
    fetchSharedNotes,
    sharedNotes,
    notes
  } = useContext(NotesContext);
  
  const { user, logout, toggleTheme, theme } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [hasUnreadSharedNotes, setHasUnreadSharedNotes] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  const categories = [
    { id: 'all', name: 'All Notes', icon: 'fas fa-inbox', count: notes?.length || 0 },
    { id: 'favorites', name: 'Favorites', icon: 'fas fa-star', count: notes?.filter(n => n.favorite)?.length || 0 },
    { id: 'work', name: 'Work', icon: 'fas fa-briefcase', count: notes?.filter(n => n.category === 'work')?.length || 0 },
    { id: 'personal', name: 'Personal', icon: 'fas fa-user', count: notes?.filter(n => n.category === 'personal')?.length || 0 },
    { id: 'ideas', name: 'Ideas', icon: 'fas fa-lightbulb', count: notes?.filter(n => n.category === 'ideas')?.length || 0 }
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

  const sidebarWidth = isCollapsed ? 'w-16' : 'w-72';
  const sidebarTransform = isMobile ? (isOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0';

  return (
    <>
      <aside 
        className={`fixed md:relative h-full ${sidebarWidth} bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 shadow-2xl transform transition-all duration-500 ease-out z-30 ${sidebarTransform}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex flex-col h-full">
          {/* Header Section */}
          <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="relative">
                  <i className="fas fa-sticky-note text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 text-2xl"></i>
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full animate-pulse"></div>
                </div>
                {!isCollapsed && (
                  <span className="ml-3 text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300">
                    NoteFlow
                  </span>
                )}
              </div>
              {!isMobile && (
                <button
                  onClick={onToggleCollapse}
                  className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 text-gray-600 dark:text-gray-400 transition-all duration-300 hover:scale-110"
                  aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                  <i className={`fas ${isCollapsed ? 'fa-angle-right' : 'fa-angle-left'} transition-transform duration-300`}></i>
                </button>
              )}
            </div>
            
            <button 
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 px-4 rounded-xl flex items-center justify-center font-semibold shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-[1.02] group"
              onClick={onNewNote}
              onKeyDown={(e) => handleKeyDown(e, onNewNote)}
              aria-label="Create new note"
            >
              <i className="fas fa-plus mr-2 group-hover:rotate-90 transition-transform duration-300"></i>
              {!isCollapsed && "New Note"}
            </button>
          </div>
          
          {/* Search Section */}
          {!isCollapsed && (
            <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/50">
              <div className="relative group">
                <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-300"></i>
                <input 
                  type="text" 
                  placeholder="Search notes..." 
                  value={searchValue}
                  onChange={handleSearch}
                  className="w-full pl-12 pr-10 py-3 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white dark:focus:bg-gray-700 transition-all duration-300 border border-transparent focus:border-indigo-200"
                  aria-label="Search notes"
                />
                {searchValue && (
                  <button 
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-300 hover:scale-110"
                    onClick={handleClearSearch}
                    aria-label="Clear search"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Categories Section */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {!isCollapsed && (
              <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 px-2">Categories</h3>
            )}
            
            <div className="space-y-1">
              {categories.map(category => (
                <div 
                  key={category.id}
                  className={`group relative flex items-center px-3 py-3 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
                    currentFilter === category.id 
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25' 
                      : 'hover:bg-gray-100/70 dark:hover:bg-gray-800/70 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                  }`}
                  onClick={() => handleFilter(category.id)}
                  onKeyDown={(e) => handleKeyDown(e, () => handleFilter(category.id))}
                  onMouseEnter={() => setHoveredItem(category.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Filter by ${category.name}`}
                  aria-current={currentFilter === category.id ? 'page' : undefined}
                >
                  <div className="relative">
                    <i className={`${category.icon} text-lg transition-transform duration-300 ${hoveredItem === category.id ? 'scale-110' : ''}`} aria-hidden="true"></i>
                    {currentFilter === category.id && (
                      <div className="absolute -inset-1 bg-white/20 rounded-full animate-ping"></div>
                    )}
                  </div>
                  
                  {!isCollapsed && (
                    <>
                      <span className="ml-3 font-medium flex-1">{category.name}</span>
                      {category.count > 0 && (
                        <span className={`ml-2 px-2 py-1 text-xs rounded-full font-semibold ${
                          currentFilter === category.id 
                            ? 'bg-white/20 text-white' 
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                        }`}>
                          {category.count}
                        </span>
                      )}
                    </>
                  )}
                  
                  {isCollapsed && category.count > 0 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {category.count > 99 ? '99+' : category.count}
                    </div>
                  )}
                </div>
              ))}
              
              {/* Shared Notes */}
              <div 
                className="group relative flex items-center px-3 py-3 rounded-xl cursor-pointer hover:bg-gray-100/70 dark:hover:bg-gray-800/70 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300 transform hover:scale-[1.02]"
                onClick={handleSharedNotesClick}
                onKeyDown={(e) => handleKeyDown(e, handleSharedNotesClick)}
                role="button"
                tabIndex={0}
                aria-label="View shared notes"
              >
                <div className="relative">
                  <i className="fas fa-share-nodes text-lg" aria-hidden="true"></i>
                  {hasUnreadSharedNotes && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  )}
                </div>
                {!isCollapsed && <span className="ml-3 font-medium">Shared with me</span>}
              </div>
            </div>
          </div>

          {/* User Section */}
          <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-gray-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
            {/* Profile */}
            <div 
              className={`flex items-center mb-4 p-3 rounded-xl hover:bg-white/70 dark:hover:bg-gray-800/70 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] group ${isCollapsed ? 'justify-center' : ''}`}
              onClick={handleProfileClick}
              onKeyDown={(e) => handleKeyDown(e, handleProfileClick)}
              role="button"
              tabIndex={0}
              aria-label="Go to profile"
            >
              <div className="relative">
                <img 
                  src={getAvatarUrl() || '/default-avatar.png'}
                  alt={`${user?.username || 'User'} avatar`}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-200 dark:ring-indigo-700 group-hover:ring-indigo-400 transition-all duration-300"
                  onError={(e) => {
                    e.target.src = '/default-avatar.png';
                    e.target.onerror = null;
                  }}
                />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
              </div>
              
              {!isCollapsed && (
                <div className="ml-3 flex-1">
                  <div className="text-sm font-semibold text-gray-800 dark:text-white">{user?.username || 'User'}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</div>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <div 
              className={`flex items-center px-3 py-3 rounded-xl hover:bg-white/70 dark:hover:bg-gray-800/70 cursor-pointer text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300 transform hover:scale-[1.02] mb-2 group ${isCollapsed ? 'justify-center' : ''}`}
              onClick={handleThemeToggle}
              onKeyDown={(e) => handleKeyDown(e, handleThemeToggle)}
              role="button"
              tabIndex={0}
              aria-label="Toggle theme"
            >
              <i className={`fas ${theme === 'dark' ? 'fa-sun' : 'fa-moon'} text-lg group-hover:rotate-12 transition-transform duration-300`} aria-hidden="true"></i>
              {!isCollapsed && <span className="ml-3 font-medium">Toggle Theme</span>}
            </div>

            {/* Logout */}
            <button 
              className={`w-full flex items-center px-3 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-all duration-300 transform hover:scale-[1.02] group ${isCollapsed ? 'justify-center' : ''}`}
              onClick={handleLogout}
              onKeyDown={(e) => handleKeyDown(e, handleLogout)}
              aria-label="Logout"
            >
              <i className="fas fa-right-from-bracket text-lg group-hover:translate-x-1 transition-transform duration-300" aria-hidden="true"></i>
              {!isCollapsed && <span className="ml-3 font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 transition-opacity duration-300"
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