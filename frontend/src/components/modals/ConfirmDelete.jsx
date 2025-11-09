import './modal.css'
import useUsersApi from "../../api/usersApi.js";
import { useState } from 'react';

import SuccessModal from './SuccessModal';
import ErrorModal from './ErrorModal';

const ConfirmDelete = ({ isOpen, onClose, onConfirm, assignedComplaints, revokeType, user }) => {

  const { revokePermissions, revokeAccount } = useUsersApi();

  // =============
  // Error and Success messages 
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
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
          <h2 className="title">Confirm</h2>
          <form className="form">
            <div className="form-group">
              <label>Are you sure you want to revoke {user.first_name} {user.last_name}'s {revokeType}?</label>
            </div>
            <div className="form-group">
              <label>Affected Assignments</label>
              <div className="complaint-list">
                {assignedComplaints.length > 0 ? (
                  <ol>
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
            <div className="popup-footer">
                <button type="button" className="revoke-button" onClick={handleRevoke}>
                  Revoke {revokeType}
                </button>
              <button type="button" className="okay-button" onClick={onClose}>
                Cancel
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
        onConfirm={handleConfirm}
        message={errMsg}
      />
    </>
  )
};

export default ConfirmDelete;
