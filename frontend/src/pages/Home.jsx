import React, { useState, useContext, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import NoteCard from '../components/NoteCard';
import NoteEditor from '../components/NoteEditor';
import { NotesContext } from '../context/NotesContext';
import '../css/Home.css';
import '../css/Sidebar.css';
import '../css/NoteCard.css';
import '../css/NoteEditor.css';
import '../styles.css'; 

const Home = () => {
  // Add console logs to debug
  console.log('Home component rendering...');
  
  const notesContext = useContext(NotesContext);
  console.log('NotesContext:', notesContext);
  
  // Check if context is available
  if (!notesContext) {
    console.error('NotesContext is not available');
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        Error: NotesContext not found. Make sure Home is wrapped with NotesProvider.
      </div>
    );
  }

  const { 
    notes, 
    sharedNotes, 
    currentView, 
    currentFilter, 
    currentSort, 
    setCurrentView, 
    setCurrentSort,
    toggleFavorite,
    isLoading,
    error
  } = notesContext;
  
  console.log('Notes:', notes);
  console.log('Current filter:', currentFilter);
  console.log('Is loading:', isLoading);
  console.log('Error:', error);
  
  const [editingNote, setEditingNote] = useState(null);
  const [expandedNoteId, setExpandedNoteId] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);

  useEffect(() => {
    console.log('Setting up resize listener...');
    const handleResize = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
      setIsSidebarOpen(!isMobileView);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleEditNote = (note) => {
    console.log('Editing note:', note);
    setEditingNote(note);
    if (isMobile) setIsSidebarOpen(false);
  };

  const handleNewNote = () => {
    console.log('Creating new note...');
    setEditingNote({
      title: '',
      content: '',
      category: 'personal',
      tags: []
    });
    if (isMobile) setIsSidebarOpen(false);
  };

  const handleCloseEditor = () => {
    console.log('Closing editor...');
    setEditingNote(null);
  };

  const handleExpandNote = (noteId) => {
    console.log('Expanding note:', noteId);
    setExpandedNoteId(noteId === expandedNoteId ? null : noteId);
  };

  const toggleSidebar = () => {
    console.log('Toggling sidebar...');
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div style={{ 
        padding: '20px', 
        color: 'red',
        backgroundColor: '#fee',
        borderleft: '1px solid black',
        borderRadius: '4px',
        margin: '20px'
      }}>
        Error: {error}
      </div>
    );
  }

  console.log('Rendering main component...');

  return (
    <div className="dashboard-container">
      {isMobile && (
        <div className="mobile-header">
          <button 
            className="sidebar-toggle"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
            aria-expanded={isSidebarOpen}
          >
            <i className="fa-solid fa-bars"></i>
          </button>
          <h1>
            {currentFilter === 'all' ? 'All Notes' : 
             currentFilter === 'favorites' ? 'Favorites' : 
             `${currentFilter.charAt(0).toUpperCase() + currentFilter.slice(1)} Notes`}
          </h1>
          <div style={{ width: '40px' }} aria-hidden="true"></div>
        </div>
      )}

      <div className="dashboard-layout">
        <Sidebar 
          isMobile={isMobile}
          isOpen={isSidebarOpen}
          onClose={toggleSidebar}
          onNewNote={handleNewNote}
        />
        
        <main className={`dashboard-main ${!isSidebarOpen && isMobile ? 'collapsed' : ''}`}>
          {!isMobile && (
            <div className="dashboard-header">
              <div className="header-left">
                <h1>
                  {currentFilter === 'all' ? 'All Notes' : 
                   currentFilter === 'favorites' ? 'Favorites' : 
                   `${currentFilter.charAt(0).toUpperCase() + currentFilter.slice(1)} Notes`}
                </h1>
                <span className="notes-count">
                  {notes ? notes.length : 0} {notes && notes.length === 1 ? 'note' : 'notes'}
                </span>
              </div>
              <div className="header-actions">
                <div className="view-toggle">
                  <button 
                    className={`view-btn ${currentView === 'grid' ? 'active' : ''}`}
                    onClick={() => setCurrentView('grid')}
                    aria-label="Grid view"
                    aria-pressed={currentView === 'grid'}
                  >
                    <i className="fa-solid fa-grid"></i>
                    <span>Grid</span>
                  </button>
                  <button 
                    className={`view-btn ${currentView === 'list' ? 'active' : ''}`}
                    onClick={() => setCurrentView('list')}
                    aria-label="List view"
                    aria-pressed={currentView === 'list'}
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
            {editingNote ? (
              <NoteEditor 
                note={editingNote}
                onSave={handleCloseEditor}
                onCancel={handleCloseEditor}
                inline={true}
              />
            ) : !notes || notes.length === 0 ? (
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
    </div>
  );
};

export default Home;