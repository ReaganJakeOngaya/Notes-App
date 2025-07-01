import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-6">
          <i className="fas fa-lock text-red-600 dark:text-red-300 text-3xl"></i>
        </div>
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-white mb-2">403 - Unauthorized</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          You don't have permission to access this page.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link 
            to="/" 
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            Return Home
          </Link>
          <Link 
            to="/profile" 
            className="px-6 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg transition-colors"
          >
            Your Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;