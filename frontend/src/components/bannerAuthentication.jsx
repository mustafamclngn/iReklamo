import React from "react";

const AuthBanner = ({ children }) => {
  return (
    <div
      className="relative w-[90%] max-w-[1591px] bg-cover bg-center flex items-center justify-center px-8 mx-[5%] overflow-hidden"
      style={{
        height: '90vh',
        flexShrink: 0,
        borderRadius: '30px',
        backgroundImage:
          `linear-gradient(0deg, rgba(50, 99, 108, 0.2), rgba(70, 136, 148, 0.2)), url("/images/auth.jpg")`,
        backgroundPosition: "center",
      }}
    >
      <div className="relative z-10 text-center">
        {children}
      </div>

    </div>
  );
};

export default AuthBanner;
