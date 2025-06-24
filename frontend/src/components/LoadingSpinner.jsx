import React from 'react';
import PropTypes from 'prop-types';
import '../css/LoadingSpinner.css';

const LoadingSpinner = ({ size = 'medium', color = 'primary', className = '' }) => {
  const sizeClasses = {
    small: 'spinner-small',
    medium: 'spinner-medium',
    large: 'spinner-large'
  };

  const colorClasses = {
    primary: 'spinner-primary',
    secondary: 'spinner-secondary',
    light: 'spinner-light',
    dark: 'spinner-dark'
  };

  return (
    <div className={`loading-spinner ${className}`}>
      <div className={`spinner ${sizeClasses[size]} ${colorClasses[color]}`}></div>
    </div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  color: PropTypes.oneOf(['primary', 'secondary', 'light', 'dark']),
  className: PropTypes.string
};

export default LoadingSpinner;