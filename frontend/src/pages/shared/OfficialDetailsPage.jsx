import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Save, X } from "lucide-react";
import useOfficialsApi from "../../api/officialsApi";
import useAuth from "../../hooks/useAuth";
import useProfileEditor from "../../hooks/useProfileEditor";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { getRoleBasePath } from "../../utils/roleUtils";
import DeleteModal from "../../components/modals/DeleteUserModal";
import AssignOfficialModal from "../../components/modals/AssignOfficialModal";
import ActiveCasesModal from "../../components/modals/ActiveCasesModal";
import ConfirmEditModal from "../../components/modals/confirmEditAccountModal.jsx";
import useComplaintsApi from "../../api/complaintsAPI";
import { formatDate } from "../../utils/formatters";
import { calculateProfileCompletion } from "../../utils/profileHelpers";
import {
  ProfilePictureSection,
  PersonalInfoSection,
  AddressInfoSection,
} from "../../components/common/ProfileFormSections";

const OfficialDetailsPage = () => {
  const { user_id } = useParams();
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { getActiveCases, getResolvedCases } = useComplaintsApi();
  const { getOfficialById, updateOfficial } = useOfficialsApi();

  const [official, setOfficial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [active, setActive] = useState(0);
  const [resolved, setResolved] = useState(0);

  // modal states
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [isViewCasesOpen, setIsViewCasesOpen] = useState(false);

  const [refresh, setRefresh] = useState(false);

  const profileFields = [
    "first_name",
    "last_name",
    "sex",
    "birthdate",
    "email",
    "contact_number",
    "purok",
    "street",
    "barangay_name",
    "profile_picture",
  ];

  const profileEditor = useProfileEditor(
    official,
    updateOfficial,
    user_id,
    async () => {
      await fetchOfficialDetails();
    }
  );

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const activeCases = await getActiveCases(user_id);
        const resolvedCases = await getResolvedCases(user_id);

        setActive(activeCases?.complaints?.length || 0);
        setResolved(resolvedCases?.complaints?.length || 0);
      } catch (error) {
        setActive(0);
        setResolved(0);
      }
    };

    fetchOfficialDetails();
    fetchCases();
  }, [user_id, refresh]);

  useEffect(() => {
    if (official) {
      profileEditor.initializeForm();
    }
  }, [official]);

  const fetchOfficialDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user_id || isNaN(Number(user_id))) {
        handleBack();
        return;
      }

      const response = await getOfficialById(user_id);

      if (response.success && response.data) {
        setOfficial(response.data);
      } else {
        handleBack();
      }
    } catch (err) {
      handleBack();
    } finally {
      setLoading(false);
    }
  };

  const getRoleLabel = (roleId) => {
    switch (roleId) {
      case 1:
        return "Super Admin";
      case 2:
        return "City Admin";
      case 3:
        return "Barangay Captain";
      case 4:
        return "Barangay Official";
      default:
        return roleId || "N/A";
    }
  };

  const getProfileCompletion = () => {
    if (!official) return 0;

    const profileData = {
      ...official,
      profile_picture:
        official.profile_picture && !profileEditor.imageError
          ? official.profile_picture
          : null,
    };

    return calculateProfileCompletion(profileData, profileFields);
  };

  const profileCompletion = getProfileCompletion();

  if (loading) {
    return <LoadingSpinner message="Loading official details..." />;
  }

  if (!official) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Official not found</p>
        </div>
      </div>
    );
  }

  // Revoke
  const handleRevoke = () => {
    setIsDeleteOpen(true);
  };

  // Assign
  const handleAssign = () => {
    setIsAssignOpen(true);
  };

  // View Active Cases
  const handleViewActiveCases = () => {
    setIsViewCasesOpen(true);
  };

  // Close
  const handleClose = (type) => {
    setIsDeleteOpen(false);
    if (type === "Account") {
      handleBack();
    }
    setRefresh((prev) => !prev);
  };

  // Back
  const handleBack = () => {
    const basePath = getRoleBasePath(auth);
    navigate(`${basePath}/officials`, { replace: true });
  };

  return (
    <>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-[1591px] mx-auto px-8 py-8">
          <button
            onClick={handleBack}
            className="w-[337px] h-[45px] bg-white hover:bg-[#E6E6E6] text-black rounded-lg flex items-center justify-center gap-x-3 text-[24px] font-small mb-6 transition-colors"
          >
            <i className="bi bi-arrow-left text-xl"></i>
            Back to Officials
          </button>

          {/* Profile Header Card */}
          <div className="bg-white rounded-lg shadow-lg border border-[#B5B5B5] p-8 mb-6">
            <div className="flex items-center gap-6">
              <ProfilePictureSection
                profilePicture={official.profile_picture}
                previewImage={profileEditor.previewImage}
                imageError={profileEditor.imageError}
                editMode={profileEditor.editMode}
                disabled={profileEditor.saving}
                onImageChange={profileEditor.handleImageChange}
                onRemoveImage={profileEditor.handleRemoveImage}
                onImageError={profileEditor.setImageError}
                size="small"
              />

              <div className="flex-1">
                <h1 className="text-2xl font-semibold text-gray-900 mb-1">
                  {official.first_name} {official.last_name}
                </h1>
                <p className="text-gray-600 font-medium mb-1 text-lg">
                  {official.position || "N/A"}
                </p>
                <p className="text-gray-600 text-lg">
                  {official.barangay_name || "N/A"}, Iligan City 9200
                </p>
              </div>

              {/* Profile Completion Circle */}
              <div className="flex-shrink-0 flex flex-col items-center">
                <div className="relative w-32 h-32">
                  <svg className="transform -rotate-90 w-32 h-32">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#E5E7EB"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke={profileCompletion === 100 ? "#10B981" : "#3B82F6"}
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 56}`}
                      strokeDashoffset={`${
                        2 * Math.PI * 56 * (1 - profileCompletion / 100)
                      }`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-gray-900">
                      {profileCompletion}%
                    </span>
                    <span className="text-xs text-gray-500">Complete</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2 text-center">
                  Profile Status
                </p>
              </div>
            </div>
          </div>

          {/* Personal Information Card */}
          <div className="bg-white rounded-lg shadow-lg border border-[#B5B5B5] p-8 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Personal Information
              </h2>
              {!profileEditor.editMode ? (
                <button
                  onClick={profileEditor.startEdit}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
                >
                  <i className="bi bi-pencil-square text-lg"></i>
                  Edit Details
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={profileEditor.handleCancel}
                    disabled={profileEditor.saving}
                    className="px-6 py-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X className="w-5 h-5" />
                    Cancel
                  </button>
                  <button
                    onClick={profileEditor.handleSaveClick}
                    disabled={profileEditor.saving}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-5 h-5" />
                    Save Changes
                  </button>
                </div>
              )}
            </div>
            <hr className="border-t border-gray-200 mt-4 mb-6" />

            <PersonalInfoSection
              formData={profileEditor.formData}
              userData={official}
              editMode={profileEditor.editMode}
              saving={profileEditor.saving}
              onChange={profileEditor.handleInputChange}
              showUsername={false}
              showDateRegistered={true}
              showRoleId={true}
              getRoleLabel={getRoleLabel}
            />
          </div>

          {/* Address Information Card */}
          <div className="bg-white rounded-lg shadow-lg border border-[#B5B5B5] p-8 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Address Information
              </h2>
            </div>
            <hr className="border-t border-gray-200 mt-4 mb-6" />

            <AddressInfoSection
              formData={profileEditor.formData}
              userData={official}
              editMode={profileEditor.editMode}
              saving={profileEditor.saving}
              onChange={profileEditor.handleInputChange}
            />
          </div>

          {/* Case Details Card */}
          <div className="bg-white rounded-lg shadow-lg border border-[#B5B5B5] p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Case Details
              </h2>
              <div className="flex items-center gap-3">
                {(auth?.role[0] === 1 ||
                  auth?.role[0] === 2 ||
                  auth?.role[0] === 3) && (
                  <button
                    className="px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-lg flex items-center gap-2 font-medium"
                    onClick={handleAssign}
                    title="Assign Official to Complaint"
                  >
                    <i className="bi bi-person-check text-lg"></i>
                    Assign Complaint
                  </button>
                )}
                <button
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
                  onClick={handleViewActiveCases}
                >
                  <i className="bi bi-bookmark text-lg"></i>
                  Active Cases Handling
                </button>
              </div>
            </div>
            <hr className="border-t border-gray-200 mt-4 mb-6" />
            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              <div>
                <label className="block text-md text-gray-600 mb-2">
                  Assigned Cases:
                </label>
                <p className="text-gray-900 font-medium text-3xl">
                  {active || 0}
                </p>
              </div>
              <div>
                <label className="block text-md text-gray-600 mb-2">
                  Cases Resolved:
                </label>
                <p className="text-gray-900 font-medium text-3xl">
                  {resolved || 0}
                </p>
              </div>
            </div>
          </div>

          {auth?.role[0] === 1 && (
            <div className="flex justify-end mt-[3%]">
              <button
                onClick={handleRevoke}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Revoke Account
              </button>
            </div>
          )}
        </div>
      </div>

      <ConfirmEditModal
        isOpen={profileEditor.showConfirmModal}
        onClose={() => profileEditor.setShowConfirmModal(false)}
        onConfirm={profileEditor.handleConfirmSave}
        isLoading={profileEditor.saving}
      />

      <DeleteModal
        isOpen={isDeleteOpen}
        onClose={handleClose}
        deleteData={official}
      />

      <AssignOfficialModal 
        isOpen={isAssignOpen} 
        onClose={() => setIsAssignOpen(false)}
        onConfirm={() => {setIsAssignOpen(false); setRefresh(prev => !prev)}}
        officialDetails={official}
        >
      </AssignOfficialModal>

      <ActiveCasesModal
        isOpen={isViewCasesOpen}
        onClose={() => setIsViewCasesOpen(false)}
        officialData={official}
      />
    </>
  );
};

export default OfficialDetailsPage;
