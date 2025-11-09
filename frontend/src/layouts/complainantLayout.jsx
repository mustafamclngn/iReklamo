import React from "react";
import { Outlet } from "react-router-dom";
import ComplainantBaseLayout from "./complainantBaseLayout";
import ComplainantNavBar from "../components/navheaders/navbarComplainant";

const ComplainantLayout = () => {
  return (
    <ComplainantBaseLayout NavBar = { ComplainantNavBar }>
      <Outlet />
    </ComplainantBaseLayout>
  );
};

export default ComplainantLayout;