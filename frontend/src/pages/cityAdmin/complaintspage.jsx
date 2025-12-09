import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ComplaintCardCityAdmin from '../../components/cards/complaintCardCityAdmin';
import useComplaintsApi from '../../api/complaintsAPI';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';
import Pagination from '../../components/common/Pagination';
import AssignComplaintModal from '../../components/modals/AssignComplaintModal';
import StatusUpdateModal from '../../components/modals/StatusUpdateModal';
import SetPriorityModal from '../../components/modals/SetPriorityModal';
import Toast from '../../components/common/Toast';

const CA_ComplaintsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [refresh, setRefresh] = useState(false);

  const { getAllComplaints } = useComplaintsApi();

  // modal states
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [isPriorityOpen, setIsPriorityOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [complaintData, setComplaintData] = useState(null);

  // toast state
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const location = useLocation();
  const defaultStatus = location.state?.defaultStatus || 'all';

  // UPDATED: 3 filters - Barangay, Status, Priority
  const [filters, setFilters] = useState({
    barangay: 'all',
    status: defaultStatus,
    priority: 'all'
  });

  // Define filter options
  const uniqueStatuses = ['Pending', 'In-Progress', 'Resolved', 'Rejected'];
  const uniquePriorities = ['Urgent', 'Moderate', 'Low'];
  
  // Extract unique barangays from complaints data
  const uniqueBarangays = [...new Set(
    complaints
      .map(complaint => complaint.barangay)
      .filter(Boolean)
  )].sort();

  // Fetch complaints
  useEffect(() => {
    fetchComplaints();
  }, [refresh]);

  // Fetch complaints when server-side filters change
  useEffect(() => {
    fetchComplaints(filters);
    // Clear search when filters change to avoid confusion with new results
    setSearchTerm('');
  }, [filters]);

  // Check for refresh trigger from navigation state
  useEffect(() => {
    if (location.state?.refresh) {
      setRefresh(prev => !prev);
      // Clear the navigation state
      window.history.replaceState({}, document.title, location.pathname);
    }
  }, [location.state]);

  const fetchComplaints = async (currentFilters = {}) => {
    try {
      setLoading(true);
      setError(null);

      // Build server filters - exclude search which is handled client-side
      const serverFilters = {};
      if (currentFilters.barangay && currentFilters.barangay !== 'all') {
        serverFilters.barangay = currentFilters.barangay;
      }
      if (currentFilters.status && currentFilters.status !== 'all') {
        serverFilters.status = currentFilters.status;
      }
      if (currentFilters.priority && currentFilters.priority !== 'all') {
        serverFilters.priority = currentFilters.priority;
      }

      const response = await getAllComplaints(serverFilters);

      if (response.success) {
        setComplaints(response.data);
      } else {
        setError('Failed to fetch complaints');
      }
    } catch (err) {
      setError('Error connecting to server. Please try again.');
      console.error('Error fetching complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter change handler
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Client-side filtering - only search since status/barangay/priority are server-side
  const filteredComplaints = complaints.filter(complaint => {
    if (!searchTerm) return true;

    // Search filter - check multiple fields for matches
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      complaint.title?.toLowerCase().includes(searchLower) ||
      complaint.description?.toLowerCase().includes(searchLower) ||
      complaint.complaint_code?.toLowerCase().includes(searchLower) ||
      complaint.id?.toString().includes(searchLower) ||
      (complaint.barangay && complaint.barangay.toLowerCase().includes(searchLower)) ||
      (complaint.assignedOfficial && complaint.assignedOfficial.toLowerCase().includes(searchLower)) ||
      complaint.status?.toLowerCase().includes(searchLower);

    return matchesSearch;
  });

  // View Details
  const handleViewDetails = (complaint) => {
    navigate(`/cityadmin/complaints/${complaint.id}`);
  };

  // Update Status
  const handleStatusUpdate = (complaint) => {
    setSelectedComplaint(complaint);
    setIsStatusModalOpen(true);
  };

  // Update Priority
  const handlePriorityUpdate = (complaint) => {
    setComplaintData(complaint);
    setIsPriorityOpen(true);
  };

  // Assign Official
  const handleAssignOfficial = (complaint) => {
    console.log('Assign complaint to:', complaint);
    setComplaintData(complaint);
    setIsAssignOpen(true);
  };

  // Priority Update Handler
  const handlePriorityChange = (newPriority) => {
    setComplaints(prevComplaints =>
      prevComplaints.map(complaint =>
        complaint.id === complaintData?.id
          ? { ...complaint, priority: newPriority }
          : complaint
      )
    );
    setToastMessage('Priority updated successfully!');
    setToastVisible(true);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentComplaints = filteredComplaints.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);

  return (
    <>
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-[1650px] mx-auto px-8">
          <div className="bg-white rounded-sm shadow-lg p-8 border border-[#B5B5B5]">
            {/* FILTERS SECTION - 4 TOTAL (Search + 3 Dropdowns) */}
            <div className="flex gap-4 mb-8">
              {/* Search Input */}
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search complaints..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#E3E3E3]"
                />
                <svg
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </div>
              {/* Barangay Filter Dropdown */}
              <select
                value={filters.barangay}
                onChange={(e) => handleFilterChange('barangay', e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#578fe0] bg-white text-gray-700 cursor-pointer hover:border-gray-400 transition-colors appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20width%3D%2212%22%20height%3D%228%22%20viewBox%3D%220%200%2012%208%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3cpath%20d%3D%22M1%201.5L6%206.5L11%201.5%22%20stroke%3D%22%23666666%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3c%2Fsvg%3E')] bg-[length:12px] bg-[position:right_1rem_center] bg-no-repeat pr-10"
              >
                <option value="all">All Barangays</option>
                {uniqueBarangays.map(barangay => (
                  <option key={barangay} value={barangay}>{barangay}</option>
                ))}
              </select>
              {/* Status Filter Dropdown */}
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#578fe0] bg-white text-gray-700 cursor-pointer hover:border-gray-400 transition-colors appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20width%3D%2212%22%20height%3D%228%22%20viewBox%3D%220%200%2012%208%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3cpath%20d%3D%22M1%201.5L6%206.5L11%201.5%22%20stroke%3D%22%23666666%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3c%2Fsvg%3E')] bg-[length:12px] bg-[position:right_1rem_center] bg-no-repeat pr-10"
              >
                <option value="all">All Statuses</option>
                {uniqueStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              {/* Priority Filter Dropdown */}
              <select
                value={filters.priority}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#578fe0] bg-white text-gray-700 cursor-pointer hover:border-gray-400 transition-colors appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20width%3D%2212%22%20height%3D%228%22%20viewBox%3D%220%200%2012%208%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3cpath%20d%3D%22M1%201.5L6%206.5L11%201.5%22%20stroke%3D%22%23666666%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3c%2Fsvg%3E')] bg-[length:12px] bg-[position:right_1rem_center] bg-no-repeat pr-10"
              >
                <option value="all">All Priorities</option>
                {uniquePriorities.map(priority => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </select>
            </div>
            {/* Loading State */}
            {loading && <LoadingSpinner message="Loading complaints..." />}
            {/* Error State */}
            {error && !loading && (
              <ErrorAlert error={error} onRetry={fetchComplaints} />
            )}
            {/* Complaints List */}
            {!loading && !error && (
              <>
                <div className="space-y-4">
                  {currentComplaints.map((complaint) => (
                    <ComplaintCardCityAdmin
                      key={complaint.id}
                      complaint={complaint}
                      onViewDetails={handleViewDetails}
                      onStatusUpdate={handleStatusUpdate}
                      onPriorityUpdate={handlePriorityUpdate}
                      onAssignOfficial={handleAssignOfficial}
                    />
                  ))}
                  {filteredComplaints.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      {searchTerm || filters.barangay !== 'all' || filters.status !== 'all' || filters.priority !== 'all' ?
                        'No complaints found matching your filters.' :
                        'No complaints in the database yet.'}
                    </div>
                  )}
                </div>
                {/* Pagination */}
                {filteredComplaints.length > 0 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={filteredComplaints.length}
                    indexOfFirstItem={indexOfFirstItem}
                    indexOfLastItem={indexOfLastItem}
                    onPageChange={handlePageChange}
                    itemName="complaints"
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <AssignComplaintModal
        isOpen={isAssignOpen}
        onClose={() => {setIsAssignOpen(false); setRefresh(prev => !prev);}}
        Action="Assign Complaint"
        assignDetails={complaintData}
        >
      </AssignComplaintModal>
      <SetPriorityModal
        isOpen={isPriorityOpen}
        onClose={() => setIsPriorityOpen(false)}
        complaint={complaintData}
        onPriorityUpdate={handlePriorityChange}
      />
      <StatusUpdateModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        complaint={selectedComplaint}
        onRefresh={() => {
          setRefresh(prev => !prev);
          fetchComplaints();
        }}
      />

      <Toast
        message={toastMessage}
        isVisible={toastVisible}
        onClose={() => setToastVisible(false)}
      />
    </>
  );
};

export default CA_ComplaintsPage;
