import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotesProvider } from './context/NotesContext';
import PrivateRoute from './components/PrivateRoute';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';
import './styles.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

// Lazy load main pages for better performance
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Profile = lazy(() => import('./pages/Profile'));
const LandingPage = lazy(() => import('./pages/LandingPage'));
const SharedNotes = lazy(() => import('./pages/SharedNotes'));

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotesProvider>
          <div className="app">
            <ErrorBoundary>
              <Suspense fallback={<LoadingSpinner fullPage />}>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/home" element={
                    // <PrivateRoute>
                      <Home />
                    // </PrivateRoute>
                  } />
                  <Route path="/profile" element={
                    <PrivateRoute allowedRoles={['user', 'admin']}>
                      <Profile />
                    </PrivateRoute>
                  } />
                  <Route path="/shared" element={
                    <PrivateRoute>
                      <SharedNotes />
                    </PrivateRoute>
                  } />
                  <Route path="/unauthorized" element={<Unauthorized />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </ErrorBoundary>
          </div>
        </NotesProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;