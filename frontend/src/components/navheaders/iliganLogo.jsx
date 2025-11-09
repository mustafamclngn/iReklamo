import React from "react";
import { Link } from "react-router-dom";

// Iligan Logo Component
const IliganLogo = () => {
  const links = ["Dashboard", "Complaints", "Officials", "Reports", "Account"];

  return (
        <Link to="/home" className="flex items-center gap-4">
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
        </Link>
  );
};

export default IliganLogo;
