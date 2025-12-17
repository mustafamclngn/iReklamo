import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useComplaintsApi from "../../api/complaintsAPI";
import useAuth from "../../hooks/useAuth";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { getRoleBasePath } from "../../utils/roleUtils";
import AssignComplaintModal from "../../components/modals/AssignComplaintModal";
import RejectComplaintModal from "../../components/modals/RejectComplaintModal";
import StatusUpdateModal from "../../components/modals/StatusUpdateModal";
import SetPriorityModal from "../../components/modals/SetPriorityModal";
import Toast from "../../components/common/Toast";
import useLockBodyScroll from "../../hooks/useLockBodyScroll";

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
  if (!dateString) return "N/A";
  const filedDate = new Date(dateString);
  const now = new Date();
  const filedDateStart = new Date(
    filedDate.getFullYear(),
    filedDate.getMonth(),
    filedDate.getDate()
  );
  const nowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffTime = nowStart - filedDateStart;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return "N/A";
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "1 day ago";
  return `${diffDays} days ago`;
};

const formatPhone = (num) => {
  if (!num) return "N/A";
  const digits = num.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("09")) {
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
  Rejected: "#DC3545",
};
const priorityColors = {
  Urgent: "#C00F0C",
  Moderate: "#FB8500",
  Low: "#43B174",
};

