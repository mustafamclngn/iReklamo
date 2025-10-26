import React from "react";
import { Outlet } from "react-router-dom";
import BaseLayout from "./baseLayout";
import CityAdminNavBar from "../components/navbarCityAdmin";

const CityAdminLayout = () => {
  return (
    <BaseLayout NavBar = { CityAdminNavBar }>
      <Outlet />
    </BaseLayout>
  );
};

export default CityAdminLayout;