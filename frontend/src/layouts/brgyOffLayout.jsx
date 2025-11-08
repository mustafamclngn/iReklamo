import React from "react";
import {Outlet} from "react-router-dom";
import BaseLayout from "./baseLayout";
import BarangayOffNavBar from "../components/navheaders/navbarBrgyOff";

const BarangayOffLayout = () => {
  return (
    <BaseLayout NavBar = { BarangayOffNavBar }>
      <Outlet />
    </BaseLayout>
  );
};

export default BarangayOffLayout;