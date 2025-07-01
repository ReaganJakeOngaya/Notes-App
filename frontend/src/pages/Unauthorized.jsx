import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Unauthorized.css';

const Unauthorized = () => {
  return (
    <div className="unauthorized-container">
      <div className="unauthorized-content">
        <div className="unauthorized-icon">
          <i className="fa-solid fa-lock"></i>
        </div>
        <h1 className="unauthorized-title">403 - Unauthorized</h1>
        <p className="unauthorized-message">
          You don't have permission to access this page.
        </p>
        <div className="unauthorized-actions">
          <Link to="/" className="btn btn-primary">
            Return Home
          </Link>
          <Link to="/profile" className="btn btn-secondary">
            Your Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;