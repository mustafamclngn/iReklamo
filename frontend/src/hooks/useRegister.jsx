import axios from "../api/axios";
const REGISTER_URL = "/api/auth/register"

const useRegister = () => {

    const register = async (identity) => {
    const response = await axios.post(
        REGISTER_URL,
        JSON.stringify(identity),
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
    );


    return response.data;
    };

return register;
};

export default useRegister;

