import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { getNotes, createNote, updateNote, deleteNote, shareNote, getSharedNotes } from '../services/api';
import { AuthContext } from './AuthContext';

export const NotesContext = createContext();

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [sharedNotes, setSharedNotes] = useState([]);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [currentView, setCurrentView] = useState('grid');
  const [currentSort, setCurrentSort] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user, authChecked } = useContext(AuthContext);

  const fetchNotes = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await getNotes(currentFilter, searchQuery);
      setNotes(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching notes:', err);
      setError(err.message || 'Failed to load notes');
    } finally {
      setIsLoading(false);
    }
  }, [user, currentFilter, searchQuery]);

  const fetchSharedNotes = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await getSharedNotes();
      setSharedNotes(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching shared notes:', err);
      setError(err.message || 'Failed to load shared notes');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (authChecked && user) {
      fetchNotes();
      fetchSharedNotes();
    }
  }, [authChecked, user, fetchNotes, fetchSharedNotes]);

  const addNote = async (noteData) => {
    setIsLoading(true);
    try {
      const newNote = await createNote(noteData);
      setNotes(prevNotes => [newNote, ...prevNotes]);
      setError(null);
      return newNote;
    } catch (err) {
      console.error('Error creating note:', err);
      setError(err.message || 'Failed to create note');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const editNote = async (id, noteData) => {
    setIsLoading(true);
    try {
      const updatedNote = await updateNote(id, noteData);
      setNotes(prevNotes => prevNotes.map(note => 
        note.id === id ? updatedNote : note
      ));
      setError(null);
      return updatedNote;
    } catch (err) {
      console.error('Error updating note:', err);
      setError(err.message || 'Failed to update note');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const removeNote = async (id) => {
    setIsLoading(true);
    try {
      await deleteNote(id);
      setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
      setError(null);
    } catch (err) {
      console.error('Error deleting note:', err);
      setError(err.message || 'Failed to delete note');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = async (id, isFavorite) => {
    try {
      await editNote(id, { favorite: !isFavorite });
    } catch (err) {
      console.error('Error toggling favorite:', err);
      throw err;
    }
  };

  const shareNoteWithUser = async (noteId, email, permission) => {
    setIsLoading(true);
    try {
      await shareNote(noteId, email, permission);
      setError(null);
    } catch (err) {
      console.error('Error sharing note:', err);
      setError(err.message || 'Failed to share note');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const sortedNotes = useMemo(() => {
    const notesToSort = [...notes];
    switch (currentSort) {
      case 'newest':
        return notesToSort.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'oldest':
        return notesToSort.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case 'alphabetical':
        return notesToSort.sort((a, b) => a.title.localeCompare(b.title));
      case 'modified':
        return notesToSort.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      default:
        return notesToSort;
    }
  }, [notes, currentSort]);

  const value = useMemo(() => ({
    notes: sortedNotes,
    sharedNotes,
    currentFilter,
    currentView,
    currentSort,
    searchQuery,
    error,
    isLoading,
    setCurrentFilter,
    setCurrentView,
    setCurrentSort,
    setSearchQuery,
    addNote,
    editNote,
    removeNote,
    toggleFavorite,
    shareNoteWithUser,
    fetchNotes,
    fetchSharedNotes
  }), [
    sortedNotes,
    sharedNotes,
    currentFilter,
    currentView,
    currentSort,
    searchQuery,
    error,
    isLoading
  ]);

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};