import useAxiosPrivate from "../hooks/useAxiosPrivate";

const useOfficialsApi = () => {
  const axiosPrivate = useAxiosPrivate();

  const getOfficialsByBarangay = async (barangay) => {
    try {
      const encodedBarangay = encodeURIComponent(barangay);
      const response = await axiosPrivate.get(`/api/officials?barangay=${encodedBarangay}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching officials by barangay:', error);
      throw error;
    }
  };

  const getAllOfficials = async () => {
    try {
      const response = await axiosPrivate.get('/api/officials');
      return response.data;
    } catch (error) {
      console.error('Error fetching all officials:', error);
      throw error;
    }
  };

  // Get single official by ID
  const getOfficialById = async (userId) => {
    try {
      const response = await axios.get(`/api/officials/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching official by ID:', error);
      throw error;
    }
  }
};

export default useOfficialsApi;