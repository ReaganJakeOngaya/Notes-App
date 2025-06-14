import React, { useState, useContext } from 'react';
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

  const handleEditNote = (note) => {
    setEditingNote(note);
    setShowEditor(true);
  };

  const handleNewNote = () => {
    setEditingNote(null);
    setShowEditor(true);
  };

  const handleCloseEditor = () => {
    setShowEditor(false);
    setEditingNote(null);
  };

  return (
    <div className="app-container">
      <Sidebar onNewNote={handleNewNote} />
      
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
              >
                <i className="fas fa-th"></i>
              </button>
              <button 
                className={`view-btn ${currentView === 'list' ? 'active' : ''}`}
                onClick={() => setCurrentView('list')}
              >
                <i className="fas fa-list"></i>
              </button>
            </div>
            <div className="sort-dropdown">
              <select 
                value={currentSort}
                onChange={(e) => setCurrentSort(e.target.value)}
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
                <i className="fas fa-sticky-note"></i>
              </div>
              <h3>No notes yet</h3>
              <p>Create your first note to get started</p>
              <button className="btn btn-primary" onClick={handleNewNote}>
                <i className="fas fa-plus"></i>
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