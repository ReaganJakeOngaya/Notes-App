import React from 'react';
import PropTypes from 'prop-types';
import '../css/LoadingSpinner.css';

const LoadingSpinner = ({ 
  size = 'medium', 
  color = 'primary', 
  className = '',
  fullPage = false,
  text = '',
  textPosition = 'below'
}) => {
  const sizeClasses = {
    small: 'spinner-small',
    medium: 'spinner-medium',
    large: 'spinner-large',
    xlarge: 'spinner-xlarge'
  };

  const colorClasses = {
    primary: 'spinner-primary',
    secondary: 'spinner-secondary',
    light: 'spinner-light',
    dark: 'spinner-dark',
    danger: 'spinner-danger',
    success: 'spinner-success'
  };

  const wrapperClass = `${fullPage ? 'full-page-spinner' : 'loading-spinner'} ${className}`;
  const spinnerClass = `spinner ${sizeClasses[size]} ${colorClasses[color]}`;

  return (
    <div className={wrapperClass}>
      <div className={`spinner-container ${textPosition === 'beside' ? 'horizontal' : ''}`}>
        <div className={spinnerClass}></div>
        {text && <span className="spinner-text">{text}</span>}
      </div>
    </div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large', 'xlarge']),
  color: PropTypes.oneOf(['primary', 'secondary', 'light', 'dark', 'danger', 'success']),
  className: PropTypes.string,
  fullPage: PropTypes.bool,
  text: PropTypes.string,
  textPosition: PropTypes.oneOf(['below', 'beside'])
};

export default LoadingSpinner;