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

  // Form states
  const [selectedStatus, setSelectedStatus] = useState(complaint?.status || '');
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);

  // Modal states
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Status options based on user role
  const brgyOfficialStatuses = ['Pending', 'In-Progress', 'Resolved'];
  const brgyCaptainStatuses = ['Pending', 'In-Progress', 'Resolved', 'Rejected'];

  // Available statuses for current user
  const availableStatuses = userRole === 3 ? brgyCaptainStatuses : brgyOfficialStatuses;

  // Prevent reverting from closed statuses (Resolved/Rejected)
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

    // Don't submit if status hasn't changed
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
          <h2 className="title">Update Complaint Status</h2>

          <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <h3 className="font-medium text-gray-900">{complaint.title}</h3>
            <p className="text-sm text-gray-600">Complaint ID: {complaint.complaint_code}</p>
            <p className="text-sm text-gray-600">Current Status: {currentStatus}</p>
          </div>

          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label>New Status *</label>
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
                <p className="text-sm text-orange-600 mt-1">
                  This complaint is closed. Only the current status is available.
                </p>
              )}
            </div>

            <div className="form-group">
              <label>Remarks *</label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Explain the status change..."
                required
                rows={4}
                maxlength="500"
                className="w-full p-2 border border-gray-300 rounded-md resize-none"
              ></textarea>
              <p className="text-sm text-gray-500 mt-1">
                {remarks.length}/500 characters
              </p>
            </div>

            <div className="popup-footer">
              <button
                type="submit"
                className="okay-button"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Status'}
              </button>
              <button type="button" onClick={onClose} className="revoke-button">Cancel</button>
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
