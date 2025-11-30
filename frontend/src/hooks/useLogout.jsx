import axios from "../api/axios";
import useAuth from "./useAuth";
const LOGOUT_URL = "/api/auth/logout";

const useLogOut = () => {
    const { setAuth } = useAuth();

    const logout = async () => {

        try {
            const response = await axios.post(
                LOGOUT_URL, 
                {},
                {
                withCredentials: true
                }
            );
            setAuth({});
        } 

        catch (err) {
            console.error(err);
        }
    }

    return logout;
}

export default useLogOut;