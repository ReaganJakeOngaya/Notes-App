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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
      if (!isMobileView) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleEditNote = (note) => {
    setEditingNote(note);
    setShowEditor(true);
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  const handleNewNote = () => {
    setEditingNote(null);
    setShowEditor(true);
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  const handleCloseEditor = () => {
    setShowEditor(false);
    setEditingNote(null);
  };

  const handleExpandNote = (noteId) => {
    setExpandedNoteId(noteId === expandedNoteId ? null : noteId);
  };

  const handleSidebarToggle = (collapsed) => {
    setIsSidebarCollapsed(collapsed);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <div className={`app-container ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Mobile Toggle Button */}
      {isMobile && (
        <button 
          className="mobile-toggle-btn"
          onClick={toggleMobileSidebar}
          aria-label="Toggle sidebar"
          aria-expanded={isMobileOpen}
        >
          <i className="fa-solid fa-bars"></i>
        </button>
      )}

      <Sidebar 
        isMobileOpen={isMobileOpen}
        toggleMobileSidebar={toggleMobileSidebar}
        onNewNote={handleNewNote} 
        onToggle={handleSidebarToggle}
      />
      
      <main className="main-content">
        <div className="main-header">
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
              </button>
              <button 
                className={`view-btn ${currentView === 'list' ? 'active' : ''}`}
                onClick={() => setCurrentView('list')}
                aria-label="List view"
              >
                <i className="fa-solid fa-list"></i>
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