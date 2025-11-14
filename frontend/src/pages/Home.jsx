import React, { useState, useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import NoteCard from '../components/NoteCard';
import NoteEditor from '../components/NoteEditor';
import { NotesContext } from '../context/NotesContext';
import { Search, Grid, List, Plus, Sparkles, Menu } from 'lucide-react';

const Home = () => {
  const notesContext = useContext(NotesContext);
  
  if (!notesContext) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: '#000000',
        color: '#FFFFFF'
      }}>
        Error: NotesContext not found. Make sure Home is wrapped with NotesProvider.
      </div>
    );
  }

  const { 
    notes, 
    currentView, 
    currentFilter, 
    currentSort, 
    setCurrentView, 
    setCurrentSort,
    toggleFavorite,
    isLoading,
    error,
    searchQuery,
    setSearchQuery
  } = notesContext;
  
  const [editingNote, setEditingNote] = useState(null);
  const [expandedNoteId, setExpandedNoteId] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);
  const [searchValue, setSearchValue] = useState(searchQuery || '');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
      setIsSidebarOpen(!isMobileView);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setSearchValue(searchQuery || '');
  }, [searchQuery]);

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

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    setSearchQuery(value);
  };

  const handleClearSearch = () => {
    setSearchValue('');
    setSearchQuery('');
  };

  const handleSidebarCollapseChange = (isCollapsed) => {
    setIsSidebarCollapsed(isCollapsed);
  };

  // Filter and sort notes based on current settings
  const getFilteredAndSortedNotes = () => {
    if (!notes) return [];

    let filteredNotes = [...notes];

    // Apply search filter
    if (searchQuery) {
      filteredNotes = filteredNotes.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (note.tags && note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
      );
    }

    // Apply category filter
    if (currentFilter !== 'all') {
      if (currentFilter === 'favorites') {
        filteredNotes = filteredNotes.filter(note => note.isFavorite);
      } else {
        filteredNotes = filteredNotes.filter(note => note.category === currentFilter);
      }
    }

    // Apply sorting
    switch (currentSort) {
      case 'newest':
        filteredNotes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        filteredNotes.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'alphabetical':
        filteredNotes.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'modified':
        filteredNotes.sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
        break;
      default:
        break;
    }

    return filteredNotes;
  };

  const filteredNotes = getFilteredAndSortedNotes();

  // Calculate main content margin based on sidebar state
  const getMainContentStyle = () => {
    if (isMobile) {
      return {
        flex: 1,
        padding: '1rem',
        width: '100%'
      };
    } else {
      const sidebarWidth = isSidebarCollapsed ? 80 : 280;
      return {
        flex: 1,
        padding: '2rem',
        marginLeft: `${sidebarWidth}px`,
        width: `calc(100% - ${sidebarWidth}px)`,
        transition: 'all 0.3s ease'
      };
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: '#000000',
        color: '#FFFFFF',
        fontSize: '18px'
      }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{ marginRight: '1rem' }}
        >
          <Sparkles size={24} color="#0066FF" />
        </motion.div>
        Loading your notes...
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div style={{ 
        padding: '20px', 
        color: '#ff6b6b',
        background: 'rgba(255, 107, 107, 0.1)',
        borderLeft: '4px solid #ff6b6b',
        borderRadius: '8px',
        margin: '20px',
        backdropFilter: 'blur(10px)'
      }}>
        Error: {error}
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000000',
      color: '#FFFFFF',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Elements */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `linear-gradient(rgba(0, 102, 255, 0.05) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(0, 102, 255, 0.05) 1px, transparent 1px)`,
        backgroundSize: '50px 50px',
        opacity: 0.3
      }} />

      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          position: 'absolute',
          top: '20%',
          right: '5%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(0, 102, 255, 0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none'
        }}
      />

      {/* Mobile Header */}
      {isMobile && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            padding: '1rem',
            background: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleSidebar}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              padding: '0.5rem',
              color: '#FFFFFF',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label="Toggle sidebar"
          >
            <Menu size={20} />
          </motion.button>

          <motion.h1
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              background: 'linear-gradient(90deg, #FFFFFF, #0066FF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              margin: 0
            }}
          >
            {currentFilter === 'all' ? 'All Notes' : 
             currentFilter === 'favorites' ? 'Favorites' : 
             `${currentFilter.charAt(0).toUpperCase() + currentFilter.slice(1)}`}
          </motion.h1>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNewNote}
            style={{
              background: '#0066FF',
              border: 'none',
              borderRadius: '8px',
              padding: '0.5rem',
              color: '#FFFFFF',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label="Create new note"
          >
            <Plus size={20} />
          </motion.button>
        </motion.div>
      )}

      <div style={{
        display: 'flex',
        minHeight: '100vh',
        paddingTop: isMobile ? '70px' : '0'
      }}>
        <Sidebar 
          isMobile={isMobile}
          isOpen={isSidebarOpen}
          onClose={toggleSidebar}
          onNewNote={handleNewNote}
          onCollapseChange={handleSidebarCollapseChange}
        />
        
        <motion.main 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={getMainContentStyle()}
        >
          {/* Desktop Header */}
          {!isMobile && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '2rem',
                flexWrap: 'wrap',
                gap: '1rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <motion.h1
                  style={{
                    fontSize: '2.5rem',
                    fontWeight: 900,
                    background: 'linear-gradient(90deg, #FFFFFF, #0066FF)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    margin: 0
                  }}
                >
                  {currentFilter === 'all' ? 'All Notes' : 
                   currentFilter === 'favorites' ? 'Favorites' : 
                   `${currentFilter.charAt(0).toUpperCase() + currentFilter.slice(1)} Notes`}
                </motion.h1>
                
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{
                    padding: '0.25rem 1rem',
                    background: 'rgba(0, 102, 255, 0.1)',
                    border: '1px solid rgba(0, 102, 255, 0.3)',
                    borderRadius: '50px',
                    fontSize: '0.875rem',
                    fontWeight: 500
                  }}
                >
                  {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'}
                </motion.span>
              </div>

              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1rem', 
                flexWrap: 'wrap',
                justifyContent: 'flex-end'
              }}>
                {/* Search Bar */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  style={{
                    position: 'relative',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '0.75rem 1rem',
                    minWidth: '300px'
                  }}
                >
                  <Search 
                    size={20} 
                    color="rgba(255, 255, 255, 0.5)" 
                    style={{ 
                      position: 'absolute', 
                      left: '12px', 
                      top: '50%', 
                      transform: 'translateY(-50%)' 
                    }} 
                  />
                  <input 
                    type="text"
                    placeholder="Search notes..."
                    value={searchValue}
                    onChange={handleSearchChange}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#FFFFFF',
                      paddingLeft: '2rem',
                      width: '100%',
                      fontSize: '0.95rem',
                      outline: 'none'
                    }}
                    aria-label="Search notes"
                  />
                  {searchValue && (
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={handleClearSearch}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: 'rgba(255, 255, 255, 0.5)',
                        cursor: 'pointer',
                        padding: '4px'
                      }}
                      aria-label="Clear search"
                    >
                      ×
                    </motion.button>
                  )}
                </motion.div>

                {/* View Toggle */}
                <motion.div 
                  style={{
                    display: 'flex',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '0.25rem'
                  }}
                >
                  {['grid', 'list'].map((view) => (
                    <motion.button
                      key={view}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCurrentView(view)}
                      style={{
                        padding: '0.5rem 1rem',
                        background: currentView === view ? '#0066FF' : 'transparent',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#FFFFFF',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.875rem',
                        fontWeight: 500
                      }}
                      aria-label={`Switch to ${view} view`}
                    >
                      {view === 'grid' ? <Grid size={16} /> : <List size={16} />}
                      {view.charAt(0).toUpperCase() + view.slice(1)}
                    </motion.button>
                  ))}
                </motion.div>

                {/* Sort Dropdown */}
                <motion.select 
                  whileHover={{ scale: 1.02 }}
                  value={currentSort}
                  onChange={(e) => setCurrentSort(e.target.value)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '0.75rem 1rem',
                    color: '#FFFFFF',
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    outline: 'none',
                    minWidth: '150px'
                  }}
                  aria-label="Sort notes by"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="alphabetical">A-Z</option>
                  <option value="modified">Last Modified</option>
                </motion.select>

                {/* New Note Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNewNote}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: '#0066FF',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#FFFFFF',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    boxShadow: '0 4px 20px rgba(0, 102, 255, 0.3)'
                  }}
                  aria-label="Create new note"
                >
                  <Plus size={20} />
                  New Note
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Mobile Search and Controls */}
          {isMobile && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                marginBottom: '2rem'
              }}
            >
              {/* Search Bar */}
              <motion.div 
                style={{
                  position: 'relative',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '0.75rem 1rem'
                }}
              >
                <Search 
                  size={20} 
                  color="rgba(255, 255, 255, 0.5)" 
                  style={{ 
                    position: 'absolute', 
                    left: '12px', 
                    top: '50%', 
                    transform: 'translateY(-50%)' 
                  }} 
                />
                <input 
                  type="text"
                  placeholder="Search notes..."
                  value={searchValue}
                  onChange={handleSearchChange}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#FFFFFF',
                    paddingLeft: '2rem',
                    width: '100%',
                    fontSize: '0.95rem',
                    outline: 'none'
                  }}
                />
                {searchValue && (
                  <button
                    onClick={handleClearSearch}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'rgba(255, 255, 255, 0.5)',
                      cursor: 'pointer',
                      padding: '4px'
                    }}
                  >
                    ×
                  </button>
                )}
              </motion.div>

              {/* Mobile Controls */}
              <div style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'space-between'
              }}>
                <div style={{
                  display: 'flex',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '0.25rem',
                  flex: 1
                }}>
                  {['grid', 'list'].map((view) => (
                    <button
                      key={view}
                      onClick={() => setCurrentView(view)}
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        background: currentView === view ? '#0066FF' : 'transparent',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#FFFFFF',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        fontSize: '0.875rem',
                        fontWeight: 500
                      }}
                    >
                      {view === 'grid' ? <Grid size={16} /> : <List size={16} />}
                    </button>
                  ))}
                </div>

                <select 
                  value={currentSort}
                  onChange={(e) => setCurrentSort(e.target.value)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '0.75rem',
                    color: '#FFFFFF',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    outline: 'none',
                    minWidth: '120px'
                  }}
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="alphabetical">A-Z</option>
                  <option value="modified">Modified</option>
                </select>
              </div>
            </motion.div>
          )}

          {/* Notes Content */}
          <AnimatePresence mode="wait">
            {editingNote ? (
              <motion.div
                key="editor"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <NoteEditor 
                  note={editingNote}
                  onSave={handleCloseEditor}
                  onCancel={handleCloseEditor}
                  inline={true}
                />
              </motion.div>
            ) : filteredNotes.length === 0 ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '4rem 2rem',
                  textAlign: 'center'
                }}
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{
                    width: '80px',
                    height: '80px',
                    background: 'rgba(0, 102, 255, 0.1)',
                    border: '2px solid rgba(0, 102, 255, 0.3)',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '2rem'
                  }}
                >
                  <Sparkles size={32} color="#0066FF" />
                </motion.div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>
                  {searchValue ? 'No notes found' : 'No notes yet'}
                </h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '2rem' }}>
                  {searchValue 
                    ? 'Try adjusting your search terms or create a new note'
                    : 'Create your first note to get started with your organized thoughts'
                  }
                </p>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNewNote}
                  style={{
                    padding: '1rem 2rem',
                    background: '#0066FF',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#FFFFFF',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '1rem',
                    fontWeight: 600,
                    boxShadow: '0 4px 20px rgba(0, 102, 255, 0.3)'
                  }}
                >
                  <Plus size={20} />
                  Create Your First Note
                </motion.button>
              </motion.div>
            ) : (
              <motion.div 
                key="notes"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  display: currentView === 'grid' ? 'grid' : 'flex',
                  gridTemplateColumns: currentView === 'grid' ? 'repeat(auto-fill, minmax(300px, 1fr))' : '1fr',
                  flexDirection: currentView === 'list' ? 'column' : 'row',
                  gap: '1.5rem'
                }}
              >
                {filteredNotes.map((note, index) => (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <NoteCard 
                      note={note}
                      onEdit={handleEditNote}
                      onFavoriteToggle={toggleFavorite}
                      isExpanded={expandedNoteId === note.id}
                      onExpand={handleExpandNote}
                      view={currentView}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.main>
      </div>
    </div>
  );
};

export default Home;