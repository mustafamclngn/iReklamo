import axios from "../api/axios";
import useAuth from "./useAuth";

const LogOut = () => {
    const { setAuth } = useAuth();

    const logout = async () => {

        try {
            const response = await axios( '/auth/logout', {
                withCredentials: true
            });
        } 

        catch (err) {
            console.error(err);
        }
    }

    return logout;
}

export default LogOut;