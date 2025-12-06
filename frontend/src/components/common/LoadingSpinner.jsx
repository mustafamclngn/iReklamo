import React from 'react';

const LoadingSpinner = ({ scale = 1, message = 'Loading...' }) => {
  return (
    <div className="text-center" style={{ zoom: scale }} >
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#E3E3E3]" style={{ zoom: scale }} ></div>
      {(message === "Loading...") && (<p className="mt-4 text-gray-600"  >{message}</p>)}
    </div>
  );
};

export default LoadingSpinner;