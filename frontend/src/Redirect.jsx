import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "./pages/auth/useAuth";

const RedirectFallback = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth?.user) {
      navigate("/home", { replace: true });
      return;
    }

    const role = auth?.roles?.[0];

    switch (role) {
      case "super_admin":
        navigate("/superadmin/dashboard", { replace: true });
        break;
      case "city_admin":
        navigate("/cityadmin/dashboard", { replace: true });
        break;
      case "brgy_cap":
        navigate("/brgycap/dashboard", { replace: true });
        break;
      case "brgy_off":
        navigate("/brgyoff/dashboard", { replace: true });
        break;
      case "user":
        navigate("/home", { replace: true });
        break;
      default:
        navigate("/home", { replace: true });
        break;
    }
  }, [auth, navigate]);

  return null;
};

export default RedirectFallback;
