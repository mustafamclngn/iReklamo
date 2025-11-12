import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
const LOGIN_URL = "/api/auth/login"

const useLogin = () => {
    const { setAuth } = useAuth();

    const login = async (identity, pwd) => {
    const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ identity, pwd }),
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
    );

    const { accessToken, role, user } = response.data;
    setAuth({ accessToken, role, user });

    return { accessToken, role, user };
    };

return login;
};

export default useLogin;
