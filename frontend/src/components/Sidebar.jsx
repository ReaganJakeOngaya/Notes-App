import React, { useContext } from 'react';
import { NotesContext } from '../context/NotesContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../css/Sidebar.css';

const Sidebar = () => {
  const { 
    currentFilter, 
    setCurrentFilter, 
    setSearchQuery,
    fetchSharedNotes
  } = useContext(NotesContext);
  
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const categories = [
    { id: 'all', name: 'All Notes', icon: 'fas fa-inbox' },
    { id: 'favorites', name: 'Favorites', icon: 'fas fa-star' },
    { id: 'work', name: 'Work', icon: 'fas fa-briefcase' },
    { id: 'personal', name: 'Personal', icon: 'fas fa-user' },
    { id: 'ideas', name: 'Ideas', icon: 'fas fa-lightbulb' }
  ];

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilter = (category) => {
    setCurrentFilter(category);
  };

  const handleSharedNotesClick = () => {
    fetchSharedNotes();
    navigate('/shared');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <i className="fas fa-sticky-note"></i>
          <span>NoteFlow</span>
        </div>
        <button className="new-note-btn">
          <i className="fas fa-plus"></i>
          <span>New Note</span>
        </button>
      </div>
      
      <div className="search-section">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input 
            type="text" 
            placeholder="Search notes..." 
            onChange={handleSearch}
          />
        </div>
      </div>

      <div className="categories">
        <h3>Categories</h3>
        <div className="category-list">
          {categories.map(category => (
            <div 
              key={category.id}
              className={`category-item ${currentFilter === category.id ? 'active' : ''}`}
              onClick={() => handleFilter(category.id)}
            >
              <i className={category.icon}></i>
              <span>{category.name}</span>
            </div>
          ))}
          <div 
            className="category-item"
            onClick={handleSharedNotesClick}
          >
            <i className="fas fa-share-alt"></i>
            <span>Shared with me</span>
          </div>
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="user-profile">
          <img src={user?.avatar || '/default-avatar.png'} alt="User" />
          <span>{user?.username}</span>
        </div>
        <div className="theme-toggle">
          <button>
            <i className="fas fa-moon" id="theme-icon"></i>
            <span>Dark Mode</span>
          </button>
        </div>
        <button className="logout-btn" onClick={logout}>
          <i className="fas fa-sign-out-alt"></i>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
