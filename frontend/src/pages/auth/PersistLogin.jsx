import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import useRefreshToken from "../../hooks/useRefreshToken";
import useAuth from "../../hooks/useAuth";

const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken(); 
    const { auth, persist } = useAuth();

    useEffect(() => {
        let isMounted = true;

        const verifyRefreshToken = async () => {
            try {
                await refresh();
            } catch (err) {
                console.error("refresh failed:", err);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        console.log("=== PERSIST LOGIN RENDER ===");
        console.log("auth:", auth);
        console.log("persist:", persist);

        if (!auth?.accessToken && persist) {
            verifyRefreshToken();
            }
        else {
            setIsLoading(false);
        };

        return () => { isMounted = false; };
    }, [auth?.accessToken, persist, refresh]);

    if (!persist) return <Outlet />;
    
    return isLoading ? <p>Loading...</p> : <Outlet />;
};

export default PersistLogin;
