import React from "react";
import { Outlet } from "react-router-dom";
import BaseLayout from "./baseLayout";
import SuperAdminNavBar from "../components/navbarSuperAdmin";

const SuperAdminLayout = () => {
  return (
    <BaseLayout NavBar = { SuperAdminNavBar }>
      <Outlet />
    </BaseLayout>
  );
};

export default SuperAdminLayout;