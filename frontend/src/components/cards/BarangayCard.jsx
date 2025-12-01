import React from "react";
import { Phone, Mail, Users } from "lucide-react";

const BarangayCard = ({ barangay, onClick }) => {
  return (
    <div
      className="
        w-80 bg-gray-200 rounded-xl shadow-lg hover:shadow-xl 
        transition-all duration-300 
        overflow-hidden border border-gray-300 relative
        hover:scale-105 cursor-pointer
      "
      onClick={() => onClick && onClick(barangay)}
    >
      <div
        className="absolute inset-0 opacity-[0.1] pointer-events-none"
        style={{
          backgroundImage: 'url("/images/iligancityseal.png")',
          backgroundPosition: "center",
          backgroundSize: "140px",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* main content */}
      <div className="relative z-10 p-5">
        <h2 className="text-2xl font-bold text-black mb-2">
          {barangay.barangay_name}
        </h2>
        <p className="text-sm text-black font-normal uppercase mb-4 tracking-wide">
          {barangay.captain_name || "No Captain Assigned"}
        </p>
        <div className="space-y-1 text-sm text-black">
          <div className="flex items-center">
            <Phone className="h-4 w-4 mr-2 text-black flex-shrink-0" />
            <span>{barangay.captain_contact || "No contact number yet"}</span>
          </div>
          {barangay.captain_email && (
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-2 text-black flex-shrink-0" />
              <span className="break-all">{barangay.captain_email}</span>
            </div>
          )}
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-2 text-black flex-shrink-0" />
            <span>
              Population (2024):{" "}
              {barangay.barangayCensus?.toLocaleString() || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarangayCard;
