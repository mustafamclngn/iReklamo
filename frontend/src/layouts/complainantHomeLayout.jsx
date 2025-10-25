import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import BaseLayout from "./baseLayout";
import ComplainantNavBar from "../components/navbarComplainant";
import HeroBannerHome from "../components/defaultBanner";

const ComplainantHomeLayout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/" || location.pathname === "/home";

  return (
    <BaseLayout 
      NavBar={ComplainantNavBar}
      CustomHeroBanner={isHomePage ? HeroBannerHome : null}
    >
      <Outlet />
    </BaseLayout>
  );
};

export default ComplainantHomeLayout;