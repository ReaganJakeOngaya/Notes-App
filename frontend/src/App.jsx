import React, { useContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { NotesProvider, NotesContext } from './context/NotesContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';
import SharedNotes from './components/SharedNotes';
import Loader from './components/Loader';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './styles.css';

function AppContent() {
  const { loading: authLoading } = useContext(AuthContext);
  const { loading: notesLoading } = useContext(NotesContext);
  
  return (
    <>
      {authLoading || notesLoading ? (
        <Loader />
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/shared" element={<SharedNotes />} />
          </Route>
        </Routes>
      )}
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotesProvider>
          <AppContent />
        </NotesProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;