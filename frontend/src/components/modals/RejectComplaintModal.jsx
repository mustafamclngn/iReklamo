import './modal.css';
import { useState } from 'react';
import ConfirmRejectModal from './ConfirmRejectModal';

const RejectComplaintModal = ({ isOpen, onClose, complaint, onConfirm }) => {
  const [rejectionReason, setRejectionReason] = useState('');
  const [validationError, setValidationError] = useState('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleNextStep = () => {
    if (!rejectionReason.trim()) {
      setValidationError('Please provide a reason for rejection');
      return;
    }
    setValidationError('');
    setIsConfirmOpen(true);
  };

  const handleConfirmSuccess = () => {
    setIsConfirmOpen(false);
    onClose();
    onConfirm();
  };

  const handleClose = () => {
    setRejectionReason('');
    setValidationError('');
    onClose();
  };

  const handleReasonChange = (e) => {
    setRejectionReason(e.target.value);
    if (validationError) setValidationError('');
  };

  if (!isOpen || !complaint) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button onClick={handleClose} className="popup-close">✕</button>
        <h2 className="title">Reject Complaint</h2>
        <p className="subtitle">Provide a reason for rejecting this complaint.</p>

        <div className="form">
          <div className="form-group">
            <label>Complaint Summary</label>
            <div className="user-summary">
              <p><strong>Code:</strong> {complaint.complaint_code}</p>
              <p><strong>Title:</strong> {complaint.title}</p>
              <p><strong>Barangay:</strong> {complaint.barangay || 'N/A'}</p>
              <p><strong>Status:</strong> {complaint.status}</p>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="rejectionReason">Reason for Rejection</label>
            <textarea
              id="rejectionReason"
              value={rejectionReason}
              onChange={handleReasonChange}
              placeholder="Please explain why this complaint must be rejected..."
              rows="4"
              style={{
                width: '100%',
                padding: '0.625rem',
                border: `1px solid ${validationError ? '#ef4444' : '#d1d5db'}`,
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontFamily: 'inherit',
                resize: 'none'
              }}
              required
            />
            {validationError && (
              <p className="instructions" style={{color: '#ef4444'}}>
                <i className="bi bi-exclamation-circle"></i> {validationError}
              </p>
            )}
          </div>

          <div className="user-summary" style={{backgroundColor: '#fffbeb', borderColor: '#fcd34d'}}>
            <p style={{color: '#92400e', fontSize: '0.8rem'}}>
              <strong>⚠️ Important:</strong> Rejected complaints cannot be reassigned or further processed.
            </p>
          </div>

          <div className="popup-footer">
            <button type="button" className="revoke-button" onClick={handleClose}>
              Cancel
            </button>
            <button type="button" className="okay-button" onClick={handleNextStep} style={{backgroundColor: '#ef4444'}}>
              Next: Confirm Rejection
            </button>
          </div>
        </div>
      </div>

      <ConfirmRejectModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmSuccess}
        complaint={complaint}
        rejectionReason={rejectionReason}
      />
    </div>
  );
};

export default RejectComplaintModal;