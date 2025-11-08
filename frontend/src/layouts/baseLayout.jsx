import React from "react";
import TopHeader from "../components/navheaders/topHeader";
import HeroBanner from "../components/navheaders/heroBanner";

const BaseLayout = ({ NavBar, CustomHeroBanner, children }) => {
  return (
    <>
      <TopHeader />                 {/* top header - shared by all */}
      {NavBar && <NavBar />}        {/* navigation bar - role-specific */}
      
                                    {/* custom hero banner for home */}
                                    {/* hero banner for admin users */}
      {CustomHeroBanner ? (         
        <CustomHeroBanner />
      ) : (
        <HeroBanner />
      )}
      
      <main>{children}</main>
    </>
  );
};

export default BaseLayout;