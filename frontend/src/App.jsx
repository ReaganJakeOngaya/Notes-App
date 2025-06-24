import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotesProvider } from './context/NotesContext';
import PrivateRoute from './components/PrivateRoute';
import './styles.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Profile = lazy(() => import('./pages/Profile'));
const LandingPage = lazy(() => import('./pages/LandingPage'));

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotesProvider>
          <div className="app">
            <Suspense fallback={<div className="app-loader">Loading app...</div>}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
                <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
              </Routes>
            </Suspense>
          </div>
        </NotesProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;