import React from "react";
import { NavLink } from "react-router-dom";

// BarangayOffNavBar Component
const BarangayOffNavBar = () => {
  const links = ["Dashboard", "Assigned Complaints", "Barangays", "Account"];

  return (
    <nav className="bg-white py-6 font-[Inter] font-black">
      <div className="max-w-[1591px] mx-auto px-8 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <img
            src="https://iligan.gov.ph/assets/img/iligancity-welcome-logo.png"
            alt="Iligan City Logo"
            className="h-14"
          />
          <img
            src="https://iligan.gov.ph/assets/img/logo-website.png"
            alt="Iligan City Seal"
            className="h-14"
          />
        </div>

        <ul className="flex items-center gap-5">
          {links.map((label) => (
            <li key={label}>
              <NavLink 
                to={`/brgyoff/${label.toLowerCase().replace(/ /g, '-')}`}
                className={({ isActive }) =>
                  `text-base uppercase tracking-wide transition-all duration-200 pb-2 ${
                    isActive
                      ? "text-[#578fe0] border-b-2 border-[#578fe0]"
                      : "text-black hover:text-[#578fe0]"
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default BarangayOffNavBar;
