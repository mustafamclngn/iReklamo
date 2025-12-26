import React from "react";
import { NavLink } from "react-router-dom";
import IliganLogo from "./iliganLogo";

// CityAdminNavBar Component
const CityAdminNavBar = ({ onLogOut }) => {
  const links = ["Dashboard", "Complaints", "Barangays", "Officials", "Analytics", "Reports", "Account"];

  return (
    <nav className="bg-white py-6 font-[Inter] font-black">
      <div className="max-w-[1591px] mx-auto px-8 flex justify-between items-center">
        <IliganLogo />

        <ul className="flex items-center gap-5">
          {links.map((label) => (
            <li key={label}>
              <NavLink 
                to={`/cityadmin/${label.toLowerCase()}`}
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
          <li>
            <button
              onClick={onLogOut}
              className="text-base uppercase tracking-wide text-red-600 hover:text-red-800 transition"
            >
              Log Out
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default CityAdminNavBar;
