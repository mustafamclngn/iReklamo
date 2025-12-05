import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SuperAdminOfficialCard from "../../components/cards/offcardSuperAdmin";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorAlert from "../../components/common/ErrorAlert";
import Pagination from "../../components/common/Pagination";

import DeleteModal from "../../components/modals/DeleteUserModal";
import useOfficialsApi from "../../api/officialsApi";
import CreateAdmin from "../../components/modals/CreateAdmin";
import AssignOfficialModal from '../../components/modals/AssignOfficialModal';

const SA_OfficialsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const { getAllOfficials } = useOfficialsApi();
  const [officials, setOfficials] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [refresh, setRefresh] = useState(false);

  // modal states
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [officialData, setOfficialData] = useState(null);

  // filter states
  const [filters, setFilters] = useState({
    barangay: "all",
    position: "all",
  });

  // get all barangays and positions for filter
  const uniqueBarangays = [
    ...new Set(officials.map((o) => o.barangay_name).filter(Boolean)),
  ];
  const uniquePositions = [
    ...new Set(officials.map((o) => o.position).filter(Boolean)),
  ];

  // Fetch officials
  useEffect(() => {
    fetchOfficials();
  }, [refresh]);

  const fetchOfficials = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllOfficials();

      if (response.success) {
        setOfficials(response.data);
      } else {
        setError("Failed to fetch officials");
      }
    } catch (err) {
      setError("Error connecting to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // filter change
  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  // filter
  const filteredOfficials = officials.filter((official) => {
    // search
    const searchLower = searchTerm.toLowerCase();
    const fullName =
      `${official.first_name} ${official.last_name}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchLower) ||
      official.email.toLowerCase().includes(searchLower) ||
      (official.barangay &&
        official.barangay.toLowerCase().includes(searchLower)) ||
      (official.position &&
        official.position.toLowerCase().includes(searchLower));

    // barangay
    const matchesBarangay =
      filters.barangay === "all" || official.barangay_name === filters.barangay;

    // position
    const matchesPosition =
      filters.position === "all" || official.position === filters.position;

    return matchesSearch && matchesBarangay && matchesPosition;
  });

  // View Details
  const handleViewDetails = (official) => {
    console.log("View details for:", official);
    setOfficialData(official);
    navigate(`/officials/${official.id}`, { state: { official } });
  };

  // Assign Official to Complaint
  const handleUserAction = (official) => {
    console.log("User action for:", official);
    setOfficialData(official);
    setIsAssignOpen(true);
  };

  // Revoke Permissions
  const handleRevokePermissions = (official) => {
    console.log("Revoke permissions for:", official);
    setOfficialData(official);
    setIsDeleteOpen(true);
  };

  // Create Account
  const handleCreateAccount = () => {
    setIsCreateOpen(true);
  };

  // pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOfficials = filteredOfficials.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredOfficials.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // reset when on new search
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);

  return (
    <>
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-[1650px] mx-auto px-8">
          <div className="bg-white rounded-sm shadow-lg p-8 border border-[#B5B5B5]">
            <div className="flex gap-4 mb-4">
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
              {/* barangay dropdown */}
              <select
                value={filters.barangay}
                onChange={(e) => handleFilterChange("barangay", e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#578fe0] bg-white text-gray-700 cursor-pointer hover:border-gray-400 transition-colors appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20width%3D%2212%22%20height%3D%228%22%20viewBox%3D%220%200%2012%208%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3cpath%20d%3D%22M1%201.5L6%206.5L11%201.5%22%20stroke%3D%22%23666666%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3c%2Fsvg%3E')] bg-[length:12px] bg-[position:right_1rem_center] bg-no-repeat pr-10"
              >
                <option value="all">All Barangays</option>
                {uniqueBarangays.map((barangay) => (
                  <option key={barangay} value={barangay}>
                    {barangay}
                  </option>
                ))}
              </select>
              {/* position dropdown */}
              <select
                value={filters.position}
                onChange={(e) => handleFilterChange("position", e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#578fe0] bg-white text-gray-700 cursor-pointer hover:border-gray-400 transition-colors appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20width%3D%2212%22%20height%3D%228%22%20viewBox%3D%220%200%2012%208%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3cpath%20d%3D%22M1%201.5L6%206.5L11%201.5%22%20stroke%3D%22%23666666%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3c%2Fsvg%3E')] bg-[length:12px] bg-[position:right_1rem_center] bg-no-repeat pr-10"
              >
                <option value="all">All Positions</option>
                {uniquePositions.map((position) => (
                  <option key={position} value={position}>
                    {position}
                  </option>
                ))}
              </select>
              <button
                onClick={handleCreateAccount}
                className="px-6 py-2.5 bg-[#5AAE5C] text-white rounded-lg hover:bg-green-600 transition-colors font-medium ml-auto"
              >
                Create Account
              </button>
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
                    <SuperAdminOfficialCard
                      key={official.user_id}
                      official={official}
                      onViewDetails={handleViewDetails}
                      onUserAction={handleUserAction}
                      onRevokePermissions={handleRevokePermissions}
                    />
                  ))}
                  {filteredOfficials.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      {searchTerm ||
                      filters.barangay !== "all" ||
                      filters.position !== "all"
                        ? "No officials found matching your filters."
                        : "No officials in the database yet."}
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
      <CreateAdmin
        isOpen={isCreateOpen}
        onClose={() => {
          setIsCreateOpen(false);
          setRefresh((prev) => !prev);
        }}
      ></CreateAdmin>
      <DeleteModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setRefresh((prev) => !prev);
        }}
        deleteData={officialData}
      ></DeleteModal>
      <AssignOfficialModal 
        isOpen={isAssignOpen} 
        onClose={() => setIsAssignOpen(false)}
        onConfirm={() => {setIsAssignOpen(false); setRefresh(prev => !prev)}}
        officialDetails={officialData}
        >
      </AssignOfficialModal>
    </>
  );
};

export default SA_OfficialsPage;
