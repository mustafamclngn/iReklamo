// ==================
// IMPORTS
// ==========

// =============
// Design
import "./auth.css";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

// =============
// Hooks and context
import { useRef, useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth.jsx";
import useLogin from "../../hooks/useLogin.jsx"; 
import { Link, useNavigate, useLocation } from "react-router-dom";

// ==========
// IMPORTS
// ==================

const LogInPage = () => {
    
// ==================
// SETUP
// ==========

    // =============
    // Authorization Context
    const { auth, setPersist } = useAuth();
    const login = useLogin();

    // =============
    // Navigation
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/"

    // =============
    // References
    const userRef = useRef();
    const errRef = useRef();

    // =============
    // Identification states
    const [identity, setIdentity] = useState('');

    // =============
    // Password states
    const [pwd, setPwd] = useState('');

    // =============
    // Error messages 
    // TODO: Popup
    const [errMsg, setErrMsg] = useState('');

    // =============
    // State update

    // user reference state
    useEffect(() => {
        userRef.current.focus();
    }, [])

    // error message state
    useEffect(() => {
        setErrMsg('');
    }, [identity, pwd])

    // =============
    // Sumission handler
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const { role, user } = await login(identity, pwd)
            setPersist(true);
            localStorage.setItem("persist", true);

            setIdentity('');
            setPwd('');

            // redirect path after login    
            let redirectPath = "/";

            const userRole = role?.[0];
            console.log(auth);
            switch (userRole) {
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
                    redirectPath = from;
            }

            navigate(redirectPath, { replace: true });

        } catch (err) {
            if (!err?.response) {
                console.log(err)
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    }

// ==========
// SETUP
// ==================


// ==================
// COMPONENT
// ==========
  return (
    <div className="auth-container">

        {/* ========== */}
        {/* Error Message */}
        <p 
            ref={errRef} 
            className={errMsg ? "errmsg" : "offscreen"} 
            aria-live="assertive">

                {errMsg}
        </p>

        {/* ========== */}
        {/* Header */}
        <h1 className="auth-title">iReklamo</h1>


        {/* ========== */}
        {/* FORM */}
        {/* === */}
        <form className="auth-form" onSubmit={handleSubmit}>
        
        {/* ========== */}
            {/* Username or Email */}

            {/* label */}
            <label className="auth-label" htmlFor="identity">
                Username/Email:
            </label>

            {/* input field */}
            <input
                type="text"
                id="identity"
                ref={userRef}
                autoComplete="off"
                onChange={(e) => setIdentity(e.target.value)}
                required
                placeholder="Enter your username/email"
                className="auth-input"
            />

            {/* ========== */}
            {/* Password */}

            {/* label */}
            <label className="auth-label" htmlFor="password">
                Password:
            </label>
            
            {/* input field */}
            <input
                type="password"
                id="password"
                autoComplete="off"
                onChange={(e) => setPwd(e.target.value)}
                required
                placeholder="Enter your password"
                className="auth-input"
            />

            {/* ========== */}
            {/* Button */}
            <button 
                className="auth-button"
                disabled={!pwd || !identity}>

                    LOG IN

            </button>
        </form>
    </div>
  );
};

export default LogInPage;

// ==========
// COMPONENT
// ==================