import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import BaseLayout from "./baseLayout";
import ComplainantNavBar from "../components/navbarComplainant";
import HeroBannerHome from "../components/defaultBanner";
import Footer from "../components/footer";

const ComplainantHomeLayout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/" || location.pathname === "/home";

  return (
    <BaseLayout 
      NavBar={ComplainantNavBar}
      CustomHeroBanner={isHomePage ? HeroBannerHome : null}
    >
      <Outlet />
      <Footer />
    </BaseLayout>
  );
};

export default ComplainantHomeLayout;