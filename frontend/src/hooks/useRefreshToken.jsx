import { useCallback } from "react";
import useAuth from "./useAuth";
import axios from "../api/axios";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = useCallback(async () => {
    const response = await axios.get("/api/auth/refresh", { withCredentials: true });
    setAuth(prev => ({
      ...prev,
      roles: response.data.roles || prev.roles,
      accessToken: response.data.accessToken
    }));
    return response.data.accessToken;
  }, [setAuth]);

  return refresh;
};

export default useRefreshToken;
