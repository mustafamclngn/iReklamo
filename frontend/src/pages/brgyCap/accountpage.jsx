import React, {useState} from 'react';
import useLogOut from '../../hooks/useLogout';
import { useNavigate, Link } from 'react-router-dom';

const BC_AccountPage = () => {

  const logout = useLogOut();
  const navigate = useNavigate();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const signout = async () => {
    await logout();
    navigate('/home');
  }


  return (
    <>
      <button
          onClick={() => setIsConfirmOpen(true)}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
      >
          Log Out
      </button>
      
      <LogOutModal 
        isOpen={isConfirmOpen} 
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => signout()}
        >
      </LogOutModal>
    
    </>
  );
}

export default BC_AccountPage;