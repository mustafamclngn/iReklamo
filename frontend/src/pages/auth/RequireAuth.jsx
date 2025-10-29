import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "./useAuth.jsx";

const RequireAuth = ({ allowedRoles }) => {
    const { auth } = useAuth();
    const location = useLocation();

    if (auth === undefined) return null;

    const userRole = auth?.roles?.[0];
    const isAuthorized = auth?.roles?.some(role => allowedRoles?.includes(role));

    if (isAuthorized){
        return <Outlet />;
    }

    if (auth?.user) {
        let redirectPath = "/"

        switch (userRole){
            case "super_admin":
             redirectPath = "/superadmin/dashboard";
            break;
        case "city_admin":
            redirectPath = "/cityadmin/dashboard";
            break;
        case "brgy_cap":
            redirectPath = "/brgycap/dashboard";
            break;
        case "brgy_off":
            redirectPath = "/brgyoff/dashboard";
            break;
        default:
            redirectPath = "/home";
        }

        return <Navigate to={redirectPath} state={{ from: location }} replace />;
    }

    const defaultPath = location.state?.from?.pathname || "/home"
    return <Navigate to={defaultPath} state={{ from: location }} replace />
};

export default RequireAuth;