/**
 * calculate profile completion
 */

export const calculateProfileCompletion = (profile, requiredFields) => {
  if (!profile || !requiredFields || requiredFields.length === 0) return 0;

  const filledFields = requiredFields.filter((field) => {
    const value = profile[field];
    if (value === null || value === undefined || value === "") return false;
    return true;
  }).length;

  return Math.round((filledFields / requiredFields.length) * 100);
};

/**
 * get full name
 */

export const getFullName = (firstName, lastName, middleName = "") => {
  const parts = [firstName, middleName, lastName].filter(Boolean);
  return parts.join(" ") || "N/A";
};
