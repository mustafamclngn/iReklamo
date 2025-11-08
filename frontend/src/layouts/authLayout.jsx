import React from "react";
import { Outlet } from "react-router-dom";
import BaseLayout from "./baseLayout";
import AuthenticationNavBar from "../components/navheaders/navbarAuthentication";
import AuthBanner from "../components/navheaders/bannerAuthentication";

const AuthLayout = () => {

  return (
    <BaseLayout 
      NavBar={AuthenticationNavBar}
    >

      <AuthBanner>
        <Outlet />
      </AuthBanner>

    </BaseLayout>
  );
};

export default AuthLayout;