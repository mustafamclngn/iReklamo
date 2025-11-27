import React from "react";
import { Link } from "react-router-dom";

// Iligan Logo Component
const IliganLogo = ({ scale = 1, mode = "default"}) => {
  return (
    <Link 
      to="/home"
      className={`flex items-center ${mode === "default" ? "gap-4" : "gap-1"}`}
      style={{ zoom: scale }}  
    >
      {mode === "login" && (
        <img
          src="https://iligan.gov.ph/assets/img/logo-website.png"
          alt="Iligan City Seal"
          className="h-10"
        />
      )}

      <img
        src="https://iligan.gov.ph/assets/img/iligancity-welcome-logo.png"
        alt="Iligan City Logo"
        className={mode === "login" ? "h-14" : "h-14"}
      />

      {mode === "default" && (
        <img
          src="https://iligan.gov.ph/assets/img/logo-website.png"
          alt="Iligan City Seal"
          className="h-14"
        />
      )}
    </Link>
  );
};


export default IliganLogo;