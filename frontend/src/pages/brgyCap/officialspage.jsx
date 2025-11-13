import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import BrgyCapOfficialCard from '../../components/cards/offcardBrgyCap';
import useAuth from '../../hooks/useAuth';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';
import Pagination from '../../components/common/Pagination';

import { useNavigate } from 'react-router-dom';
import useOfficialsApi from '../../api/officialsApi';
import AssignActionModal from '../../components/modals/AssignActionModal';

const BC_OfficialsPage = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  const { getOfficialsByBarangay } = useOfficialsApi();
  const [officials, setOfficials] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [refresh, setRefresh] = useState(false);

  // modal states
  const [isAssignOpen, setIsAssignOpen] =useState(false);
  const [officialData, setOfficialData] = useState(null);

  // filter state
  const [positionFilter, setPositionFilter] = useState('all');
  const [assignmentFilter, setAssignmentFilter] = useState('all');

  // get default assignment filter from navigation state
  const location = useLocation();
  useEffect(() => {
    if (location.state?.defaultAssignment) {
      setAssignmentFilter(location.state.defaultAssignment);
    }
  }, [location.state]);

  // get all positions for filter
  const uniquePositions = [...new Set(officials.map(o => o.position).filter(Boolean))];

  // get logged in user barangay
  const userBarangay = auth?.user?.barangay_id;

  // fetch officials
  useEffect(() => {
    if (userBarangay) {
      fetchOfficials();
    } else {
      setLoading(false);
      setError('User barangay not found. Please log in again.');
    }
  }, [userBarangay, refresh]);

  const fetchOfficials = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getOfficialsByBarangay(userBarangay);
      console.log(response);
      
      if (response.success) {
        setOfficials(response.data);
      } else {
        setError('Failed to fetch officials');
      }
    } catch (err) {
      setError('Error connecting to server. Please try again.');
      console.error('Error fetching officials:', err);
    } finally {
      setLoading(false);
    }
  };

  // filter
  const filteredOfficials = officials.filter(official => {
    // search
    const searchLower = searchTerm.toLowerCase();
    const fullName = `${official.first_name} ${official.last_name}`.toLowerCase();
    const matchesSearch = 
      fullName.includes(searchLower) ||
      official.email.toLowerCase().includes(searchLower) ||
      (official.barangay && official.barangay.toLowerCase().includes(searchLower)) ||
      (official.position && official.position.toLowerCase().includes(searchLower));
    
    // position
    const matchesPosition = 
      positionFilter === 'all' || 
      official.position === positionFilter;
    
    // assignment status (check if official has assigned complaints)
    const hasAssignedComplaints = official.assigned_complaints_count > 0;
    const matchesAssignment = 
      assignmentFilter === 'all' ||
      (assignmentFilter === 'unassigned' && hasAssignedComplaints) ||
      (assignmentFilter === 'assigned' && !hasAssignedComplaints);
    
    return matchesSearch && matchesPosition && matchesAssignment;
  });

  // pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOfficials = filteredOfficials.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOfficials.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // View Details
  const handleViewDetails = (official) => {
    console.log('View details for:', official);
    setOfficialData(official);
    navigate(`/officials/${official.id}`, { state: { official } });
  };

  // Assign Official to Complaint
  const handleUserAction = (official) => {
    console.log('User action for:', official);
    setOfficialData(official);
    setIsAssignOpen(true);
  };

  // reset when on new search
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, positionFilter, assignmentFilter]);

  return (
    <>
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-[1650px] mx-auto px-8">
          <div className="bg-white rounded-sm shadow-lg p-8 border border-[#B5B5B5]">
            <div className="flex gap-4 mb-8">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search"
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
              {/* position dropdown */}
              <select
                value={positionFilter}
                onChange={(e) => setPositionFilter(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#578fe0] bg-white text-gray-700 cursor-pointer hover:border-gray-400 transition-colors appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20width%3D%2212%22%20height%3D%228%22%20viewBox%3D%220%200%2012%208%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3cpath%20d%3D%22M1%201.5L6%206.5L11%201.5%22%20stroke%3D%22%23666666%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3c%2Fsvg%3E')] bg-[length:12px] bg-[position:right_1rem_center] bg-no-repeat pr-10"
              >
                <option value="all">All Positions</option>
                {uniquePositions.map(position => (
                  <option key={position} value={position}>{position}</option>
                ))}
              </select>
  
            {/* assignment status dropdown */}
            <select
              value={assignmentFilter}
              onChange={(e) => setAssignmentFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#578fe0] bg-white text-gray-700 cursor-pointer hover:border-gray-400 transition-colors appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20width%3D%2212%22%20height%3D%228%22%20viewBox%3D%220%200%2012%208%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3cpath%20d%3D%22M1%201.5L6%206.5L11%201.5%22%20stroke%3D%22%23666666%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3c%2Fsvg%3E')] bg-[length:12px] bg-[position:right_1rem_center] bg-no-repeat pr-10"
            >
              <option value="all">All Officials</option>
              <option value="assigned">Assigned</option>
              <option value="unassigned">Unassigned</option>
            </select>
          </div>
            {/* loading */}
            {loading && <LoadingSpinner message="Loading officials..." />}
            {/* error */}
            {error && !loading && (
              <ErrorAlert error={error} onRetry={fetchOfficials} />
            )}
            {/* officials list */}
            {!loading && !error && (
              <>
                <div className="space-y-4">
                  {currentOfficials.map((official) => (
                    <BrgyCapOfficialCard
                      key={official.user_id}
                      official={official}
                      onViewDetails={handleViewDetails}
                      onUserAction={handleUserAction}
                    />
                  ))}
                  {filteredOfficials.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      {searchTerm || positionFilter !== 'all' ?
                        'No officials found matching your filters.' :
                        'No officials in the database yet.'}
                    </div>
                  )}
                </div>
                {/* pagination */}
                {filteredOfficials.length > 0 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={filteredOfficials.length}
                    indexOfFirstItem={indexOfFirstItem}
                    indexOfLastItem={indexOfLastItem}
                    onPageChange={handlePageChange}
                    itemName="officials"
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <AssignActionModal 
        isOpen={isAssignOpen} 
        onClose={() => {setIsAssignOpen(false); setRefresh(prev => !prev);}}
        Action="Assign Official"
        assignDetails={officialData}
        >
      </AssignActionModal>
    </>
  );
}

export default BC_OfficialsPage;