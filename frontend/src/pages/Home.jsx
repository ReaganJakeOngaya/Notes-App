import React, { useState, useContext, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import NoteCard from '../components/NoteCard';
import NoteEditor from '../components/NoteEditor';
import { NotesContext } from '../context/NotesContext';
import '../css/Home.css';

const Home = () => {
  const { 
    notes, 
    sharedNotes, 
    currentView, 
    currentFilter, 
    currentSort, 
    setCurrentView, 
    setCurrentSort,
    toggleFavorite
  } = useContext(NotesContext);
  
  const [showEditor, setShowEditor] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [expandedNoteId, setExpandedNoteId] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);

  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
      setIsSidebarOpen(!isMobileView);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleEditNote = (note) => {
    setEditingNote(note);
    setShowEditor(true);
    if (isMobile) setIsSidebarOpen(false);
  };

  const handleNewNote = () => {
    setEditingNote(null);
    setShowEditor(true);
    if (isMobile) setIsSidebarOpen(false);
  };

  const handleCloseEditor = () => {
    setShowEditor(false);
    setEditingNote(null);
  };

  const handleExpandNote = (noteId) => {
    setExpandedNoteId(noteId === expandedNoteId ? null : noteId);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="dashboard-container">
      {isMobile && (
        <div className="mobile-header">
          <button 
            className="sidebar-toggle"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <i className="fa-solid fa-bars"></i>
          </button>
          <h1>
            {currentFilter === 'all' ? 'All Notes' : 
             currentFilter === 'favorites' ? 'Favorites' : 
             `${currentFilter.charAt(0).toUpperCase() + currentFilter.slice(1)} Notes`}
          </h1>
        </div>
      )}

      <div className="dashboard-layout">
        <Sidebar 
          isMobile={isMobile}
          isOpen={isSidebarOpen}
          onClose={toggleSidebar}
          onNewNote={handleNewNote}
        />
        
        <main className="dashboard-main">
          {!isMobile && (
            <div className="dashboard-header">
              <div className="header-left">
                <h1>
                  {currentFilter === 'all' ? 'All Notes' : 
                   currentFilter === 'favorites' ? 'Favorites' : 
                   `${currentFilter.charAt(0).toUpperCase() + currentFilter.slice(1)} Notes`}
                </h1>
                <span className="notes-count">{notes.length} notes</span>
              </div>
              <div className="header-actions">
                <div className="view-toggle">
                  <button 
                    className={`view-btn ${currentView === 'grid' ? 'active' : ''}`}
                    onClick={() => setCurrentView('grid')}
                    aria-label="Grid view"
                  >
                    <i className="fa-solid fa-grid"></i>
                    <span>Grid</span>
                  </button>
                  <button 
                    className={`view-btn ${currentView === 'list' ? 'active' : ''}`}
                    onClick={() => setCurrentView('list')}
                    aria-label="List view"
                  >
                    <i className="fa-solid fa-list"></i>
                    <span>List</span>
                  </button>
                </div>
                <div className="sort-dropdown">
                  <select 
                    value={currentSort}
                    onChange={(e) => setCurrentSort(e.target.value)}
                    aria-label="Sort notes by"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="alphabetical">A-Z</option>
                    <option value="modified">Last Modified</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <div className="notes-container">
            {notes.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <i className="fa-solid fa-note-sticky"></i>
                </div>
                <h3>No notes yet</h3>
                <p>Create your first note to get started</p>
                <button 
                  className="btn btn-primary" 
                  onClick={handleNewNote}
                  aria-label="Create new note"
                >
                  <i className="fa-solid fa-plus"></i>
                  Create Note
                </button>
              </div>
            ) : (
              <div className={`notes-${currentView}`}>
                {notes.map(note => (
                  <NoteCard 
                    key={note.id}
                    note={note}
                    onEdit={handleEditNote}
                    onFavoriteToggle={toggleFavorite}
                    isExpanded={expandedNoteId === note.id}
                    onExpand={handleExpandNote}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {showEditor && (
        <NoteEditor 
          note={editingNote}
          onSave={handleCloseEditor}
          onCancel={handleCloseEditor}
        />
      )}
    </div>
  );
};

export default Home;