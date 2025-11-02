import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth.jsx";

const RequireAuth = ({ allowedRoles }) => {
    const { auth } = useAuth();
    const location = useLocation();

    if (auth === undefined) return null;

    const userRole = auth?.roles?.[0];
    const isAuthorized = allowedRoles?.includes(userRole);

    if (!auth?.accessToken){
        return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }

    if (!isAuthorized) {
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

        return <Navigate to={redirectPath} replace />;
    }

    return <Outlet />
};

export default RequireAuth;