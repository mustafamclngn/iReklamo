import { useCallback } from "react";
import useAuth from "./useAuth";
import axios from "../api/axios";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = useCallback(async () => {
    const response = await axios.get("/api/auth/refresh", { withCredentials: true });
    setAuth(prev => ({
      ...prev,
      accessToken: response.data.accessToken,
      role: response.data.role || prev.role,
      user: response.data.user || prev.user 
    }));
    return response.data.accessToken;
  }, [setAuth]);

  return refresh;
};

export default useRefreshToken;