// Add Log Modal Component
const AddLogModal = ({ isOpen, onClose, complaint, onLogAdded }) => {
  const [logText, setLogText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addComplaintLog } = useComplaintsApi();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!logText.trim()) return;

    setIsSubmitting(true);

    try {
      const response = await addComplaintLog(complaint.id, logText.trim());

      if (response.success) {
        onLogAdded();
        setLogText("");
        onClose();
      } else {
        console.error("Failed to add log:", response.message);
        alert("Failed to add log. Please try again.");
      }
    } catch (error) {
      console.error("Error adding log:", error);
      alert("Error adding log. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-semibold text-gray-900">
              Add Status Log
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <i className="bi bi-x-lg text-xl"></i>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Log Entry
              </label>
              <textarea
                value={logText}
                onChange={(e) => setLogText(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows="6"
                placeholder="Enter your log notes here..."
                required
              />
              <p className="text-sm text-gray-500 mt-2">
                This will be added to the status history without changing the
                current status.
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting || !logText.trim()}
              >
                {isSubmitting ? "Adding..." : "Add Log"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const ComplaintDetailsPage = () => {
  const { complaint_id } = useParams();
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { getComplaintById } = useComplaintsApi();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [isStatusUpdateOpen, setIsStatusUpdateOpen] = useState(false);
  const [isPriorityOpen, setIsPriorityOpen] = useState(false);
  const [isAddLogOpen, setIsAddLogOpen] = useState(false);

  const [refresh, setRefresh] = useState(false);

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleAssign = () => {
    setIsAssignOpen(true);
  };

  const handleReject = () => {
    setIsRejectOpen(true);
  };

  const handleRejectSuccess = () => {
    setIsRejectOpen(false);
    setToastMessage("Complaint rejected successfully!");
    setToastVisible(true);
    setTimeout(() => {
      setRefresh((prev) => !prev);
    }, 1500);
  };

  const handleStatusUpdate = async (updatedComplaint) => {
    setComplaint((prev) => ({ ...prev, ...updatedComplaint }));
    setIsStatusUpdateOpen(false);
    setToastMessage("Status updated successfully!");
    setToastVisible(true);
    setTimeout(() => {
      setRefresh((prev) => !prev);
    }, 1000);
  };

  const handlePriorityClick = () => {
    if (canEditPriority) {
      setIsPriorityOpen(true);
    }
  };

  const handlePriorityUpdate = async (updatedComplaint) => {
    setComplaint((prev) => ({ ...prev, ...updatedComplaint }));
    setIsPriorityOpen(false);
    setToastMessage("Priority updated successfully");
    setToastVisible(true);
    setTimeout(() => {
      setRefresh((prev) => !prev);
    }, 1000);
  };

  const handleLogAdded = () => {
    setToastMessage("Log added successfully!");
    setToastVisible(true);
    setTimeout(() => {
      setRefresh((prev) => !prev);
    }, 1000);
  };

  useEffect(() => {
    fetchComplaintDetails();
  }, [complaint_id, refresh]);

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

  const anyModalOpen =
    isAssignOpen ||
    isPriorityOpen ||
    isRejectOpen ||
    isStatusUpdateOpen ||
    isAddLogOpen;
  useLockBodyScroll(anyModalOpen);

  if (loading) return <LoadingSpinner message="Loading complaint details..." />;

  const userRole = auth?.role?.[0];
  const canEditPriority = userRole === 2 || userRole === 3;
  const canManageComplaints =
    userRole === 1 || userRole === 2 || userRole === 3;
  const canUpdateStatus =
    userRole === 1 || userRole === 2 || userRole === 3 || userRole === 4;

  const isAnonymous = complaint?.is_anonymous || false;
  const rawFullName = `${complaint.complainant_first_name || ""} ${
    complaint.complainant_last_name || ""
  }`.trim();
  const displayName = rawFullName || "N/A";
  const rawEmail = complaint.complainant_email || "";
  const rawPhone = complaint.complainant_contact_number || "";
  const displayEmail = rawEmail || "N/A";
  const displayPhone = formatPhone(rawPhone) || "N/A";

  return (
    <>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-[1591px] mx-auto px-8 py-8">
          {/* Back Button - Matching Official Details */}
          <button
            onClick={() => {
              const basePath = getRoleBasePath(auth);
              const complaintsPath =
                userRole === 4 ? "assigned-complaints" : "complaints";
              navigate(`${basePath}/${complaintsPath}`);
            }}
            className="w-[337px] h-[45px] bg-white hover:bg-[#E6E6E6] text-black rounded-lg flex items-center justify-center gap-x-3 text-[24px] font-small mb-6 transition-colors"
          >
            <i className="bi bi-arrow-left text-xl"></i>
            Back to Complaints
          </button>

          {/* header */}
          <div className="bg-white rounded-lg shadow-lg border border-[#B5B5B5] p-8 mb-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h1 className="text-2xl font-semibold text-gray-900 mb-1">
                  {complaint.title}
                </h1>
                <p className="text-gray-600 font-medium mb-1 text-lg">
                  {complaint.complaint_code}
                </p>
                <p className="text-gray-600 text-lg">
                  {getDaysSinceFiled(complaint.created_at)} • {complaint.barangay || "N/A"}
                </p>
              </div>

              {canManageComplaints && (
                <div className="flex gap-3">
                  <button
                    type="button"
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleReject}
                    disabled={
                      complaint.status === "Rejected" ||
                      complaint.status === "Resolved"
                    }
                  >
                    <i className="bi bi-x-circle"></i>
                    Reject
                  </button>
                  <button
                    type="button"
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleAssign}
                    disabled={complaint.status === "Resolved"}
                  >
                    <i className="bi bi-person-check"></i>
                    {complaint.assignedOfficial ? "Reassign" : "Assign"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* status overview */}
          <div className="bg-white rounded-lg shadow-lg border border-[#B5B5B5] p-8 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Status Overview
              </h2>
              {canUpdateStatus && (
                <button
                  onClick={() => setIsStatusUpdateOpen(true)}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
                >
                  <i className="bi bi-arrow-repeat"></i>
                  Update Status
                </button>
              )}
            </div>
            <hr className="border-t border-gray-200 mt-4 mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-6">
              <div>
                <label className="block text-md text-gray-600 mb-2">
                  Status:
                </label>
                <span
                  className="px-4 py-1.5 rounded-full font-semibold text-white inline-block text-sm"
                  style={{ backgroundColor: statusColors[complaint.status] }}
                >
                  {complaint.status}
                </span>
              </div>

              <div>
                <label className="block text-md text-gray-600 mb-2">
                  Priority:
                </label>
                {canEditPriority ? (
                  <button
                    className="px-4 py-1.5 rounded-full font-semibold text-white flex items-center gap-2 hover:opacity-90 transition-opacity text-sm"
                    style={{
                      backgroundColor: priorityColors[complaint.priority],
                    }}
                    onClick={handlePriorityClick}
                    title="Click to change priority"
                  >
                    {complaint.priority}
                    <i className="bi bi-chevron-down text-xs"></i>
                  </button>
                ) : (
                  <span
                    className="px-4 py-1.5 rounded-full font-semibold text-white inline-block text-sm"
                    style={{
                      backgroundColor: priorityColors[complaint.priority],
                    }}
                  >
                    {complaint.priority}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-md text-gray-600 mb-2">
                  Assigned To:
                </label>
                <p className="text-gray-900 font-medium text-lg">
                  {complaint.assignedOfficial || (
                    <span className="text-red-600">Unassigned</span>
                  )}
                </p>
              </div>

              <div>
                <label className="block text-md text-gray-600 mb-2">
                  Case Type:
                </label>
                <p className="text-gray-900 font-medium text-lg">
                  {complaint.case_type}
                </p>
              </div>
            </div>
          </div>

          {/* main content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* description */}
              <div className="bg-white rounded-lg shadow-lg border border-[#B5B5B5] p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Description
                </h2>
                <hr className="border-t border-gray-200 mt-4 mb-6" />
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">
                  {complaint.description || "No description provided."}
                </p>
              </div>

              {/* location */}
              <div className="bg-white rounded-lg shadow-lg border border-[#B5B5B5] p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Location Details
                </h2>
                <hr className="border-t border-gray-200 mt-4 mb-6" />
                <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                  <div>
                    <label className="block text-md text-gray-600 mb-2">
                      Barangay:
                    </label>
                    <p className="text-gray-900 font-medium text-lg">
                      {complaint.barangay || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-md text-gray-600 mb-2">
                      Specific Location:
                    </label>
                    <p className="text-gray-900 font-medium text-lg">
                      {complaint.specific_location || "N/A"}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-md text-gray-600 mb-2">
                      Full Address:
                    </label>
                    <p className="text-gray-900 font-medium text-lg">
                      {complaint.full_address || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* status history */}
              <div className="bg-white rounded-lg shadow-lg border border-[#B5B5B5] p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Status History
                  </h2>
                  <button
                    onClick={() => setIsAddLogOpen(true)}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
                  >
                    <i className="bi bi-plus-lg"></i>
                    Add Log
                  </button>
                </div>
                <hr className="border-t border-gray-200 mt-4 mb-6" />
                {complaint.status_history &&
                complaint.status_history.length > 0 ? (
                  <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                    {complaint.status_history.map((entry, index) => (
                      <div key={index} className="relative pl-8 pb-4 last:pb-0">
                        {index !== complaint.status_history.length - 1 && (
                          <div className="absolute left-3 top-8 bottom-0 w-0.5 bg-gray-200"></div>
                        )}
                        <div className="absolute left-0 top-1">
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center"
                            style={{
                              backgroundColor:
                                statusColors[entry.status] || "#AEAEAE",
                            }}
                          >
                            <i className="bi bi-circle-fill text-white text-xs"></i>
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <div className="flex items-center gap-2 mb-2">
                            <span
                              className="px-3 py-0.5 rounded-full font-semibold text-white text-xs"
                              style={{
                                backgroundColor:
                                  statusColors[entry.status] || "#AEAEAE",
                              }}
                            >
                              {entry.status}
                            </span>
                            <span className="text-xs text-gray-500">
                              {entry.changed_at
                                ? formatDate(entry.changed_at)
                                : "N/A"}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 mb-1">
                            {entry.remarks || "No remarks provided"}
                          </p>
                          <p className="text-xs text-gray-500">
                            by {entry.actor_name || "Unknown"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <i className="bi bi-info-circle text-4xl mb-3 block"></i>
                    <p>No status changes recorded yet.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              {/* complainant */}
              <div className="bg-white rounded-lg shadow-lg border border-[#B5B5B5] p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Complainant
                </h2>
                <hr className="border-t border-gray-200 mt-4 mb-6" />
                {isAnonymous && (
                  <div className="mb-4 px-3 py-2 rounded-md bg-yellow-50 text-yellow-800 border border-yellow-200 text-sm">
                    Anonymous complaint
                  </div>
                )}
                <div className="space-y-6">
                  <div>
                    <label className="block text-md text-gray-600 mb-2">
                      Name:
                    </label>
                    <p className="text-gray-900 font-medium text-lg">
                      {displayName}
                    </p>
                  </div>
                  <div>
                    <label className="block text-md text-gray-600 mb-2">
                      Email:
                    </label>
                    <p className="text-gray-900 font-medium text-lg break-all">
                      {displayEmail}
                    </p>
                  </div>
                  <div>
                    <label className="block text-md text-gray-600 mb-2">
                      Phone:
                    </label>
                    <p className="text-gray-900 font-medium text-lg">
                      {displayPhone}
                    </p>
                  </div>
                </div>
              </div>

              {/* timeline */}
              <div className="bg-white rounded-lg shadow-lg border border-[#B5B5B5] p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Timeline
                </h2>
                <hr className="border-t border-gray-200 mt-4 mb-6" />
                <div className="space-y-6">
                  <div>
                    <label className="block text-md text-gray-600 mb-2">
                      Filed On:
                    </label>
                    <p className="text-gray-900 font-medium text-lg">
                      {formatDate(complaint.created_at)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-md text-gray-600 mb-2">
                      Last Updated:
                    </label>
                    <p className="text-gray-900 font-medium text-lg">
                      {formatDate(complaint.updated_at)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-md text-gray-600 mb-2">
                      Duration:
                    </label>
                    <p className="text-gray-900 font-medium text-lg">
                      {getDaysSinceFiled(complaint.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AssignComplaintModal
        isOpen={isAssignOpen}
        onClose={() => setIsAssignOpen(false)}
        selectedComplaints={[complaint]}
        onConfirm={() => {
          setIsAssignOpen(false);
          setToastMessage("Complaint assigned successfully!");
          setToastVisible(true);
          setTimeout(() => {
            setRefresh((prev) => !prev);
          }, 1000);
        }}
      />

      <RejectComplaintModal
        isOpen={isRejectOpen}
        onClose={() => setIsRejectOpen(false)}
        complaint={complaint}
        onConfirm={handleRejectSuccess}
      />

      <SetPriorityModal
        isOpen={isPriorityOpen}
        onClose={() => setIsPriorityOpen(false)}
        complaint={complaint}
        onPriorityUpdate={handlePriorityUpdate}
      />

      <StatusUpdateModal
        isOpen={isStatusUpdateOpen}
        onClose={() => setIsStatusUpdateOpen(false)}
        complaint={complaint}
        onRefresh={() => handleStatusUpdate(complaint)}
      />

      <AddLogModal
        isOpen={isAddLogOpen}
        onClose={() => setIsAddLogOpen(false)}
        complaint={complaint}
        onLogAdded={handleLogAdded}
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