import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ComplaintCardSuperAdmin from '../../components/cards/complaintCardSuperAdmin';
import useComplaintsApi from '../../api/complaintsAPI'; 
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';
import Pagination from '../../components/common/Pagination';
import useAuth from '../../hooks/useAuth';
import AssignComplaintModal from '../../components/modals/AssignComplaintModal';

const SA_ComplaintsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { auth } = useAuth();

  const [complaints, setComplaints] = useState([]); // All complaints under barangay

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { getAllComplaints } = useComplaintsApi();

  // modal states
  const [isAssignOpen, setIsAssignOpen] =useState(false);

  const defaultStatus = location.state?.defaultStatus || 'all';

  // Super Admin gets ALL filters: Barangay, Status, AND Priority
  const [filters, setFilters] = useState({
    barangay: 'all',
    status: defaultStatus,
    priority: 'all'
  });

  // Define filter options
  const uniqueStatuses = ['Pending', 'In-Progress', 'Resolved'];
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

  useEffect(() => {
    return () => {
      // Clear location state on unmount
      window.history.replaceState({}, document.title)
    };
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllComplaints();
      
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

  // Comprehensive filter logic - ALL THREE FILTERS
  const filteredComplaints = complaints.filter(complaint => {
    // Search filter
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      complaint.title?.toLowerCase().includes(searchLower) ||
      complaint.description?.toLowerCase().includes(searchLower) ||
      complaint.complaint_code?.toLowerCase().includes(searchLower) ||
      complaint.id?.toString().includes(searchLower) ||
      (complaint.barangay && complaint.barangay.toLowerCase().includes(searchLower)) ||
      (complaint.assignedOfficial && complaint.assignedOfficial.toLowerCase().includes(searchLower));
    
    // Barangay filter
    const matchesBarangay = 
      filters.barangay === 'all' || 
      complaint.barangay === filters.barangay;

    // Status filter
    const matchesStatus = 
      filters.status === 'all' || 
      complaint.status === filters.status;

    // Priority filter
    const matchesPriority = 
      filters.priority === 'all' || 
      complaint.priority === filters.priority;
    
    return matchesSearch && matchesBarangay && matchesStatus && matchesPriority;
  });

  // View Details
  const handleViewDetails = (complaint) => {
    navigate(`/superadmin/complaints/${complaint.id}`);
  };

  // Update Status
  const handleStatusUpdate = (complaint) => {
    console.log('Update status for:', complaint);
    // Open status modal
  };

  // Update Priority
  const handlePriorityUpdate = (complaint) => {
    console.log('Update priority for:', complaint);
    // Open priority modal
  };
  
    // Selection
      const [selectAll, setSelectAll] = useState(false);
      const [selected, setSelected] = useState(new Map()); // selected complaints for assignment

  // Assign Official
  const handleAssignOfficial = (complaint) => {
    if(complaint) {
      setSelected(prev => {
        const map = new Map(prev);
        map.set(complaint.id, complaint);   
        return map;
      });
    }
    setIsAssignOpen(true);
  };
  
  useEffect(() => {
    console.log("Selected changed:", [...selected.values()]);
  }, [selected]);


  const handleSelect = (complaint, isChecked) => {
    setSelected(prev => {
      const map = new Map(prev);
      if (isChecked) map.set(complaint.id, complaint);
      else map.delete(complaint.id);
      return map;
    });
  };

  const handleSelAll = () => {
    if (selectAll) {
      setSelectAll(false);
      setSelected(new Map()); 
    } else {
      const map = new Map();
      filteredComplaints.forEach(c => map.set(c.id, c));
      setSelected(map);
      setSelectAll(true); 
    }
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
            {/* FILTERS SECTION - 4 FILTERS FOR SUPER ADMIN */}
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
              {/* Barangay Filter */}
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
              {/* Status Filter */}
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
              {/* Priority Filter */}
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

              {/* Select for Assignment */}
              <button
                onClick={handleSelAll}
                className={`
                  ml-auto px-7 py-2.5 rounded-lg border w-40 transition-all duration-200

                  ${selectAll
                    ? "bg-blue-500 border-blue-500 text-white hover:bg-gray-400"
                    : "bg-gray-400 border-gray-400 text-black hover:bg-blue-300"}
                `}
                title="Select All for assignment"
              >
                {selectAll ? "Unselect All" : "Select All"}
              </button>


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
                    <ComplaintCardSuperAdmin
                      key={complaint.id}
                      complaint={complaint}
                      onViewDetails={handleViewDetails}
                      onStatusUpdate={handleStatusUpdate}
                      onPriorityUpdate={handlePriorityUpdate}
                      onAssignOfficial={handleAssignOfficial}
                      onSelect={handleSelect}
                      isSelected={selected.has(complaint.id)}
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
        selectedComplaints={[...selected.values()]}
        >
      </AssignComplaintModal>
    </>
  );
};

export default SA_ComplaintsPage;
