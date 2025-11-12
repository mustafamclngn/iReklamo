import useAxiosPrivate from "../hooks/useAxiosPrivate";

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

  const getRoles = async () => {
    try {
      const response = await axiosPrivate.get(`/api/user_info/roles`);
      return response.data;
    } catch (error) {
      console.error('Error fetching roles list:', error);
      throw error;
    }
  };

  return { getBarangays, getRoles };
};

export default useUserInfoApi;
