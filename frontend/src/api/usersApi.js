import useAxiosPrivate from "../hooks/useAxiosPrivate";

const useUsersApi = () => {
  const axiosPrivate = useAxiosPrivate();

  const revokePermissions = async (userId) => {
    return axiosPrivate.patch(`/api/user/${userId}/revoke-permissions`);
  };

  const revokeAccount = async (userId) => {
    return axiosPrivate.delete(`/api/user/${userId}/revoke-account`);
  };

  return { revokePermissions, revokeAccount };
};

export default useUsersApi;
