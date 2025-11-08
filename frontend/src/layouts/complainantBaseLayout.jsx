import React from "react";
import TopHeader from "../components/navheaders/topHeader";

const ComplainantBaseLayout = ({ NavBar, children }) => {
  return (
    <>
      <TopHeader />
      {NavBar && <NavBar />}
      <main>{children}</main>
    </>
  );
};

export default ComplainantBaseLayout;