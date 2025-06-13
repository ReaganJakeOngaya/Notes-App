import React, { createContext, useState, useEffect, useContext } from 'react';
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
  const { user } = useContext(AuthContext);

  const fetchNotes = async () => {
    if (!user) return;
    try {
      const data = await getNotes(currentFilter, searchQuery);
      setNotes(data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const fetchSharedNotes = async () => {
    if (!user) return;
    try {
      const data = await getSharedNotes();
      setSharedNotes(data);
    } catch (error) {
      console.error('Error fetching shared notes:', error);
    }
  };

  useEffect(() => {
    fetchNotes();
    fetchSharedNotes();
  }, [user, currentFilter, searchQuery]);

  const addNote = async (noteData) => {
    try {
      const newNote = await createNote(noteData);
      setNotes([newNote, ...notes]);
      return newNote;
    } catch (error) {
      console.error('Error creating note:', error);
      throw error;
    }
  };

  const editNote = async (id, noteData) => {
    try {
      const updatedNote = await updateNote(id, noteData);
      setNotes(notes.map(note => note.id === id ? updatedNote : note));
      return updatedNote;
    } catch (error) {
      console.error('Error updating note:', error);
      throw error;
    }
  };

  const removeNote = async (id) => {
    try {
      await deleteNote(id);
      setNotes(notes.filter(note => note.id !== id));
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  };

  const toggleFavorite = async (id, isFavorite) => {
    try {
      const updatedNote = await updateNote(id, { favorite: !isFavorite });
      setNotes(notes.map(note => note.id === id ? updatedNote : note));
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  };

  const shareNoteWithUser = async (noteId, email, permission) => {
    try {
      await shareNote(noteId, email, permission);
      // Optionally refresh notes or show a success message
    } catch (error) {
      console.error('Error sharing note:', error);
      throw error;
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