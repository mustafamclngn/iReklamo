import React from "react";

const RegisterPage = () => {
  return (
    <>
      <h1 className="text-5xl font-bold text-[#FBBF24] mb-6">iReklamo</h1>
      <div className="text-left">
        <label className="block text-gray-800 font-semibold mb-2">
          Username:
        </label>
        <input
          type="text"
          placeholder="Enter your username"
          className="w-full p-2 border rounded mb-4"
        />

        <label className="block text-gray-800 font-semibold mb-2">
          Password:
        </label>
        <input
          type="password"
          placeholder="Enter your password"
          className="w-full p-2 border rounded mb-6"
        />

        <button className="w-full bg-[#4FC3F7] hover:bg-[#039BE5] text-white font-semibold py-2 rounded">
          REGISTER
        </button>
      </div>
    </>
  );
};

export default RegisterPage;
