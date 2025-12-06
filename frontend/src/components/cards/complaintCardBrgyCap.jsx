import React, { useEffect, useState } from 'react';

const statusColors = {
  Pending: "#FFB300",
  "In-Progress": "#FFD600",
  Resolved: "#43B174",
  Rejected: "#DC2626",
};

const priorityColors = {
  Urgent: "#C00F0C",
  Moderate: "#FB8500",
  Low: "#43B174",
};



const ComplaintCardBrgyCap = ({
  complaint,
  onViewDetails,
  onStatusUpdate,
  onPriorityUpdate,
  onAssignOfficial,
  onSelect,
  isSelected
}) => {

  return (
    <div className="border border-gray-200 rounded-sm p-6 shadow-md hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        {/* LEFT SIDE - PRIORITY + INFO */}
        <div className="flex gap-1 flex-1">
          <div className="w-16 h-32 flex items-center justify-start flex-shrink-0">
            <button
              onClick={() => onPriorityUpdate(complaint)}
              className="flex items-center justify-center bg-transparent border-0 p-0 cursor-pointer hover:opacity-80 transition-opacity"
              style={{ width: "20px", height: "20px" }}
              title={`Priority: ${complaint.priority}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M18.4212 10.0002C18.4212 14.651 14.651 18.4212 10.0002 18.4212C5.34933 18.4212 1.5791 14.651 1.5791 10.0002C1.5791 5.34933 5.34934 1.5791 10.0002 1.5791C14.651 1.5791 18.4212 5.34934 18.4212 10.0002Z" fill={priorityColors[complaint.priority]}/>
              </svg>
            </button>
          </div>

          {/* Complaint Info */}
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">{complaint.complaint_code}</h3>
            <p className="text-gray-600 mb-1">
              <span className="font-medium">Title:</span> {complaint.title}
            </p>
            <p className="text-gray-600 mb-1">
              <span className="font-medium">Barangay:</span> {complaint.barangay || 'N/A'}
            </p>
            <p className="text-gray-600 mb-1">
              <span className="font-medium">Assigned Official:</span> {complaint.assignedOfficial || 'Unassigned'}
            </p>
          </div>
        </div>

        {/* RIGHT SIDE - ACTIONS */}
        <div className="flex gap-2">
          {/* Status Badge */}
          <button
            onClick={() => onStatusUpdate(complaint)}
            className="px-4 py-2 font-medium transition-colors rounded-lg text-white whitespace-nowrap min-w-[120px]"
            style={{
              backgroundColor: statusColors[complaint.status] || "#AEAEAE",
            }}
            title="Click to change status"
          >
            {complaint.status}
          </button>

          {/* View Details Button */}
          <button 
            onClick={() => onViewDetails(complaint)}
            className="px-4 py-2 bg-[#E3E3E3] text-black rounded-lg border border-[#767676] hover:bg-gray-200 transition-colors"
          >
            View Details
          </button>
          
          {/* Assign Official Icon Button */}
          <button 
            onClick={() => onAssignOfficial(complaint)}
            className={`p-2 rounded-lg border transition-colors 
                ${complaint.status !== "Pending" 
                  ? "bg-gray-300 text-gray-400 border-gray-300 cursor-not-allowed"
                  : "bg-[#E3E3E3] text-gray-700 border-[#767676] hover:bg-gray-200"  
                }`}            
            title="Assign official to complaint"
            disabled={complaint.status !== "Pending"}
          >
            <i className="bi bi-person-check text-xl"></i>
          </button>

          {/* Select for Assignment */}
          <input
            type="checkbox"
            id="selectCheckbox"
            checked={complaint.status !== "Pending" && !!isSelected}
            onChange={(e) => onSelect(complaint, e.target.checked)}
            disabled={complaint.status !== "Pending"}
          />
        </div>
      </div>
    </div>
  );
};

export default ComplaintCardBrgyCap;
