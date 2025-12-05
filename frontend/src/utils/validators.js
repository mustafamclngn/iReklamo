/**
 * validate email format
 */

export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/**
 * validate contact number
 */

export const validatePhone = (phone) => {
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.length === 11 && cleaned.startsWith("09");
};

/**
 * validate image file
 */

export const validateImageFile = (file, maxSizeMB = 5) => {
  if (!file) {
    return { isValid: false, message: "No file selected" };
  }

  if (file.size > maxSizeMB * 1024 * 1024) {
    return {
      isValid: false,
      message: `Image size should be less than ${maxSizeMB}MB`,
    };
  }

  if (!file.type.startsWith("image/")) {
    return { isValid: false, message: "Please select a valid image file" };
  }

  const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      message: "Only PNG, JPG, JPEG, and GIF files are allowed",
    };
  }

  return { isValid: true, message: "Valid image file" };
};
