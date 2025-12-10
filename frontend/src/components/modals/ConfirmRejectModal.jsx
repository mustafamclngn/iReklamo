import './modal.css';
import useComplaintsApi from '../../api/complaintsAPI.js';
import { useState } from 'react';
import SuccessModal from './SuccessModal';
import ErrorModal from './ErrorModal';

const ConfirmRejectModal = ({
  isOpen,
  onClose,
  onConfirm,
  complaint,
  rejectionReason
}) => {

  const { rejectComplaint } = useComplaintsApi();

  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);

  if (!isOpen || !complaint || !rejectionReason) return null;

  const handleReject = async () => {
    try {
      await rejectComplaint(complaint.id, rejectionReason);
      setSuccessMessage('Complaint rejected successfully');
      setIsSuccessOpen(true);
    } catch (error) {
      console.error('Reject failed:', error);
      setErrMsg(error?.response?.data?.error || 'An unexpected error occurred while rejecting the complaint.');
      setIsErrorOpen(true);
    }
  };

  const handleConfirm = () => {
    onClose();
    onConfirm();
  };

  return (
    <>
      <div className="popup-overlay">
        <div className="confirm-content">
          <button onClick={onClose} className="popup-close">✕</button>
          <h2 className="title">Confirm Rejection</h2>
          <p className="subtitle">Are you sure you want to reject this complaint?</p>
          
          <form className="form">
            <div className="form-group">
              <label>Complaint Details</label>
              <div className="user-summary">
                <p><strong>Code:</strong> {complaint.complaint_code}</p>
                <p><strong>Title:</strong> {complaint.title}</p>
                <p><strong>Barangay:</strong> {complaint.barangay || 'N/A'}</p>
              </div>
            </div>

            <div className="form-group">
              <label>Rejection Reason</label>
              <div className="user-summary" style={{fontStyle: 'italic'}}>
                {rejectionReason}
              </div>
            </div>

            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="rejectCheck"
                checked={isConfirmed}
                onChange={() => setIsConfirmed((prev) => !prev)}
              />
              <label htmlFor="rejectCheck">
                I hereby confirm that this complaint must be rejected for the stated reason.
              </label>
            </div>

            <div className="popup-footer">
              <button type="button" className="revoke-button" onClick={onClose}>
                Cancel
              </button>
              <button 
                type="button" 
                className="okay-button" 
                onClick={handleReject} 
                disabled={!isConfirmed}
                style={{backgroundColor: '#ef4444'}}
              >
                Reject Complaint
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
  );
};

export default ConfirmRejectModal;