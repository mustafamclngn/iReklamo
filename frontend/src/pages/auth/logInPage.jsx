import React from "react";
import "./auth.css";

const LoginPage = () => {
  return (
    <div className="auth-container">
      <h1 className="auth-title">iReklamo</h1>

      <div className="auth-form">
        <label className="auth-label">Username:</label>
        <input
          type="text"
          placeholder="Enter your username"
          className="auth-input"
        />

        <label className="auth-label">Password:</label>
        <input
          type="password"
          placeholder="Enter your password"
          className="auth-input"
        />

        <button className="auth-button">LOGIN</button>
      </div>
    </div>
  );
};

export default LoginPage;
