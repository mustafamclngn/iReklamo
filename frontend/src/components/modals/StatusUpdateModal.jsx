import './modal.css';
import { useState } from 'react';
import useComplaintsApi from '../../api/complaintsAPI';
import useAuth from '../../hooks/useAuth';
import SuccessModal from './SuccessModal';
import ErrorModal from './ErrorModal';

const StatusUpdateModal = ({ isOpen, onClose, complaint, onRefresh }) => {
  const { auth } = useAuth();
  const userRole = auth?.role?.[0];
  const { updateStatus } = useComplaintsApi();

  const [selectedStatus, setSelectedStatus] = useState(complaint?.status || '');
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);

  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const brgyOfficialStatuses = ['Pending', 'In-Progress', 'Resolved'];
  const brgyCaptainStatuses = ['Pending', 'In-Progress', 'Resolved'];
  const availableStatuses = userRole === 3 ? brgyCaptainStatuses : brgyOfficialStatuses;

  const currentStatus = complaint?.status;
  const isComplaintClosed = currentStatus === 'Resolved' || currentStatus === 'Rejected';
  const filteredStatuses = isComplaintClosed
    ? availableStatuses.filter(status => status === currentStatus)
    : availableStatuses;

  if (!isOpen || !complaint) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedStatus) {
      setErrMsg('Please select a status.');
      setIsErrorOpen(true);
      return;
    }

    if (!remarks.trim()) {
      setErrMsg('Remarks are required for status changes.');
      setIsErrorOpen(true);
      return;
    }

    if (selectedStatus === currentStatus && !remarks.trim()) {
      setErrMsg('Please provide remarks or select a different status.');
      setIsErrorOpen(true);
      return;
    }

    setLoading(true);
    try {
      const response = await updateStatus(complaint.id, selectedStatus, remarks.trim());
      if (response.success) {
        setSuccessMessage(`Status updated to ${selectedStatus} successfully.`);
        setIsSuccessOpen(true);
      } else {
        setErrMsg(response.message || 'Failed to update status.');
        setIsErrorOpen(true);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      setErrMsg('Network error. Please try again.');
      setIsErrorOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessConfirm = () => {
    setIsSuccessOpen(false);
    onRefresh?.();
    onClose();
  };

  return (
    <>
      <div className="popup-overlay">
        <div className="popup-content">
          <button onClick={onClose} className="popup-close">✕</button>
          <h2 className="title">Update Status</h2>
          <p className="subtitle">Change the status of this complaint.</p>

          <div className="form-group" style={{marginBottom: '1rem'}}>
            <div className="user-summary">
              <p><strong>Complaint:</strong> {complaint.title}</p>
              <p><strong>ID:</strong> {complaint.complaint_code}</p>
              <p><strong>Current Status:</strong> {currentStatus}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label>New Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                required
              >
                <option value="">Select Status</option>
                {filteredStatuses.map(status => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              {isComplaintClosed && (
                <p className="instructions" style={{color: '#d97706'}}>
                   This complaint is closed. Only the current status is available.
                </p>
              )}
            </div>

            <div className="form-group">
              <label>Remarks</label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Explain the status change..."
                required
                rows={4}
                maxLength="500"
                style={{
                  width: '100%',
                  padding: '0.625rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  resize: 'none',
                  fontFamily: 'inherit'
                }}
              ></textarea>
              <p className="instructions">
                {remarks.length}/500 characters
              </p>
            </div>

            <div className="popup-footer">
              <button type="button" onClick={onClose} className="revoke-button">Cancel</button>
              <button
                type="submit"
                className="okay-button"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <SuccessModal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        onConfirm={handleSuccessConfirm}
        message={successMessage}
      />

      <ErrorModal
        isOpen={isErrorOpen}
        onClose={() => setIsErrorOpen(false)}
        onConfirm={() => setIsErrorOpen(false)}
        message={errMsg}
      />
    </>
  );
};

export default StatusUpdateModal;