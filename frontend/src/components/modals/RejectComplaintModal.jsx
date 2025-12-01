import './modal.css';
import { useState } from 'react';

const RejectComplaintModal = ({ isOpen, onClose, complaint, onConfirm }) => {
  const [rejectionReason, setRejectionReason] = useState('');

  const handleConfirm = () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    onConfirm(rejectionReason);
    setRejectionReason('');
  };

  const handleClose = () => {
    setRejectionReason('');
    onClose();
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
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Please explain why this complaint must be rejected..."
              rows="4"
              className="reason-textarea"
              required
            />
          </div>

          {/* Warning */}
          <div className="warning-box">
            <strong>⚠️ Important:</strong> This action will reject the complaint and mark it as invalid.
            Rejected complaints cannot be reassigned or further processed.
          </div>

          {/* Footer */}
          <div className="popup-footer">
            <button type="button" className="revoke-button" onClick={handleConfirm}>
              Confirm Rejection
            </button>
            <button type="button" className="okay-button" onClick={handleClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RejectComplaintModal;
