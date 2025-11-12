import { createContext, useState, useEffect, useRef } from "react";
import axios from "../api/axios";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [persist, setPersist] = useState(
    JSON.parse(localStorage.getItem("persist")) || false
  );
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const refreshAccessToken = async () => {
      try {
        if (!persist) {
          setLoading(false);
          return;
        }

        const response = await axios.get("/api/auth/refresh", {
          withCredentials: true,
        });
        if (!mountedRef.current) return;

        const { accessToken, role, user } = response.data;
        setAuth({ accessToken, role, user });
        console.log("Access token refreshed:", role);
      } catch (error) {
        if (!mountedRef.current) return;
        console.error("Failed to refresh access token:", error);
        setAuth({});
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    };

    refreshAccessToken();
  }, [persist]);

  useEffect(() => {
    localStorage.setItem("persist", JSON.stringify(persist));
  }, [persist]);

  return (
    <AuthContext.Provider value={{ auth, setAuth, persist, setPersist, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
