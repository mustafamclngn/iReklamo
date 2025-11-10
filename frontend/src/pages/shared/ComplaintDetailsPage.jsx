import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import complaintsApi from '../../api/complaintsAPI';
import useAuth from '../../hooks/useAuth';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getRoleBasePath } from '../../utils/roleUtils';

const ComplaintDetailsPage = () => {
  const { complaint_id } = useParams();
  const navigate = useNavigate();
  const { auth } = useAuth();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaintDetails();
  }, [complaint_id]);

  const fetchComplaintDetails = async () => {
    try {
      setLoading(true);

      // validate complaint id
      if (!complaint_id || isNaN(Number(complaint_id))) {
        const basePath = getRoleBasePath(auth);
        navigate(`${basePath}/complaints`, { replace: true });
        return;
      }

      const response = await complaintsApi.getComplaintById(complaint_id);

      if (response.success && response.data) {
        setComplaint(response.data);
      } else {
        // if no complaint found, back to complaints list page
        const basePath = getRoleBasePath(auth);
        navigate(`${basePath}/complaints`, { replace: true });
      }
    } catch {
      const basePath = getRoleBasePath(auth);
      navigate(`${basePath}/complaints`, { replace: true });
    } finally {
      setLoading(false);
    }
  };

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
    const today = new Date();

    // Set time to start of day for accurate day calculation
    const filedDateStart = new Date(filedDate.getFullYear(), filedDate.getMonth(), filedDate.getDate());
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const diffTime = todayStart - filedDateStart;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'N/A'; // Future date
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
  };

  if (loading) {
    return <LoadingSpinner message="Loading complaint details..." />;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-[1591px] mx-auto px-8 py-8">
        <button
          onClick={() => {
            const basePath = getRoleBasePath(auth);
            const complaintsPath = auth.role === 'brgy_off' ? 'assigned-complaints' : 'complaints';
            navigate(`${basePath}/${complaintsPath}`);
          }}
          className="w-[337px] h-[45px] bg-white hover:bg-[#E6E6E6] text-black rounded-lg flex items-center justify-center gap-x-3 text-[24px] font-small mb-6 transition-colors">
          <i className="bi bi-arrow-left text-xl"></i>
          Back to Complaints
        </button>

        <div className="bg-white rounded-lg shadow-lg border border-[#B5B5B5] p-8 mb-6">
          <div className="flex items-center">
            {/* Basic complaint information */}
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-gray-900 mb-1">
                {complaint.complaint_code}
              </h1>
              <p className="text-gray-600 font-medium mb-1 text-lg">
                {complaint.title}
              </p>
              <p className="text-gray-600 text-lg">
                {complaint.barangay}, Iligan City +9200
              </p>
              <p className="text-gray-600 text-lg">
                Case Type: {complaint.case_type}
              </p>
            </div>
          </div>
        </div>

        {/* Complaint Details */}
        <div className="bg-white rounded-lg shadow-lg border border-[#B5B5B5] p-8 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Complaint Details</h2>
            <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2">
              <i className="bi bi-pencil-square text-lg"></i>
              Update Status
            </button>
          </div>
          <hr className="border-t border-gray-200 mt-4 mb-6" />

          <div className="space-y-6">
            <div>
              <label className="block text-md text-gray-600 mb-2">Description:</label>
              <p className="text-gray-900 font-medium text-lg leading-relaxed">
                {complaint.description}
              </p>
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
        </div>

        {/* Location Information */}
        <div className="bg-white rounded-lg shadow-lg border border-[#B5B5B5] p-8 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Location Information</h2>
            <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2">
              <i className="bi bi-pencil-square text-lg"></i>
              Edit Location
            </button>
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-md text-gray-600 mb-2">Barangay:</label>
                <p className="text-gray-900 font-medium text-lg">{complaint.barangay}</p>
              </div>

              <div>
                <label className="block text-md text-gray-600 mb-2">City:</label>
                <p className="text-gray-900 font-medium text-lg">Iligan City</p>
              </div>
            </div>
          </div>
        </div>

        {/* Assignment Details */}
        <div className="bg-white rounded-lg shadow-lg border border-[#B5B5B5] p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Assignment Details</h2>
            <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2">
              <i className="bi bi-person-check text-lg"></i>
              Assign Official
            </button>
          </div>
          <hr className="border-t border-gray-200 mt-4 mb-6" />

          <div className="grid grid-cols-2 gap-x-8 gap-y-6">
            <div>
              <label className="block text-md text-gray-600 mb-2">Assigned Official:</label>
              <p className="text-gray-900 font-medium text-lg">
                {complaint.assignedOfficial || 'Unassigned'}
              </p>
            </div>

            <div>
              <label className="block text-md text-gray-600 mb-2">Current Status:</label>
              <p className="text-gray-900 font-medium text-lg">{complaint.status}</p>
            </div>

            <div>
              <label className="block text-md text-gray-600 mb-2">Priority Level:</label>
              <p className="text-gray-900 font-medium text-lg">{complaint.priority}</p>
            </div>

            <div>
              <label className="block text-md text-gray-600 mb-2">Last Updated:</label>
              <p className="text-gray-900 font-medium text-lg">{formatDate(complaint.updated_at)}</p>
            </div>

            <div>
              <label className="block text-md text-gray-600 mb-2">Days Since Filed:</label>
              <p className="text-gray-900 font-medium text-lg">
                {getDaysSinceFiled(complaint.created_at)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetailsPage;
