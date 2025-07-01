import React from 'react';
import PropTypes from 'prop-types';

const LoadingSpinner = ({ 
  size = 'medium', 
  color = 'primary', 
  className = '',
  fullPage = false,
  text = '',
  textPosition = 'below'
}) => {
  const sizeClasses = {
    small: 'w-6 h-6 border-2',
    medium: 'w-8 h-8 border-3',
    large: 'w-12 h-12 border-4',
    xlarge: 'w-16 h-16 border-4'
  };

  const colorClasses = {
    primary: 'border-indigo-500 border-t-indigo-200',
    secondary: 'border-gray-500 border-t-gray-200',
    light: 'border-white border-t-gray-100',
    dark: 'border-gray-800 border-t-gray-300',
    danger: 'border-red-500 border-t-red-200',
    success: 'border-green-500 border-t-green-200'
  };

  const wrapperClass = `${fullPage ? 'fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50' : ''} ${className}`;
  const containerClass = `flex ${textPosition === 'beside' ? 'flex-row items-center space-x-4' : 'flex-col items-center space-y-2'}`;

  return (
    <div className={wrapperClass}>
      <div className={containerClass}>
        <div className={`animate-spin rounded-full ${sizeClasses[size]} ${colorClasses[color]}`}></div>
        {text && <span className="text-gray-700 dark:text-gray-300">{text}</span>}
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