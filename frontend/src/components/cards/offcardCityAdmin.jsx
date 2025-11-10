import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CityAdminOfficialCard = ({ official, onViewDetails, onUserAction }) => {
  const navigate = useNavigate();
  const fullName = `${official.first_name} ${official.last_name}`;
  const API_BASE_URL = 'http://localhost:5000'; // backend url
  const [imageError, setImageError] = useState(false);
  
  const hasValidImage = official.profile_picture && !imageError;
    
  const handleViewDetails = () => {
    const basePath = window.location.pathname.split('/').slice(0, 2).join('/');
    const targetPath = `${basePath}/officials/${official.user_id}`;
    navigate(targetPath);
  };

  return (
    <div className="border border-gray-200 rounded-sm p-6 shadow-md hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex gap-4">
          <div className={`w-32 h-32 bg-gray-200 ${hasValidImage ? 'border-0' : 'border-2 border-dashed border-gray-400'} rounded flex-shrink-0 flex items-center justify-center overflow-hidden`}>
            {hasValidImage ? (
              <img 
                src={`${API_BASE_URL}${official.profile_picture}`}
                alt={fullName}
                className="w-full h-full object-cover rounded"
                onError={() => setImageError(true)}
              />
            ) : (
              <i className="bi bi-person text-5xl text-gray-400"></i>
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">{fullName}</h3>
            <p className="text-gray-600 mb-1">
              <span className="font-medium">Email:</span> {official.email}
            </p>
            {official.barangay_name && (
              <p className="text-gray-600 mb-1">
                <span className="font-medium">Barangay:</span> {official.barangay_name}
              </p>
            )}
            {official.position && (
              <p className="text-gray-600 mb-1">
                <span className="font-medium">Position:</span> {official.position}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleViewDetails}
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