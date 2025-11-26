import React from 'react';

const BO_AccountPage = () => {
    
  
  return (
    <button 
        onClick={() => console.log("Log Out")}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
    >
        Log Out
    </button>
    );
  }

export default BO_AccountPage;