import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import complaintsApi from '../../api/complaintsAPI';
import useAuth from '../../hooks/useAuth';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getRoleBasePath } from '../../utils/roleUtils';


const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
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

const statusColors = {
  Pending: "#FFB300",
  "In-Progress": "#FFD600",
  Resolved: "#43B174"
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

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchComplaintDetails(); }, [complaint_id]);
  const fetchComplaintDetails = async () => {
    setLoading(true);
    if (!complaint_id || isNaN(Number(complaint_id))) {
      const basePath = getRoleBasePath(auth);
      navigate(`${basePath}/complaints`, { replace: true });
      return;
    }
    const response = await complaintsApi.getComplaintById(complaint_id);
    if (response.success && response.data) setComplaint(response.data);
    else navigate(`${getRoleBasePath(auth)}/complaints`, { replace: true });
    setLoading(false);
  };

  if (loading) return <LoadingSpinner message="Loading complaint details..." />;

  const userRole = auth?.user?.role || auth?.roles?.[0];
  const canEdit = userRole === "super_admin" || userRole === "city_admin" || userRole === "brgy_cap";



  // Complainant info logic
  const isAnonymous =
    complaint.is_anonymous || complaint.complainant?.is_anonymous || false;

  const isAssignedToYou =
    complaint.assigned_official_id === auth?.id ||
    complaint.assignedOfficialId === auth?.id ||
    false;

  const canViewPII =
    (userRole === 'super_admin' ||
      userRole === 'city_admin' ||
      userRole === 'brgy_cap' ||
      (userRole === 'brgy_off' && isAssignedToYou)) && !isAnonymous;

  const complainant = complaint.complainant || {};
  const rawFullName =
    complainant.full_name ||
    `${complainant.first_name || ''} ${complainant.last_name || ''}`.trim() ||
    complaint.complainant_name ||
    '';
  const displayName = isAnonymous ? 'Anonymous' : (rawFullName || 'N/A');
  const rawEmail = complainant.email || complaint.complainant_email || '';
  const rawPhone = complainant.phone || complaint.complainant_phone || '';
  const displayEmail = canViewPII ? (rawEmail || 'N/A') : maskEmail(rawEmail);
  const displayPhone = canViewPII ? (rawPhone || 'N/A') : maskPhone(rawPhone);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-[1591px] mx-auto px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => {
            const basePath = getRoleBasePath(auth);
            const complaintsPath = userRole === 'brgy_off' ? 'assigned-complaints' : 'complaints';
            navigate(`${basePath}/${complaintsPath}`);
          }}
          className="w-[337px] h-[45px] bg-white hover:bg-[#E6E6E6] text-black rounded-lg flex items-center justify-center gap-x-3 text-[24px] font-small mb-6 transition-colors"
        >
          <i className="bi bi-arrow-left text-xl"></i>
          Back to Complaints
        </button>

        {/* Main Complaint Summary */}
        <div className="bg-white rounded-lg shadow-lg border border-[#B5B5B5] p-8 mb-6">
          <div className="flex items-center gap-6">
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-gray-900 mb-1 flex items-center gap-2">
                {complaint.complaint_code}
                <button
                  className="ml-3 px-2 py-1 text-xs rounded bg-gray-200 hover:bg-gray-300"
                  onClick={() => navigator.clipboard.writeText(complaint.complaint_code)}
                >
                  Copy ID
                </button>
              </h1>
              <p className="text-gray-600 font-medium mb-1 text-lg"><span className="font-medium">Title:</span> {complaint.title}</p>
              <p className="text-gray-600 text-lg"><span className="font-medium">Barangay:</span> {complaint.barangay}, Iligan City +9200</p>
              <p className="text-gray-600 text-lg">Case Type: {complaint.case_type}</p>
            </div>
          </div>
        </div>

        {/* Complaint Details */}
        <div className="bg-white rounded-lg shadow-lg border border-[#B5B5B5] p-8 mb-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <i className="bi bi-card-text text-[#43B174] text-2xl"></i>
              <h2 className="text-2xl font-semibold text-gray-900">Complaint Details</h2>
            </div>
            {canEdit && (
              <button className="px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-lg flex items-center gap-2 font-medium">
                <i className="bi bi-pencil-square text-lg"></i>
                Edit Details
              </button>
            )}
          </div>
          <hr className="border-t border-gray-200 mt-4 mb-6" />
          <div className="space-y-6">
            <div>
              <label className="block text-md text-gray-600 mb-2">Description:</label>
              <p className="text-gray-900 font-medium text-lg leading-relaxed">{complaint.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              <div>
                <label className="block text-md text-gray-600 mb-2">Case Type:</label>
                <p className="text-gray-900 font-medium text-lg">{complaint.case_type}</p>
              </div>
              <div>
                <label className="block text-md text-gray-600 mb-2">Date Filed:</label>
                <p className="text-gray-900 font-medium text-lg">{formatDate(complaint.created_at)}</p>
              </div>
            </div>
          </div>
          {/* --- UPDATED: Complainant Info Section --- */}
          <hr className="border-t border-gray-200 mt-6 mb-6" />

          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <i className="bi bi-person-badge text-[#1F7A8C] text-2xl"></i>
              <h3 className="text-xl font-semibold text-gray-900">Complainant Information</h3>
            </div>
            {canEdit && (
              <button className="px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-base flex items-center gap-2 font-medium">
                <i className="bi bi-pencil-square text-base"></i>
                Edit Complainant
              </button>
            )}
          </div>

          {isAnonymous && (
            <div className="mb-4 px-4 py-3 rounded-md bg-yellow-50 text-yellow-800 border border-yellow-200">
              This complaint is filed as Anonymous; contact details are hidden by design. 
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

        {/* Location Information */}
        <div className="bg-white rounded-lg shadow-lg border border-[#B5B5B5] p-8 mb-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <i className="bi bi-geo-alt-fill text-red-600 text-2xl"></i>
              <h2 className="text-2xl font-semibold text-gray-900">Location Information</h2>
            </div>
            {canEdit && (
              <button className="px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-lg flex items-center gap-2 font-medium">
                <i className="bi bi-pencil-square text-lg"></i>
                Edit Location
              </button>
            )}
          </div>
          <hr className="border-t border-gray-200 mt-4 mb-6" />
          <div className="space-y-6">
            <div>
              <label className="block text-md text-gray-600 mb-2">Full Address:</label>
              <p className="text-gray-900 font-medium text-lg">{complaint.full_address}</p>
            </div>
            {complaint.specific_location && (
              <div>
                <label className="block text-md text-gray-600 mb-2">Specific Location:</label>
                <p className="text-gray-900 font-medium text-lg">{complaint.specific_location}</p>
              </div>
            )}
            <div className="grid grid-cols-1 gap-x-8 gap-y-6">
              <div>
                <label className="block text-md text-gray-600 mb-2">Barangay:</label>
                <p className="text-gray-900 font-medium text-lg">{complaint.barangay}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Assignment Details with Status, and Priority */}
        <div className="bg-white rounded-lg shadow-lg border border-[#B5B5B5] p-8">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <i className="bi bi-person-check text-[#FB8500] text-2xl"></i>
              <h2 className="text-2xl font-semibold text-gray-900">Assignment Details</h2>
            </div>
            {canEdit && (
              <div className="flex gap-4">
                <button
                  className="px-4 py-2 font-medium transition-colors rounded-lg text-white whitespace-nowrap text-lg flex items-center gap-2 hover:opacity-90"
                  style={{
                    backgroundColor: statusColors[complaint.status] || "#AEAEAE",
                  }}
                  title="Click to change status"
                >
                  {complaint.status}
                  <i className="bi bi-chevron-down text-base"></i>
                </button>
                <button className="px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-lg flex items-center gap-2 font-medium">
                  <i className="bi bi-person-check text-lg"></i>
                  Assign Official
                </button>
              </div>
            )}
          </div>
          <hr className="border-t border-gray-200 mb-2" />
          <div className="grid grid-cols-2 gap-x-8 gap-y-6">
            <div>
              <label className="block text-md text-gray-600 mb-2">Assigned Official:</label>
              <p className="text-gray-900 font-medium text-lg">
                {complaint.assignedOfficial || <span className="text-red-600">Unassigned</span>}
              </p>
            </div>
            <div>
              <div className="flex gap-4 mt-1 mb-3"></div>
              <label className="block text-md text-gray-600 mb-2">Current Status:</label>
              <span className="px-4 py-1 rounded-full font-semibold text-white" style={{ backgroundColor: statusColors[complaint.status] }}>
                {complaint.status}
              </span>
            </div>
            <div>
              <div className="flex gap-4 mt-1 mb-3"></div>
              <label className="block text-md text-gray-600 mb-2">Priority Level:</label>
              <span className="px-4 py-1 rounded-full font-semibold text-white" style={{ backgroundColor: priorityColors[complaint.priority] }}>
                {complaint.priority}
              </span>
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
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetailsPage;
