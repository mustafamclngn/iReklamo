import React from "react";
import { NavLink } from "react-router-dom";

// BarangayCapNavBar Component
const BarangayCapNavBar = () => {
  const links = ["Dashboard", "Complaints", "Officials", "Reports", "Account"];

  return (
    <nav className="bg-white py-6 font-[Inter] font-bold">
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
                to={`/brgycap/${label.toLowerCase()}`}
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

export default BarangayCapNavBar;
