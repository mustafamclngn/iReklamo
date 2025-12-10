import './modal.css';
import useComplaintsApi from '../../api/complaintsAPI.js';
import { useState } from 'react';
import SuccessModal from './SuccessModal';
import ErrorModal from './ErrorModal';
import useLockBodyScroll from '../../hooks/useLockBodyScroll';

const ConfirmRejectModal = ({
  isOpen,
  onClose,
  onConfirm,
  complaint,
  rejectionReason
}) => {

  useLockBodyScroll(isOpen);

  const { rejectComplaint } = useComplaintsApi();

  // Error and Success messages
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Checkbox confirmation
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
          <form className="form">
            <div className="form-group">
              <label>
                Are you sure you want to reject this complaint? This action cannot be undone.
              </label>
            </div>

            {/* Complaint Details */}
            <div className="form-group">
              <label>Complaint Details</label>
              <div className="complaint-summary">
                <div className="summary-row">
                  <strong>Code:</strong> {complaint.complaint_code}
                </div>
                <div className="summary-row">
                  <strong>Title:</strong> {complaint.title}
                </div>
                <div className="summary-row">
                  <strong>Barangay:</strong> {complaint.barangay || 'N/A'}
                </div>
              </div>
            </div>

            {/* Rejection Reason Preview */}
            <div className="form-group">
              <label>Rejection Reason</label>
              <div className="reason-preview">
                {rejectionReason}
              </div>
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={isConfirmed}
                  onChange={() => setIsConfirmed((prev) => !prev)}
                />
                <span>
                  I hereby confirm that this complaint must be rejected for the stated reason.
                </span>
              </label>
            </div>

            <div className="popup-footer">
              <button type="button" className="revoke-button" onClick={handleReject} disabled={!isConfirmed}>
                Reject Complaint
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
  );
};

export default ConfirmRejectModal;
