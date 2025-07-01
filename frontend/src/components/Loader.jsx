import React from 'react';

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50">
      <div className="text-center">
        <div className="flex justify-center space-x-2 mb-4">
          {[...Array(4)].map((_, i) => (
            <div 
              key={i}
              className="w-4 h-4 bg-indigo-600 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.1}s` }}
            ></div>
          ))}
        </div>
        <div className="text-gray-700 dark:text-gray-300">Loading your content, please wait...</div>
      </div>
    </div>
  );
};

export default Loader;