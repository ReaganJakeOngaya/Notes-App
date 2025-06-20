// NotesContext.jsx
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  const fetchNotes = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await getNotes(currentFilter, searchQuery);
      setNotes(data);
    
    } finally {
      setIsLoading(false);
    }
  }, [user, currentFilter, searchQuery]);

  const fetchSharedNotes = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await getSharedNotes();
      setSharedNotes(data);
    } catch (err) {
      console.error('Error fetching shared notes:', err);
      setError(err.message || 'Failed to load shared notes');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchNotes();
    fetchSharedNotes();
  }, [fetchNotes, fetchSharedNotes]);

  const addNote = async (noteData) => {
    setIsLoading(true);
    setError(null);
    try {
      const newNote = await createNote(noteData);
      setNotes(prevNotes => [newNote, ...prevNotes]);
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
    setError(null);
    try {
      const updatedNote = await updateNote(id, noteData);
      setNotes(prevNotes => prevNotes.map(note => 
        note.id === id ? updatedNote : note
      ));
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
    setError(null);
    try {
      await deleteNote(id);
      setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
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
    setError(null);
    try {
      await shareNote(noteId, email, permission);
    } catch (err) {
      console.error('Error sharing note:', err);
      setError(err.message || 'Failed to share note');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <NotesContext.Provider value={{
      notes,
      sharedNotes,
      currentFilter,
      currentView,
      currentSort,
      searchQuery,
      isLoading,
      error,
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
    }}>
      {children}
    </NotesContext.Provider>
  );
};