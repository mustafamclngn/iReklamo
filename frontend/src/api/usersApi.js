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

    return axiosPrivate.patch(`/api/user/forgot-password`, {identity});
  };

  const resetPassword = async (token, password) => {

    return axiosPrivate.patch(`/api/user/reset-password`, {token, password});
  };

  return { revokePermissions, revokeAccount, forgotPassword, resetPassword };
};

export default useUsersApi;
