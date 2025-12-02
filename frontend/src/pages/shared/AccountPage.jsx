import React, { useState, useEffect } from "react";
import { Camera, Save, X, AlertCircle } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import useOfficialsApi from "../../api/officialsApi";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { formatDate, formatPhone } from "../../utils/formatters";
import {
  validateEmail,
  validatePhone,
  validateImageFile,
} from "../../utils/validators";
import { fileToDataURL, getImageURL } from "../../utils/imageHelpers";
import { calculateProfileCompletion } from "../../utils/profileHelpers";
import {
  handleFormChange,
  resetForm,
  createFormData,
} from "../../utils/formHelpers";

const AccountPage = () => {
  const { auth } = useAuth();
  const { getOfficialById, updateOfficial } = useOfficialsApi();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [imageError, setImageError] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    contact_number: "",
    sex: "",
    birthdate: "",
    purok: "",
    street: "",
    profile_picture: null,
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);

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

  // Helper function to determine user role
  const getUserRole = () => {
    if (!userData) return "User";
    return userData.role || userData.position || "User";
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await getOfficialById(auth?.user?.user_id);

      if (response.success && response.data) {
        setUserData(response.data);
        setFormData({
          first_name: response.data.first_name || "",
          last_name: response.data.last_name || "",
          email: response.data.email || "",
          contact_number: response.data.contact_number || "",
          sex: response.data.sex || "",
          birthdate: response.data.birthdate
            ? response.data.birthdate.split("T")[0]
            : "",
          purok: response.data.purok || "",
          street: response.data.street || "",
          profile_picture: response.data.profile_picture,
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    handleFormChange(e, setFormData);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validation = validateImageFile(file, 5);
    if (!validation.isValid) {
      return;
    }

    setImageFile(file);
    try {
      const dataURL = await fileToDataURL(file);
      setPreviewImage(dataURL);
    } catch (error) {
      console.error("Failed image preview");
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    setImageFile(null);
  };

  const handleSave = async () => {
    try {
      if (!formData.first_name || !formData.last_name || !formData.email) {
        return;
      }

      if (!validateEmail(formData.email)) {
        return;
      }

      if (formData.contact_number && !validatePhone(formData.contact_number)) {
        return;
      }

      setSaving(true);

      const formDataToSend = createFormData(formData, ["profile_picture"]);

      if (imageFile) {
        formDataToSend.append("profile_picture", imageFile);
      }

      const response = await updateOfficial(auth.user.user_id, formDataToSend);

      if (response.success) {
        const updatedUser = {
          ...userData,
          ...formData,
          profile_picture:
            response.data?.profile_picture || userData.profile_picture,
        };

        setUserData(updatedUser);
        setFormData({
          ...formData,
          profile_picture:
            response.data?.profile_picture || userData.profile_picture,
        });

        setEditMode(false);
        setPreviewImage(null);
        setImageFile(null);

        await fetchUserData();
      }
    } catch (error) {
      console.error("Error saving data:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    const originalData = {
      first_name: userData.first_name || "",
      last_name: userData.last_name || "",
      email: userData.email || "",
      contact_number: userData.contact_number || "",
      sex: userData.sex || "",
      birthdate: userData.birthdate ? userData.birthdate.split("T")[0] : "",
      purok: userData.purok || "",
      street: userData.street || "",
      profile_picture: userData.profile_picture,
    };
    resetForm(originalData, setFormData);
    setPreviewImage(null);
    setImageFile(null);
    setEditMode(false);
  };

  const getProfileCompletion = () => {
    if (!userData) return 0;

    const profileData = {
      ...userData,
      profile_picture:
        userData.profile_picture && !imageError
          ? userData.profile_picture
          : null,
    };

    return calculateProfileCompletion(profileData, profileFields);
  };

  const hasValidImage =
    (userData?.profile_picture || previewImage) && !imageError;
  const displayImage = previewImage || getImageURL(userData?.profile_picture);

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
      <div className="max-w-[1591px] mx-auto px-8 py-8">
        {/* header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            View Account Details
          </h1>
          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2 text-lg"
            >
              <i className="bi bi-pencil-square"></i>
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                disabled={saving}
                className="px-6 py-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="w-5 h-5" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg border border-gray-300 p-8 mb-6">
          <div className="flex items-center gap-8">
            <div className="flex-shrink-0">
              <div className="relative">
                <div
                  className={`w-40 h-40 bg-gray-200 ${
                    hasValidImage
                      ? "border-0"
                      : "border-2 border-dashed border-gray-400"
                  } rounded-lg flex items-center justify-center overflow-hidden`}
                >
                  {hasValidImage ? (
                    <img
                      src={displayImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <i className="bi bi-person text-6xl text-gray-400"></i>
                  )}
                </div>
                {editMode && (
                  <div className="absolute bottom-2 right-2">
                    <label htmlFor="profile-picture" className="cursor-pointer">
                      <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-700 transition-colors shadow-lg">
                        <Camera className="w-5 h-5 text-white" />
                      </div>
                      <input
                        id="profile-picture"
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/gif"
                        className="hidden"
                        onChange={handleImageChange}
                        disabled={saving}
                      />
                    </label>
                  </div>
                )}
                {editMode && previewImage && (
                  <button
                    onClick={handleRemoveImage}
                    disabled={saving}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                )}
              </div>
              {editMode && (
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Max 5MB
                  <br />
                  PNG, JPG, GIF
                </p>
              )}
            </div>

            {/* info */}
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

            {/* profile completion circle */}
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

        {/* personal information */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-300 p-8 mb-6">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">
            Personal Information
          </h3>
          <hr className="border-t border-gray-200 mb-6" />

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                First Name <span className="text-red-500">*</span>
              </label>
              {editMode ? (
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  disabled={saving}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Enter first name"
                  required
                />
              ) : (
                <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                  <p className="text-gray-900 font-medium text-lg">
                    {userData.first_name}
                  </p>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Last Name <span className="text-red-500">*</span>
              </label>
              {editMode ? (
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  disabled={saving}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Enter last name"
                  required
                />
              ) : (
                <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                  <p className="text-gray-900 font-medium text-lg">
                    {userData.last_name}
                  </p>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Sex
              </label>
              {editMode ? (
                <select
                  name="sex"
                  value={formData.sex}
                  onChange={handleInputChange}
                  disabled={saving}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Select sex</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              ) : (
                <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                  <p className="text-gray-900 font-medium text-lg">
                    {userData.sex || "N/A"}
                  </p>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Date of Birth
              </label>
              {editMode ? (
                <input
                  type="date"
                  name="birthdate"
                  value={formData.birthdate}
                  onChange={handleInputChange}
                  disabled={saving}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              ) : (
                <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                  <p className="text-gray-900 font-medium text-lg">
                    {formatDate(userData.birthdate)}
                  </p>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              {editMode ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={saving}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Enter email address"
                  required
                />
              ) : (
                <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                  <p className="text-gray-900 font-medium text-lg">
                    {userData.email}
                  </p>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Contact Number
              </label>
              {editMode ? (
                <input
                  type="text"
                  name="contact_number"
                  value={formData.contact_number}
                  onChange={handleInputChange}
                  disabled={saving}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="09XXXXXXXXX"
                  maxLength="11"
                />
              ) : (
                <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                  <p className="text-gray-900 font-medium text-lg">
                    {formatPhone(userData.contact_number)}
                  </p>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Username
              </label>
              <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                <p className="text-gray-900 font-medium text-lg">
                  {userData.user_name || "N/A"}
                </p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Date Registered
              </label>
              <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                <p className="text-gray-900 font-medium text-lg">
                  {formatDate(userData.created_at)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* address information */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-300 p-8">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">
            Address Information
          </h3>
          <hr className="border-t border-gray-200 mb-6" />

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Purok / House No.
              </label>
              {editMode ? (
                <input
                  type="text"
                  name="purok"
                  value={formData.purok}
                  onChange={handleInputChange}
                  disabled={saving}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Enter purok or house number"
                />
              ) : (
                <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                  <p className="text-gray-900 font-medium text-lg">
                    {userData.purok || "N/A"}
                  </p>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Street / Sitio
              </label>
              {editMode ? (
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  disabled={saving}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Enter street or sitio"
                />
              ) : (
                <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                  <p className="text-gray-900 font-medium text-lg">
                    {userData.street || "N/A"}
                  </p>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Barangay
              </label>
              <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                <p className="text-gray-900 font-medium text-lg">
                  {userData.barangay_name || "N/A"}
                </p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                City
              </label>
              <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                <p className="text-gray-900 font-medium text-lg">Iligan City</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;