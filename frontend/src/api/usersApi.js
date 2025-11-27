import useAxiosPrivate from "../hooks/useAxiosPrivate";

const useUsersApi = () => {
  const axiosPrivate = useAxiosPrivate();

  const revokePermissions = async (userId) => {
    return axiosPrivate.patch(`/api/user/${userId}/revoke-permissions`);
  };

  const revokeAccount = async (userId) => {
    return axiosPrivate.delete(`/api/user/${userId}/revoke-account`);
  };

  const forgotPassword = async (identity) => {

    return axiosPrivate.patch(`/api/user/${identity}/forgot-password`);
  };

  return { revokePermissions, revokeAccount, forgotPassword };
};

export default useUsersApi;
