import React, { useContext, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../css/styles.css'; // Make sure to import your styles

const PrivateRoute = () => {
  const { user, authChecked, authError, checkAuth } = useContext(AuthContext);
  const location = useLocation();

  // Attempt to recheck auth if we get an error
  useEffect(() => {
    if (authError) {
      const timer = setTimeout(() => {
        checkAuth();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [authError, checkAuth]);

  if (!authChecked) {
    return (
      <div className="full-page-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
        <p className="loading-text">Verifying your session...</p>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="auth-error-container">
        <div className="auth-error-content">
          <h2 className="error-title">Authentication Error</h2>
          <p className="error-message">
            We encountered an issue verifying your session: {authError}
          </p>
          <div className="error-actions">
            <button 
              className="btn btn-primary"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => window.location.href = '/'}
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;