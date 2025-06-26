import React, { useContext, useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import PropTypes from 'prop-types';
import '../css/styles.css';

const PrivateRoute = ({ allowedRoles = [] }) => {
  const { user, authChecked, authError, checkAuth } = useContext(AuthContext);
  const location = useLocation();
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  useEffect(() => {
    if (authError && retryCount < maxRetries) {
      const timer = setTimeout(() => {
        checkAuth();
        setRetryCount(prev => prev + 1);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [authError, checkAuth, retryCount]);

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

  if (authError && retryCount >= maxRetries) {
    return (
      <div className="auth-error-container">
        <div className="auth-error-content">
          <h2 className="error-title">Session Expired</h2>
          <p className="error-message">
            Your session could not be verified. Please log in again.
          </p>
          <div className="error-actions">
            <button 
              className="btn btn-primary"
              onClick={() => window.location.href = '/login'}
            >
              Go to Login
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

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

PrivateRoute.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string)
};

export default PrivateRoute;