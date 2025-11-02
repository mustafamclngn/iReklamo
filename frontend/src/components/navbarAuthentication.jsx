import React from "react";
import { NavLink, Link } from "react-router-dom";
import IliganLogo from "./iliganLogo";

// AuthenticationNavBar Component
const AuthenticationNavBar = () => {

  return (
    <nav className="bg-white py-6 font-[Inter] font-black">
      <div className="max-w-[1591px] mx-auto px-8 flex justify-between items-center">
        <IliganLogo />
      </div>
    </nav>
  );
};

export default AuthenticationNavBar;