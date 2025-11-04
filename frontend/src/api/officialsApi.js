import axios from './axios';

export const officialsApi = {
  // Get officials by barangay
  getOfficialsByBarangay: async (barangay) => {
    try {
      const encodedBarangay = encodeURIComponent(barangay);
      const response = await axios.get(`/api/officials?barangay=${encodedBarangay}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching officials by barangay:', error);
      throw error;
    }
  },

  // Get all officials
  getAllOfficials: async () => {
    try {
      const response = await axios.get('/api/officials');
      return response.data;
    } catch (error) {
      console.error('Error fetching all officials:', error);
      throw error;
    }
  },

  // Get single official by ID
  getOfficialById: async (userId) => {
    try {
      const response = await axios.get(`/api/officials/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching official by ID:', error);
      throw error;
    }
  }
};

export default officialsApi;