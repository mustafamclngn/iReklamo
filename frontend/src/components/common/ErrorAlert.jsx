import React from 'react';

const ErrorAlert = ({ error, onRetry }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
      <div className="flex items-center">
        <i className="bi bi-exclamation-triangle text-red-600 text-xl mr-3"></i>
        <div>
          <p className="text-red-800 font-medium">{error}</p>
          {onRetry && (
            <button 
              onClick={onRetry}
              className="text-red-600 underline text-sm mt-1 hover:text-red-700"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorAlert;