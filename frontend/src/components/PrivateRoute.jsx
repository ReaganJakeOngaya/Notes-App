import React, { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const PrivateRoute = () => {
  const { user, authChecked, authError } = useContext(AuthContext);
  const location = useLocation();

  if (!authChecked) {
    return (
      <div className="full-page-spinner">
        <LoadingSpinner size="large" color="primary" />
        <p>Verifying your session...</p>
      </div>
    );
  }

  if (authError) {
    console.error('Authentication error:', authError);
    return (
      <div className="auth-error-page">
        <h2>Authentication Error</h2>
        <p>We encountered an issue verifying your session.</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
        <Navigate to="/login" state={{ from: location }} replace />
      </div>
    );
  }

  return user ? (
    <Outlet />
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );
};

export default PrivateRoute;