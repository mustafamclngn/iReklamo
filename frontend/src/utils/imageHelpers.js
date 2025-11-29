/**
 * covert image file for preview
 */

export const fileToDataURL = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * image url display
 */

export const getImageURL = (imagePath, baseURL = "http://localhost:5000") => {
  if (!imagePath) return null;
  if (imagePath.startsWith("data:")) return imagePath;
  if (imagePath.startsWith("http")) return imagePath;
  return `${baseURL}${imagePath}`;
};
