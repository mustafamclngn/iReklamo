import React from 'react';

const CityAdminOfficialCard = ({ official, onViewDetails, onUserAction }) => {
  const fullName = `${official.first_name} ${official.last_name}`;
  
  return (
    <div className="border border-gray-200 rounded-sm p-6 shadow-md hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold mb-2">{fullName}</h3>
          <p className="text-gray-600 mb-1">
            <span className="font-medium">Email:</span> {official.email}
          </p>
          {official.barangay && (
            <p className="text-gray-600 mb-1">
              <span className="font-medium">Barangay:</span> {official.barangay}
            </p>
          )}
          {official.position && (
            <p className="text-gray-600 mb-1">
              <span className="font-medium">Position:</span> {official.position}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => onViewDetails && onViewDetails(official)}
            className="px-4 py-2 bg-[#E3E3E3] text-black rounded-lg border border-[#767676] hover:bg-gray-200 transition-colors"
          >
            View Details
          </button>
          <button 
            onClick={() => onUserAction && onUserAction(official)}
            className="p-2 bg-[#E3E3E3] text-gray-700 rounded-lg border border-[#767676] hover:bg-gray-200 transition-colors"
            title="Assign official to complaint"
          >
            <i className="bi bi-person-check text-xl"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CityAdminOfficialCard;