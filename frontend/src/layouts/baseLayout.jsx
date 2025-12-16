import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopHeader from "../components/navheaders/topHeader";
import HeroBanner from "../components/navheaders/heroBanner";
import useLogOut from "../hooks/useLogOut";
import LogOutModal from "../components/modals/ConfirmLogOut";

const BaseLayout = ({ NavBar, CustomHeroBanner, children }) => {
  
  const logout = useLogOut();
  const navigate = useNavigate();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const signout = async () => {
    await logout();
    navigate('/home');
  }

  return (
    <>
      <TopHeader />                 {/* top header - shared by all */}
      {NavBar && <NavBar onLogOut={() => {console.log("Confirm Log Out pressed"); setIsConfirmOpen(true)}}/>}        {/* navigation bar - role-specific */}
      
                                    {/* custom hero banner for home */}
                                    {/* hero banner for admin users */}
      {CustomHeroBanner ? (         
        <CustomHeroBanner />
      ) : (
        <HeroBanner />
      )}
      
      <LogOutModal 
        isOpen={isConfirmOpen} 
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => signout()}
        >
      </LogOutModal>

      <main>{children}</main>
    </>
  );
};

export default BaseLayout;