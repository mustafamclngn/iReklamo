import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";


const useOfficialsApi = () => {
  const axiosPrivate = useAxiosPrivate();
  
  // Get all officials under a barangay
  const getOfficialsByBarangay = async (barangay) => {
    try {
      const encodedBarangay = encodeURIComponent(barangay);
      const response = await axiosPrivate.get(`/api/officials?barangay=${encodedBarangay}`);
      console.log(response.data)
      return response.data;
    } catch (error) {
      console.error('Error fetching officials by barangay:', error);
      throw error;
    }
  };

  // Get all officials
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
      const response = await axiosPrivate.get(`/api/officials/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching official by ID:', error);
      throw error;
    }
  };

  return { getAllOfficials, getOfficialsByBarangay, getOfficialById }
};

export default useOfficialsApi;