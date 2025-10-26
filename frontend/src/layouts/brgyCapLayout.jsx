import React from "react";
import {Outlet} from "react-router-dom";
import BaseLayout from "./baseLayout";
import BarangayCapNavBar from "../components/navbarBrgyCap";

const BarangayCapLayout = () => {
  return (
    <BaseLayout NavBar = { BarangayCapNavBar }>
      <Outlet />
    </BaseLayout>
  );
};

export default BarangayCapLayout;