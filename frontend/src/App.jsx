import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotesProvider } from './context/NotesContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';
// import '@fortawesome/fontawesome-free/css/all.min.css';
import './styles.css'

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotesProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Routes>
        </NotesProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;