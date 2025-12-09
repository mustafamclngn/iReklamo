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
    setIsConfirmOpen(true); // Open confirmation modal
  };

  const handleConfirmClose = () => {
    setIsConfirmOpen(false);
  };

  const handleConfirmSuccess = () => {
    // Close both modals and trigger parent callback
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
    // Clear validation error when user starts typing
    if (validationError) {
      setValidationError('');
    }
  };

  if (!isOpen || !complaint) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button onClick={handleClose} className="popup-close">✕</button>
        <h2 className="title">Reject Complaint</h2>

        <div className="form">
          {/* Complaint Summary */}
          <div className="form-group">
            <label>Complaint Summary</label>
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
              <div className="summary-row">
                <strong>Status:</strong> {complaint.status}
              </div>
            </div>
          </div>

          {/* Rejection Reason */}
          <div className="form-group">
            <label htmlFor="rejectionReason">Reason for Rejection <span className="required">*</span></label>
            <textarea
              id="rejectionReason"
              value={rejectionReason}
              onChange={handleReasonChange}
              placeholder="Please explain why this complaint must be rejected..."
              rows="4"
              className={`reason-textarea ${validationError ? 'error' : ''}`}
              required
            />
            {validationError && (
              <div style={{
                color: '#dc2626',
                fontSize: '14px',
                fontWeight: '500',
                marginTop: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <i className="bi bi-exclamation-circle"></i>
                {validationError}
              </div>
            )}
          </div>

          {/* Warning */}
          <div className="warning-box">
            <strong>⚠️ Important:</strong> This action will reject the complaint and mark it as invalid.
            Rejected complaints cannot be reassigned or further processed.
          </div>

          {/* Footer */}
          <div className="popup-footer">
            <button type="button" className="revoke-button" onClick={handleNextStep}>
              Next: Confirm Rejection
            </button>
            <button type="button" className="okay-button" onClick={handleClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmRejectModal
        isOpen={isConfirmOpen}
        onClose={handleConfirmClose}
        onConfirm={handleConfirmSuccess}
        complaint={complaint}
        rejectionReason={rejectionReason}
      />
    </div>
  );
};

export default RejectComplaintModal;
