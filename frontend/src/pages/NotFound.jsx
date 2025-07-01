import React from 'react';
import { Link } from 'react-router-dom';
import '../css/NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Page Not Found</h2>
        <p className="not-found-message">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="not-found-actions">
          <Link to="/" className="btn btn-primary">
            Return Home
          </Link>
          <Link to="/login" className="btn btn-secondary">
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;