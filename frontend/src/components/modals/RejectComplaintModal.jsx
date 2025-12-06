import './modal.css';
import { useState } from 'react';
import useComplaintsApi from '../../api/complaintsAPI';

const RejectComplaintModal = ({ isOpen, onClose, complaint, onConfirm }) => {
  const { rejectComplaint } = useComplaintsApi();
  const [rejectionReason, setRejectionReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleConfirm = async () => {
    if (!rejectionReason.trim()) {
      setValidationError('Please provide a reason for rejection');
      return;
    }

    setValidationError('');
    setIsSubmitting(true);
    try {
      await rejectComplaint(complaint.id, rejectionReason);
      // Call the parent callback to trigger refetch and close modal
      onConfirm();
    } catch (error) {
      console.error('Rejection failed:', error);
      setValidationError('Failed to reject complaint. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
            <button type="button" className="revoke-button" onClick={handleConfirm} disabled={isSubmitting}>
              {isSubmitting ? 'Processing...' : 'Confirm Rejection'}
            </button>
            <button type="button" className="okay-button" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RejectComplaintModal;
