import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useComplaintsApi from '../../api/complaintsAPI';
import useAuth from '../../hooks/useAuth';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getRoleBasePath } from '../../utils/roleUtils';
import AssignActionModal from '../../components/modals/AssignActionModal';
import RejectComplaintModal from '../../components/modals/RejectComplaintModal';
import SetPriorityModal from '../../components/modals/SetPriorityModal';
import Toast from '../../components/common/Toast';


const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const getDaysSinceFiled = (dateString) => {
  if (!dateString) return 'N/A';
  const filedDate = new Date(dateString);
  const now = new Date();
  const filedDateStart = new Date(filedDate.getFullYear(), filedDate.getMonth(), filedDate.getDate());
  const nowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffTime = nowStart - filedDateStart;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return 'N/A';
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return '1 day ago';
  return `${diffDays} days ago`;
};

// Helpers for masking PII
const maskEmail = (email) => {
  if (!email) return 'N/A';
  const [user, domain] = email.split('@');
  if (!user || !domain) return email;
  const maskedUser = user[0] + user.slice(1).replace(/./g, '*');
  return `${maskedUser}@${domain}`;
};

const maskPhone = (phone) => {
  if (!phone) return 'N/A';
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 4) return '****';
  return phone.replace(/\d(?=\d{4})/g, '*');
};

