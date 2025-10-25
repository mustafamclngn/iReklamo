import React from "react";
import TopHeader from "../components/topHeader";
import HeroBanner from "../components/heroBanner";

const BaseLayout = ({ NavBar, children }) => {
  return (
    <>
      <TopHeader />                 {/* top header - shared by all */}
      {NavBar && <NavBar />}        {/* navigation bar - role-specific */}
      <HeroBanner />                {/* hero banner - role and page specific */}
      <main>{children}</main>
    </>
  );
};

export default BaseLayout;