import axios from './axios';

export const officialsApi = {
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

  getAllOfficials: async () => {
    try {
      const response = await axios.get('/api/officials');
      return response.data;
    } catch (error) {
      console.error('Error fetching all officials:', error);
      throw error;
    }
  }
};

export default officialsApi;