import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth.jsx";

const RequireAuth = ({ allowedRoles }) => {
    const { auth } = useAuth();
    const location = useLocation();

    if (auth === undefined) return null;

    const userRole = auth?.role?.[0];
    const isAuthorized = allowedRoles?.includes(userRole);

    if (!auth?.accessToken){
        return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }

    if (!isAuthorized) {
        let redirectPath = "/"

        switch (userRole){
            case 1:
                redirectPath = "/superadmin/dashboard";
                break;
            case 2:
                redirectPath = "/cityadmin/dashboard";
                break;
            case 3:
                redirectPath = "/brgycap/dashboard";
                break;
            case 4:
                redirectPath = "/brgyoff/dashboard";
                break;
            default:
                redirectPath = "/home";
        }

        return <Navigate to={redirectPath} replace />;
    }

    return <Outlet />
};

export default RequireAuth;