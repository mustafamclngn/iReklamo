import './modal.css'
import useUsersApi from "../../api/usersApi.js";
import { useState } from 'react';
import SuccessModal from './SuccessModal';
import ErrorModal from './ErrorModal';

const ConfirmDelete = ({ isOpen, onClose, onConfirm, assignedComplaints, revokeType, user }) => {

  const { revokePermissions, revokeAccount } = useUsersApi();

  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  
  if (!isOpen) return null;

  const handleRevoke = async () => {
    try {
      if (revokeType === "Permissions") {
        const response = await revokePermissions(user.user_id);
        setSuccessMessage(response.data.message);
        setIsSuccessOpen(true);
      } else if (revokeType === "Account") {
        const response = await revokeAccount(user.user_id);
        setSuccessMessage(response.data.message);
        setIsSuccessOpen(true);
      }
    } catch (error) {
      console.error("Revoke failed:", error);
      setErrMsg(error?.response?.data?.error || "An unexpected error occurred.");
      setIsErrorOpen(true);
    }
  };

  const handleConfirm = () => {
    onClose();
    onConfirm(revokeType);  
  };

  return (
    <>
      <div className="popup-overlay">
        <div className="confirm-content">
          <button onClick={onClose} className="popup-close">✕</button>
          <h2 className="title">Confirm Revocation</h2>
          <p className="subtitle">This action will affect {user.first_name} {user.last_name}'s access.</p>

          <form className="form">
            <div className="form-group">
              <label>Action</label>
              <div className="user-summary">
                 Revoke <strong>{revokeType}</strong> for {user.first_name} {user.last_name}
              </div>
            </div>

            <div className="form-group">
              <label>Affected Assignments</label>
              <div className="user-summary">
                {assignedComplaints.length > 0 ? (
                  <ol style={{paddingLeft: '1.2rem', margin: 0}}>
                    {assignedComplaints.map((complaint, index) => (
                      <li key={complaint.id}>
                        <strong>{index + 1}</strong>. <em>{complaint.title}</em>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="no-complaints">None</p>
                )}
              </div>
            </div>

            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="revokeCheck"
                checked={isConfirmed}
                onChange={() => setIsConfirmed((prev) => !prev)}
              />
              <label htmlFor="revokeCheck">
                I hereby confirm, by the management responsibilities bestowed upon me, 
                to revoke the <strong>{revokeType}</strong> of this user.
              </label>
            </div>

            <div className="popup-footer">
              <button type="button" className="revoke-button" onClick={onClose}>
                Cancel
              </button>
              <button 
                type="button" 
                className="okay-button" 
                onClick={handleRevoke} 
                disabled={!isConfirmed}
                style={{backgroundColor: '#ef4444'}}
              >
                Revoke {revokeType}
              </button>
            </div>
          </form>
        </div>
      </div>

      <SuccessModal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        onConfirm={handleConfirm}
        message={successMessage}
      />

      <ErrorModal
        isOpen={isErrorOpen}
        onClose={() => setIsErrorOpen(false)}
        message={errMsg}
      />
    </>
  )
};

export default ConfirmDelete;