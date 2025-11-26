import React from 'react';
import useLogOut from '../../hooks/useLogout';
import { useNavigate, Link } from 'react-router-dom';

const BC_AccountPage = () => {

  const logout = useLogOut();
  const navigate = useNavigate();

  const signout = async () => {
    await logout();
    navigate('/home');
  }


  return (
        <button 
        onClick={() => signout()}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
    >
        Log Out
    </button>
  );
}

export default BC_AccountPage;