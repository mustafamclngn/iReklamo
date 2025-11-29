/**
 * handle form changes
 */
export const handleFormChange = (e, setFormData) => {
  const { name, value, type, checked } = e.target;
  setFormData((prev) => ({
    ...prev,
    [name]: type === "checkbox" ? checked : value,
  }));
};

/**
 * reset changes
 */
export const resetForm = (originalData, setFormData) => {
  setFormData({ ...originalData });
};

/**
 * create FormDate
 */

export const createFormData = (data, excludeFields = []) => {
  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    if (!excludeFields.includes(key)) {
      const value = data[key];
      if (value !== null && value !== undefined) {
        if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      }
    }
  });

  return formData;
};
