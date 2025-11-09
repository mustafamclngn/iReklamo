import React from 'react';

const statusColors = {
  Pending: "#FFB300",
  "In-Progress": "#FFD600",
  Resolved: "#43B174",
};

const priorityColors = {
  Urgent: "#C00F0C",
  Moderate: "#FB8500",
  Low: "#43B174",
};

const ComplaintCardBrgyOff = ({
  complaint,
  onViewDetails,
  onStatusUpdate,
  onPriorityUpdate
}) => {
  return (
    <div className="border border-gray-200 rounded-sm p-6 shadow-md hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        {/* LEFT SIDE - PRIORITY + INFO */}
        <div className="flex gap-4 items-start">
          {/* Priority Indicator */}
          <button
            onClick={() => onPriorityUpdate(complaint)}
            className="flex items-center justify-center flex-shrink-0 bg-transparent border-0 p-0 cursor-pointer hover:opacity-80 transition-opacity mt-1"
            style={{ width: "20px", height: "20px" }}
            title={complaint.priority}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M18.4212 10.0002C18.4212 14.651 14.651 18.4212 10.0002 18.4212C5.34933 18.4212 1.5791 14.651 1.5791 10.0002C1.5791 5.34933 5.34934 1.5791 10.0002 1.5791C14.651 1.5791 18.4212 5.34934 18.4212 10.0002Z" fill={priorityColors[complaint.priority]}/>
            </svg>
          </button>

          {/* Complaint Info */}
          <div className="flex-1">
            <p className="text-xl font-bold mb-1">{complaint.complaint_code}</p>
            <h3 className="text-gray-500 text-sm font-medium mb-2">{complaint.title}</h3>
          </div>
        </div>

        {/* RIGHT SIDE - ACTIONS (NO ASSIGN BUTTON) */}
        <div className="flex items-center gap-2">
          {/* View Details Button */}
          <button 
            onClick={() => onViewDetails(complaint)}
            className="px-4 py-2 bg-[#E3E3E3] text-black rounded-lg border border-[#767676] hover:bg-gray-200 transition-colors"
            style={{ height: "40px" }}
          >
            View Details
          </button>
          
          {/* Status Badge */}
          <button
            onClick={() => onStatusUpdate(complaint)}
            className="font-semibold transition-colors px-3 py-2 rounded-lg text-white whitespace-nowrap"
            style={{
              minWidth: "100px",
              height: "40px",
              backgroundColor: statusColors[complaint.status] || "#AEAEAE",
            }}
            title="Click to change status"
          >
            {complaint.status}
          </button>

          {/* NO ASSIGN OFFICIAL BUTTON - Barangay Officials don't have this permission */}
        </div>
      </div>
    </div>
  );
};

export default ComplaintCardBrgyOff;
