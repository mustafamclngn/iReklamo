// reusable profile form rani para sa edit account na feature para dli na mag balik2 og paste sa file
import React from "react";
import { Camera, X } from "lucide-react";
import { formatDate, formatPhone } from "../../utils/formatters";
import { getImageURL } from "../../utils/imageHelpers";

export const FormField = ({
  label,
  name,
  value,
  displayValue,
  editMode,
  type = "text",
  required = false,
  disabled = false,
  onChange,
  placeholder,
  maxLength,
  options = null,
  readOnly = false,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-2">
        {label}{" "}
        {editMode && required && <span className="text-red-500">*</span>}
      </label>
      {editMode && !readOnly ? (
        options ? (
          <select
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          // text date inpout
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder={placeholder}
            maxLength={maxLength}
            required={required}
          />
        )
      ) : (
        // display
        <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
          <p className="text-gray-900 font-medium text-lg">
            {type === "date" && displayValue
              ? formatDate(displayValue)
              : type === "tel" && displayValue
              ? formatPhone(displayValue)
              : displayValue || "N/A"}
          </p>
        </div>
      )}
    </div>
  );
};

/**
 * edit profile picture
 */
export const ProfilePictureSection = ({
  profilePicture,
  previewImage,
  imageError,
  editMode,
  disabled,
  onImageChange,
  onRemoveImage,
  onImageError,
  size = "large",
}) => {
  const hasValidImage = (profilePicture || previewImage) && !imageError;
  const displayImage = previewImage || getImageURL(profilePicture);

  const sizeClasses = size === "large" ? "w-40 h-40" : "w-32 h-32";
  const iconSize = size === "large" ? "text-6xl" : "text-5xl";
  const cameraSize = size === "large" ? "w-10 h-10" : "w-8 h-8";
  const cameraIconSize = size === "large" ? "w-5 h-5" : "w-4 h-4";

  return (
    <div className="flex-shrink-0">
      <div className="relative">
        <div
          className={`${sizeClasses} bg-gray-200 ${
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
              onError={() => onImageError(true)}
            />
          ) : (
            <i className={`bi bi-person ${iconSize} text-gray-400`}></i>
          )}
        </div>
        {editMode && (
          <div className="absolute bottom-2 right-2">
            <label htmlFor="profile-picture" className="cursor-pointer">
              <div
                className={`${cameraSize} bg-green-600 rounded-full flex items-center justify-center hover:bg-green-700 transition-colors shadow-lg`}
              >
                <Camera className={`${cameraIconSize} text-white`} />
              </div>
              <input
                id="profile-picture"
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/gif"
                className="hidden"
                onChange={onImageChange}
                disabled={disabled}
              />
            </label>
          </div>
        )}
        {editMode && hasValidImage && (
          <button
            onClick={onRemoveImage}
            disabled={disabled}
            className="absolute top-2 right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            title="Remove image"
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
  );
};

/**
 * personal information
 */
export const PersonalInfoSection = ({
  formData,
  userData,
  editMode,
  saving,
  onChange,
  showUsername = false,
  showDateRegistered = false,
  showRoleId = false,
  getRoleLabel = null,
}) => {
  return (
    <div className="grid grid-cols-2 gap-6">
      <FormField
        label="First Name"
        name="first_name"
        value={formData.first_name}
        displayValue={userData.first_name}
        editMode={editMode}
        required
        disabled={saving}
        onChange={onChange}
        placeholder="Enter first name"
      />
      <FormField
        label="Last Name"
        name="last_name"
        value={formData.last_name}
        displayValue={userData.last_name}
        editMode={editMode}
        required
        disabled={saving}
        onChange={onChange}
        placeholder="Enter last name"
      />
      <FormField
        label="Sex"
        name="sex"
        value={formData.sex}
        displayValue={userData.sex}
        editMode={editMode}
        disabled={saving}
        onChange={onChange}
        options={[
          { value: "", label: "Select sex" },
          { value: "Male", label: "Male" },
          { value: "Female", label: "Female" },
        ]}
      />
      <FormField
        label="Date of Birth"
        name="birthdate"
        type="date"
        value={formData.birthdate}
        displayValue={userData.birthdate}
        editMode={editMode}
        disabled={saving}
        onChange={onChange}
      />
      <FormField
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        displayValue={userData.email}
        editMode={editMode}
        required
        disabled={saving}
        onChange={onChange}
        placeholder="Enter email address"
      />
      <FormField
        label="Contact Number"
        name="contact_number"
        type="tel"
        value={formData.contact_number}
        displayValue={userData.contact_number}
        editMode={editMode}
        disabled={saving}
        onChange={onChange}
        placeholder="09XXXXXXXXX"
        maxLength="11"
      />
      {showUsername && (
        <FormField
          label="Username"
          name="user_name"
          value={userData.user_name}
          displayValue={userData.user_name}
          editMode={false}
          readOnly
        />
      )}
      {showRoleId && getRoleLabel && (
        <FormField
          label="User Role"
          name="role_id"
          value={getRoleLabel(userData.role_id)}
          displayValue={getRoleLabel(userData.role_id)}
          editMode={false}
          readOnly
        />
      )}
      {showDateRegistered && (
        <FormField
          label="Date Registered"
          name="created_at"
          type="date"
          value={userData.created_at}
          displayValue={userData.created_at}
          editMode={false}
          readOnly
        />
      )}
    </div>
  );
};

/**
 * address information
 */
export const AddressInfoSection = ({
  formData,
  userData,
  editMode,
  saving,
  onChange,
}) => {
  return (
    <div className="grid grid-cols-2 gap-6">
      <FormField
        label="Purok / House No."
        name="purok"
        value={formData.purok}
        displayValue={userData.purok}
        editMode={editMode}
        disabled={saving}
        onChange={onChange}
        placeholder="Enter purok or house number"
      />
      <FormField
        label="Street / Sitio"
        name="street"
        value={formData.street}
        displayValue={userData.street}
        editMode={editMode}
        disabled={saving}
        onChange={onChange}
        placeholder="Enter street or sitio"
      />
      <FormField
        label="Barangay"
        name="barangay_name"
        value={userData.barangay_name}
        displayValue={userData.barangay_name}
        editMode={false}
        readOnly
      />
      <FormField
        label="City"
        name="city"
        value="Iligan City"
        displayValue="Iligan City"
        editMode={false}
        readOnly
      />
    </div>
  );
};