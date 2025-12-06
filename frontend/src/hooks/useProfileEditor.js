import { useState, useCallback } from "react";
import {
  validateEmail,
  validatePhone,
  validateImageFile,
} from "../utils/validators";
import { fileToDataURL } from "../utils/imageHelpers";
import { formatDateForInput } from "../utils/formatters";
import { toTitleCase } from "../utils/stringHelpers";

const useProfileEditor = (userData, updateApi, userId, onSuccess) => {
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
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

  // intialize current data sa user
  const initializeForm = useCallback(() => {
    if (userData) {
      setFormData({
        first_name: userData.first_name || "",
        last_name: userData.last_name || "",
        email: userData.email || "",
        contact_number: userData.contact_number || "",
        sex: userData.sex || "",
        birthdate: formatDateForInput(userData.birthdate),
        purok: userData.purok || "",
        street: userData.street || "",
        profile_picture: userData.profile_picture,
      });
    }
  }, [userData]);

  // text change
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;

    if (name === "first_name" || name === "last_name") {
      setFormData((prev) => ({ ...prev, [name]: toTitleCase(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  // image change
  const handleImageChange = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validation = validateImageFile(file, 5);
    if (!validation.isValid) {
      alert(validation.error);
      return;
    }

    setImageFile(file);
    try {
      const dataURL = await fileToDataURL(file);
      setPreviewImage(dataURL);
    } catch (error) {
      console.error("Failed to create image preview:", error);
      alert("Failed to load image preview");
    }
  }, []);

  // remove image
  const handleRemoveImage = useCallback(() => {
    setPreviewImage(null);
    setImageFile(null);
  }, []);

  // Validate form before saving
  const validateForm = useCallback(() => {
    if (!formData.first_name || !formData.last_name || !formData.email) {
      alert(
        "Please fill in all required fields (First Name, Last Name, Email)"
      );
      return false;
    }

    if (!validateEmail(formData.email)) {
      alert("Please enter a valid email address");
      return false;
    }

    if (formData.contact_number && !validatePhone(formData.contact_number)) {
      alert("Please enter a valid 11-digit phone number (09XXXXXXXXX)");
      return false;
    }

    return true;
  }, [formData]);

  // save button to show confirm modal
  const handleSaveClick = useCallback(() => {
    if (!validateForm()) return;
    setShowConfirmModal(true);
  }, [validateForm]);

  // confirm save
  const handleConfirmSave = useCallback(async () => {
    try {
      setSaving(true);

      const formDataToSend = new FormData();

      Object.keys(formData).forEach((key) => {
        if (
          key !== "profile_picture" &&
          formData[key] !== null &&
          formData[key] !== undefined
        ) {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (imageFile) {
        formDataToSend.append("profile_picture", imageFile);
      }

      const response = await updateApi(userId, formDataToSend);

      if (response.success) {
        setEditMode(false);
        setPreviewImage(null);
        setImageFile(null);
        setShowConfirmModal(false);

        if (onSuccess) {
          await onSuccess(response);
        }
      } else {
        alert(response.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      alert("An error occurred while saving. Please try again.");
    } finally {
      setSaving(false);
    }
  }, [formData, imageFile, updateApi, userId, onSuccess]);

  // cancel
  const handleCancel = useCallback(() => {
    initializeForm();
    setPreviewImage(null);
    setImageFile(null);
    setEditMode(false);
  }, [initializeForm]);

  // edit
  const startEdit = useCallback(() => {
    initializeForm();
    setEditMode(true);
  }, [initializeForm]);

  return {
    editMode,
    saving,
    formData,
    previewImage,
    imageFile,
    showConfirmModal,
    imageError,

    setShowConfirmModal,
    setImageError,
    startEdit,
    handleInputChange,
    handleImageChange,
    handleRemoveImage,
    handleSaveClick,
    handleConfirmSave,
    handleCancel,
    initializeForm,
  };
};

export default useProfileEditor;