const formatPhone = (num) => {
  if (!num) return 'N/A';
  const digits = num.replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('09')) {
    return `+63 ${digits.slice(1, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return num;
};

const statusColors = {
  Pending: "#FFB300",
  "In-Progress": "#FFD600",
  Resolved: "#43B174",
  Rejected: "#DC2626"
};
const priorityColors = {
  Urgent: "#C00F0C",
  Moderate: "#FB8500",
  Low: "#43B174"
};

const ComplaintDetailsPage = () => {
  const { complaint_id } = useParams();
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { getComplaintById, updateComplaint } = useComplaintsApi();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [isPriorityOpen, setIsPriorityOpen] = useState(false);

  const [refresh, setRefresh] = useState(false);

  // toast state
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Assign
  // Assign
  const handleAssign = () => {
    setIsAssignOpen(true);
  };

  // Reject handlers
  const handleReject = () => {
    setIsRejectOpen(true);
  };

  const handleRejectConfirm = () => {
    // Update local complaint state to rejected
    setComplaint(prev => prev ? { ...prev, status: 'Rejected' } : null);

    // Close the rejection modal and show success toast
    setIsRejectOpen(false);
    setToastMessage('Complaint rejected successfully!');
    setToastVisible(true);

    // Trigger refetch after a delay
    setTimeout(() => {
      setRefresh(prev => !prev);
    }, 1000);
  };

  // Priority handlers
  const handlePriorityClick = () => {
    if (canEditPriority) {
      setIsPriorityOpen(true);
    }
  };

  const handlePriorityUpdate = async (updatedComplaint) => {
    // Update local complaint state
    setComplaint(prev => ({ ...prev, ...updatedComplaint }));

    // Close modal and show success toast
    setIsPriorityOpen(false);
    setToastMessage('Priority updated successfully');
    setToastVisible(true);

    // Trigger refetch after a delay
    setTimeout(() => {
      setRefresh(prev => !prev);
    }, 1000);
  };

  useEffect(() => { fetchComplaintDetails(); }, [complaint_id, refresh, isAssignOpen]);
  const fetchComplaintDetails = async () => {
    setLoading(true);
    if (!complaint_id || isNaN(Number(complaint_id))) {
      const basePath = getRoleBasePath(auth);
      navigate(`${basePath}/complaints`, { replace: true });
      return;
    }
    const response = await getComplaintById(complaint_id);
    if (response.success && response.data) setComplaint(response.data);
    else navigate(`${getRoleBasePath(auth)}/complaints`, { replace: true });
    setLoading(false);
  };

  if (loading) return <LoadingSpinner message="Loading complaint details..." />;

  const userRole = auth?.role?.[0];
  const canEditPriority = userRole === 2 || userRole === 3; // Only City Admin and Brgy Captain can set priority
  const canEdit = userRole === 1 || userRole === 2 || userRole === 3; // For status and assignment (including superadmin)



  // Complainant info logic - backend already handles role-based filtering
  const isAnonymous = complaint?.is_anonymous || false;

  const isAssignedToYou =
    complaint?.assigned_official_id === auth?.id ||
    complaint?.assignedOfficialId === auth?.id ||
    false;

  // Use backend-provided data directly (it already applies role-based filtering)
  const rawFullName = `${complaint.complainant_first_name || ''} ${complaint.complainant_last_name || ''}`.trim();
  const displayName = rawFullName || 'N/A';
  const rawEmail = complaint.complainant_email || '';
  const rawPhone = complaint.complainant_contact_number || '';
  // Email and contact are NEVER censored - needed for communication
  const displayEmail = rawEmail || 'N/A';
  const displayPhone = formatPhone(rawPhone) || 'N/A';

  return (
    <>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-[1591px] mx-auto px-8 py-8">
          {/* Back Button */}
          <button
            onClick={() => {
              const basePath = getRoleBasePath(auth);
              const complaintsPath = userRole === 4 ? 'assigned-complaints' : 'complaints';
              navigate(`${basePath}/${complaintsPath}`);
            }}
            className="w-[337px] h-[45px] bg-white hover:bg-[#E6E6E6] text-black rounded-lg flex items-center justify-center gap-x-3 text-[24px] font-small mb-6 transition-colors"
          >
            <i className="bi bi-arrow-left text-xl"></i>
            Back to Complaints
          </button>
          
                    {/* main complaint summary */}
                    <div className="bg-white rounded-lg shadow-lg border border-[#B5B5B5] p-8 mb-6">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
                          Complaint Details
                        </h2>
                      </div>
                      <hr className="border-t border-gray-200 mt-4 mb-6" />
                      <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                        <div>
                          <label className="block text-md text-gray-600 mb-2">Complaint ID:</label>
                          <p className="text-gray-900 font-medium text-lg flex items-center gap-2">
                            {complaint.complaint_code}
                            <button
                              className="ml-3 px-2 py-1 text-xs rounded bg-gray-200 hover:bg-gray-300"
                              onClick={() => navigator.clipboard.writeText(complaint.complaint_code)}
                            >
                              Copy ID
                            </button>
                          </p>
                        </div>
                        <div>
                          <label className="block text-md text-gray-600 mb-2">Complaint Title:</label>
                          <p className="text-gray-900 font-medium text-lg">{complaint.title}</p>
                        </div>
                        <div>
                          <label className="block text-md text-gray-600 mb-2">Case Type:</label>
                          <p className="text-gray-900 font-medium text-lg">{complaint.case_type}</p>
                        </div>
                        <div>
                          <label className="block text-md text-gray-600 mb-2">Date Filed:</label>
                          <p className="text-gray-900 font-medium text-lg">{formatDate(complaint.created_at)}</p>
                        </div>
                        <div>
                          <label className="block text-md text-gray-600 mb-2">Description:</label>
                          <p className="text-gray-900 font-medium text-lg leading-relaxed">{complaint.description || "N/A"}</p>
                        </div>
                      </div>
                    </div>
          
                    {/* complainant information */}
                    <div className="bg-white rounded-lg shadow-lg border border-[#B5B5B5] p-8 mb-6">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
                          Complainant Information
                        </h2>
                      </div>
                      <hr className="border-t border-gray-200 mt-4 mb-6" />
                      {isAnonymous && (
                        <div className="mb-4 px-4 py-3 rounded-md bg-yellow-50 text-white-800 border border-yellow-200">
                          This complaint is filed as Anonymous.
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                        <div>
                          <label className="block text-md text-gray-600 mb-2">Name:</label>
                          <p className="text-gray-900 font-medium text-lg">{displayName}</p>
                        </div>
                        <div>
                          <label className="block text-md text-gray-600 mb-2">Email:</label>
                          <p className="text-gray-900 font-medium text-lg">{displayEmail}</p>
                        </div>
                        <div>
                          <label className="block text-md text-gray-600 mb-2">Phone:</label>
                          <p className="text-gray-900 font-medium text-lg">{displayPhone}</p>
                        </div>
                      </div>
                    </div>
          
                    {/* complaint location */}
                    <div className="bg-white rounded-lg shadow-lg border border-[#B5B5B5] p-8 mb-6">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
                          Complaint Location
                        </h2>
                      </div>
                      <hr className="border-t border-gray-200 mt-4 mb-6" />
                      <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                        <div>
                          <label className="block text-md text-gray-600 mb-2">Barangay:</label>
                          <p className="text-gray-900 font-medium text-lg">{complaint.barangay || "N/A"}</p>
                        </div>
                        <div>
                          <label className="block text-md text-gray-600 mb-2">Specific Location:</label>
                          <p className="text-gray-900 font-medium text-lg">{complaint.specific_location || "N/A"}</p>
                        </div>
                        <div className="col-span-2">
                          <label className="block text-md text-gray-600 mb-2">Full Address:</label>
                          <p className="text-gray-900 font-medium text-lg">{complaint.full_address || "N/A"}</p>
                        </div>
                      </div>
                    </div>
          
                    {/* complaint status */}
                    <div className="bg-white rounded-lg shadow-lg border border-[#B5B5B5] p-8">
                      <div className="flex justify-between items-center mb-2">
                        <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
                          Complaint Status
                        </h2>
                        {canEdit && (
                          <div className="flex gap-4">
                            <button
                              className="px-8 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-lg flex items-center gap-2 font-medium"
                              onClick={handleReject}
                              disabled={complaint.status === 'Rejected' || complaint.status === 'Resolved'}
                            >
                              <i className="bi bi-x-circle text-lg"></i>
                              Reject Complaint
                            </button>
                            <button
                              className="px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-lg flex items-center gap-2 font-medium"
                              onClick={handleAssign}>
                              <i className="bi bi-person-check text-lg"></i>
                              Assign Official
                            </button>
                          </div>
                        )}
                      </div>
                      <hr className="border-t border-gray-200 mb-6" />
                      <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                        <div>
                          <label className="block text-md text-gray-600 mb-2">Assigned Official:</label>
                          <p className="text-gray-900 font-medium text-lg">
                            {complaint.assignedOfficial || <span className="text-red-600">Unassigned</span>}
                          </p>
                        </div>
                        <div>
                          <label className="block text-md text-gray-600 mb-2">Current Status:</label>
                          <span className="px-4 py-1 rounded-full font-semibold text-white" style={{ backgroundColor: statusColors[complaint.status] }}>
                            {complaint.status}
                          </span>
                        </div>
                        <div>
                          <label className="block text-md text-gray-600 mb-2">Priority Level:</label>
                          {canEditPriority ? (
                            <button
                              className="px-4 py-1 rounded-full font-semibold text-white flex items-center gap-2 hover:opacity-90 transition-opacity"
                              style={{ backgroundColor: priorityColors[complaint.priority] }}
                              onClick={handlePriorityClick}
                              title="Click to change priority"
                            >
                              {complaint.priority}
                              <i className="bi bi-chevron-down text-sm"></i>
                            </button>
                          ) : (
                            <span className="px-4 py-1 rounded-full font-semibold text-white" style={{ backgroundColor: priorityColors[complaint.priority] }}>
                              {complaint.priority}
                            </span>
                          )}
                        </div>
                        <div>
                          <label className="block text-md text-gray-600 mb-2">Last Updated:</label>
                          <p className="text-gray-900 font-medium text-lg">{formatDate(complaint.updated_at)}</p>
                        </div>
                        <div>
                          <label className="block text-md text-gray-600 mb-2">Days Since Filed:</label>
                          <p className="text-gray-900 font-medium text-lg">{getDaysSinceFiled(complaint.created_at)}</p>
                        </div>
                      </div>

                      {/* Rejection Reason Section */}
                      {complaint.status === 'Rejected' && (
                        <>
                          <hr className="border-t border-gray-200 my-6" />
                          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-red-800 mb-4">Rejection Details</h3>
                            <div className="grid grid-cols-1 gap-y-4">
                              <div>
                                <label className="block text-md text-gray-600 mb-2">Reason for Rejection:</label>
                                <p className="text-gray-900 font-medium text-base leading-relaxed">{complaint.rejection_reason || 'No reason provided'}</p>
                              </div>
                              {complaint.rejected_at && (
                                <div>
                                  <label className="block text-md text-gray-600 mb-2">Rejected On:</label>
                                  <p className="text-gray-900 font-medium text-base">{formatDate(complaint.rejected_at)}</p>
                                </div>
                              )}
                              {/* Rejected By section removed - functionality no longer tracked */}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <AssignActionModal
                  isOpen={isAssignOpen}
                  onClose={() => {setIsAssignOpen(false); setRefresh(prev => !prev)}}
                  Action="Assign Complaint"
                  assignDetails={complaint}
                  >
                </AssignActionModal>

                <RejectComplaintModal
                  isOpen={isRejectOpen}
                  onClose={() => setIsRejectOpen(false)}
                  complaint={complaint}
                  onConfirm={handleRejectConfirm}
                />


                <SetPriorityModal
                  isOpen={isPriorityOpen}
                  onClose={() => setIsPriorityOpen(false)}
                  complaint={complaint}
                  onPriorityUpdate={handlePriorityUpdate}
                />
                <Toast
                  message={toastMessage}
                  isVisible={toastVisible}
                  onClose={() => setToastVisible(false)}
                />
              </>
            );
          };


          export default ComplaintDetailsPage;
