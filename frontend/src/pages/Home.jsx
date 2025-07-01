import React, { useState, useContext, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import NoteCard from '../components/NoteCard';
import NoteEditor from '../components/NoteEditor';
import { NotesContext } from '../context/NotesContext';

const Home = () => {
  const notesContext = useContext(NotesContext);
  
  if (!notesContext) {
    return (
      <div className="p-5 text-red-600">
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
    if (isMobile) setIsSidebarOpen(false);
  };

  const handleNewNote = () => {
    setEditingNote({
      title: '',
      content: '',
      category: 'personal',
      tags: []
    });
    if (isMobile) setIsSidebarOpen(false);
  };

  const handleCloseEditor = () => {
    setEditingNote(null);
  };

  const handleExpandNote = (noteId) => {
    setExpandedNoteId(noteId === expandedNoteId ? null : noteId);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5 text-red-600 bg-red-100 border-l-4 border-red-500 rounded m-5">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {isMobile && (
        <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-md sticky top-0 z-10">
          <button 
            className="p-2 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
            aria-expanded={isSidebarOpen}
          >
            <i className="fas fa-bars"></i>
          </button>
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
            {currentFilter === 'all' ? 'All Notes' : 
             currentFilter === 'favorites' ? 'Favorites' : 
             `${currentFilter.charAt(0).toUpperCase() + currentFilter.slice(1)} Notes`}
          </h1>
          <div className="w-10" aria-hidden="true"></div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          isMobile={isMobile}
          isOpen={isSidebarOpen}
          onClose={toggleSidebar}
          onNewNote={handleNewNote}
        />
        
        <main className={`flex-1 overflow-auto transition-all duration-300 ${!isSidebarOpen && isMobile ? 'ml-0' : 'ml-0 md:ml-64'}`}>
          {!isMobile && (
            <div className="flex justify-between items-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow mb-6 mx-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {currentFilter === 'all' ? 'All Notes' : 
                   currentFilter === 'favorites' ? 'Favorites' : 
                   `${currentFilter.charAt(0).toUpperCase() + currentFilter.slice(1)} Notes`}
                </h1>
                <span className="text-gray-500 dark:text-gray-400">
                  {notes ? notes.length : 0} {notes && notes.length === 1 ? 'note' : 'notes'}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                  <button 
                    className={`px-3 py-1 rounded-md ${currentView === 'grid' ? 'bg-white dark:bg-gray-600 shadow' : 'text-gray-500 dark:text-gray-400'}`}
                    onClick={() => setCurrentView('grid')}
                    aria-label="Grid view"
                    aria-pressed={currentView === 'grid'}
                  >
                    <i className="fas fa-th"></i>
                  </button>
                  <button 
                    className={`px-3 py-1 rounded-md ${currentView === 'list' ? 'bg-white dark:bg-gray-600 shadow' : 'text-gray-500 dark:text-gray-400'}`}
                    onClick={() => setCurrentView('list')}
                    aria-label="List view"
                    aria-pressed={currentView === 'list'}
                  >
                    <i className="fas fa-list"></i>
                  </button>
                </div>
                <select 
                  value={currentSort}
                  onChange={(e) => setCurrentSort(e.target.value)}
                  className="bg-gray-100 dark:bg-gray-700 border-none rounded-lg px-3 py-1 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-indigo-500"
                  aria-label="Sort notes by"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="alphabetical">A-Z</option>
                  <option value="modified">Last Modified</option>
                </select>
              </div>
            </div>
          )}

          <div className="p-4">
            {editingNote ? (
              <NoteEditor 
                note={editingNote}
                onSave={handleCloseEditor}
                onCancel={handleCloseEditor}
                inline={true}
              />
            ) : !notes || notes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mb-4">
                  <i className="fas fa-sticky-note text-indigo-600 dark:text-indigo-300 text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">No notes yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">Create your first note to get started</p>
                <button 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center"
                  onClick={handleNewNote}
                  aria-label="Create new note"
                >
                  <i className="fas fa-plus mr-2"></i>
                  Create Note
                </button>
              </div>
            ) : (
              <div className={`${currentView === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' : 'space-y-4'}`}>
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