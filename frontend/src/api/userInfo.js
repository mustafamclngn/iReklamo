import useAxiosPrivate from "../hooks/useAxiosPrivate";
import axios from "./axios";

const useUserInfoApi = () => {
  const axiosPrivate = useAxiosPrivate();

  const getBarangays = async () => {
    try {
      const response = await axiosPrivate.get(`/api/user_info/barangay`);
      return response.data;
    } catch (error) {
      console.error('Error fetching barangay list:', error);
      throw error;
    }
  };

  const getBarangayById = async (brgy_id) => {
    try {
      console.log("API received brgy_id for searhing: ",brgy_id);
      const response = await axiosPrivate.get(`/api/user_info/barangay?barangay_id=${brgy_id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching barangay:', error);
      throw error;
    }
  }

  const getRoles = async () => {
    try {
      const response = await axiosPrivate.get(`/api/user_info/roles`);
      return response.data;
    } catch (error) {
      console.error('Error fetching roles list:', error);
      throw error;
    }
  };

  return { getBarangays, getBarangayById, getRoles };
};

export default useUserInfoApi;
