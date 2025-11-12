import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RedirectFallback = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth?.user) {
      navigate("/home", { replace: true });
      return;
    }

    const role = auth?.role?.[0];
    switch (role) {
      case 1:
        navigate("/superadmin/dashboard", { replace: true });
        break;
      case 2:
        navigate("/cityadmin/dashboard", { replace: true });
        break;
      case 3:
        navigate("/brgycap/dashboard", { replace: true });
        break;
      case 4:
        navigate("/brgyoff/dashboard", { replace: true });
        break;
      default:
        navigate("/home", { replace: true });
        break;
    }
  }, [auth, navigate]);

  return null;
};

export default RedirectFallback;
