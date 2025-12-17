import React, { useState, useEffect } from "react";
import { Save, X, AlertCircle } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import useOfficialsApi from "../../api/officialsApi";
import useProfileEditor from "../../hooks/useProfileEditor";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ConfirmEditModal from "../../components/modals/confirmEditAccountModal.jsx";
import { calculateProfileCompletion } from "../../utils/profileHelpers";
import { toTitleCase } from "../../utils/stringHelpers";
import useLogOut from "../../hooks/useLogOut.jsx";
import { useNavigate, Link } from 'react-router-dom';
import LogOutModal from '../../components/modals/ConfirmLogOut';
import { getImageURL } from "../../utils/imageHelpers";
import {
  ProfilePictureSection,
  PersonalInfoSection,
  AddressInfoSection,
} from "../../components/common/ProfileFormSections";
import useLockBodyScroll from "../../hooks/useLockBodyScroll.jsx";

const AccountPage = () => {
  const { auth } = useAuth();
  const { getOfficialById, updateOfficial } = useOfficialsApi();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

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
    userData,
    updateOfficial,
    auth?.user?.user_id,
    async () => {
      await fetchUserData();
    }
  );

  const getUserRole = () => {
    if (!userData) return "User";
    const role = userData.position || userData.role || "User";
    return toTitleCase(role);
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (userData) {
      profileEditor.initializeForm();
    }
  }, [userData]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await getOfficialById(auth?.user?.user_id);

      if (response.success && response.data) {
        setUserData(response.data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getProfileCompletion = () => {
    if (!userData) return 0;

    const profileData = {
      ...userData,
      profile_picture:
        userData.profile_picture && !profileEditor.imageError
          ? userData.profile_picture
          : null,
    };

    return calculateProfileCompletion(profileData, profileFields);
  };


  const logout = useLogOut();
  const navigate = useNavigate();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const signout = async () => {
    await logout();
    navigate('/home');
  }

  useLockBodyScroll(isConfirmOpen);  

  if (loading) {
    return <LoadingSpinner message="Loading account details..." />;
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Failed to load account data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <ConfirmEditModal
        isOpen={profileEditor.showConfirmModal}
        onClose={() => profileEditor.setShowConfirmModal(false)}
        onConfirm={profileEditor.handleConfirmSave}
        isLoading={profileEditor.saving}
      />

      <div className="max-w-[1591px] mx-auto px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            View Account Details
          </h1>
          {!profileEditor.editMode ? (
            <button
              onClick={profileEditor.startEdit}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2 text-lg"
            >
              <i className="bi bi-pencil-square"></i>
              Edit Profile
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

        {/* Profile Header Card */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-300 p-8 mb-6">
          <div className="flex items-center gap-8">
            <ProfilePictureSection
              profilePicture={userData.profile_picture}
              previewImage={profileEditor.previewImage}
              imageError={profileEditor.imageError}
              editMode={profileEditor.editMode}
              disabled={profileEditor.saving}
              onImageChange={profileEditor.handleImageChange}
              onRemoveImage={profileEditor.handleRemoveImage}
              onImageError={profileEditor.setImageError}
              size="large"
            />

            {/* Basic Info */}
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {userData.first_name} {userData.last_name}
              </h2>
              <p className="text-gray-600 font-medium text-xl mb-1">
                {getUserRole()}
              </p>
              <p className="text-gray-600 text-lg">
                {userData.barangay_name || "N/A"}, Iligan City 9200
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
                    stroke={
                      getProfileCompletion() === 100 ? "#10B981" : "#3B82F6"
                    }
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${
                      2 * Math.PI * 56 * (1 - getProfileCompletion() / 100)
                    }`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-gray-900">
                    {getProfileCompletion()}%
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

        {/* Personal Information */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-300 p-8 mb-6">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">
            Personal Information
          </h3>
          <hr className="border-t border-gray-200 mb-6" />

          <PersonalInfoSection
            formData={profileEditor.formData}
            userData={userData}
            editMode={profileEditor.editMode}
            saving={profileEditor.saving}
            onChange={profileEditor.handleInputChange}
            showUsername={true}
            showDateRegistered={true}
            showRoleId={false}
          />
        </div>

        {/* Address Information */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-300 p-8">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">
            Address Information
          </h3>
          <hr className="border-t border-gray-200 mb-6" />

          <AddressInfoSection
            formData={profileEditor.formData}
            userData={userData}
            editMode={profileEditor.editMode}
            saving={profileEditor.saving}
            onChange={profileEditor.handleInputChange}
          />
          <button
            onClick={() => setIsConfirmOpen(true)}
            className="px-4 py-2 mt-8 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Log Out
          </button>
        </div>
      </div>

      <LogOutModal 
        isOpen={isConfirmOpen} 
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => signout()}
        >
      </LogOutModal>
    </div>
  );
};

export default AccountPage;
