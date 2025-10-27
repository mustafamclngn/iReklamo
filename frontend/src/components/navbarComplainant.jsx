import React from "react";
import { NavLink, Link } from "react-router-dom";
import IliganLogo from "./iliganLogo";

// ComplainantNavBar Component
const ComplainantNavBar = () => {
  const links = ["Know Iligan", "For Residents", "For Businesses", "For Visitors", "Transparency", "News", "Events"];

  return (
    <nav className="bg-white py-6 font-[Inter] font-black">
      <div className="max-w-[1591px] mx-auto px-8 flex justify-between items-center">
        <IliganLogo />

        <ul className="flex items-center gap-8">
          {links.map((label) => (
            <li key={label}>
              <NavLink
                to={`/${label.toLowerCase()}`}
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

export default ComplainantNavBar;