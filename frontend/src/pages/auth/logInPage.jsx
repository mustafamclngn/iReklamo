// ==================
// IMPORTS
// ==========

// =============
// Hooks and context
import { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth.jsx";
import useLogin from "../../hooks/useLogin.jsx"; 
import IliganLogo from "../../components/navheaders/iliganLogo.jsx";
import SuccessModal from '../../components/modals/SuccessModal';
import ErrorModal from '../../components/modals/ErrorModal';
import "./auth.css";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import useLockBodyScroll from '../../hooks/useLockBodyScroll';

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
    const [showPwd, setShowPwd] = useState(false);

    // =============
    // Error and Success messages 
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] =useState(false)

    // =============
    // State update

    // persist state
    const [persistChecked, setPersistChecked] = useState(
        JSON.parse(localStorage.getItem("persist")) || false
    );

    useEffect(() => {
        setPersist(persistChecked);
        localStorage.setItem("persist", JSON.stringify(persistChecked));
    }, [persistChecked, setPersist]);

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
        setLoading(true);
        try {

            const { role, user } = await login(identity, pwd)

            setIdentity('');
            setPwd('');

            // redirect path after login    
            let redirectPath = "/";

            const userRole = role?.[0];
            console.log(auth);
            switch (userRole) {
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
                    redirectPath = from;
            }

            navigate(redirectPath, { replace: true });

        } catch (err) {
            if (!err?.response) {
                console.log(err)
                setErrMsg('No Server Response');
                setIsErrorOpen(true)
            } else if (err.response?.status) {
                if(err?.response?.data?.error === "Incorrect password") {
                    console.log("Password error")
                }
                console.log(err?.response?.data)
                setErrMsg(err?.response?.data?.error);
                setIsErrorOpen(true);
            } else {
                setErrMsg('Login Failed');
                setIsErrorOpen(true)
            }
            errRef.current.focus();
        } finally {
            setLoading(false);
        }
    }

    // =============
    // Forgot Password handler
    const handleForgot = async (e) => {
        e.preventDefault();
        navigate("/auth/reset-password")        
    }
      
    const anyModalOpen = isSuccessOpen || isErrorOpen;
    useLockBodyScroll(anyModalOpen);

// ==========
// SETUP
// ==================


// ==================
// COMPONENT
// ==========
  return (
    <>
    <div className="auth-page-background">
        <div className="auth-wrapper">
            {/* Lgawas sa container */}
            <div className="auth-logo-wrapper">
                <IliganLogo scale={1.65} mode="login"/>
            </div>

            {/* container*/}
            <div className="auth-container">
                <p className="sessionmessage">Sign in to start your session</p>

                {/* ========== */}
                {/* FORM */}
                {/* === */}
                <form className="auth-form" onSubmit={handleSubmit}>
            
                    {/* ========== */}
                    {/* Username or Email */}
                    {/* input field */}
                    <div className="input-wrapper">
                        <input
                            type="text"
                            id="identity"
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setIdentity(e.target.value)}
                            value={identity}
                            required
                            placeholder="Username or Email"
                            className="auth-input"
                        />
                        <i className="bi bi-envelope-fill input-icon"></i>
                    </div>
                    
                    {/* ========== */}
                    {/* Password */}
                    {/* input field */}
                    <div className="input-row">
                        <div className="input-wrapper" style={{marginBottom: 0}}>
                            <input
                                type={showPwd ? "text" : "password"}
                                id="password"
                                autoComplete="off"
                                onChange={(e) => setPwd(e.target.value)}
                                value={pwd}
                                required
                                placeholder="Password"
                                className="auth-input"
                            />
                        </div>
                        <i
                            className={`bi ${showPwd ? "bi-eye-fill" : "bi-eye-slash-fill"} pwd-toggle`}
                            onClick={() => setShowPwd((prev) => !prev)}
                        />
                    </div>
                    
                    {/* ========== */}
                    {/* Persist */}
                    <div className="remember_me">
                        <input
                            type="checkbox"
                            className="remember_me_box"
                            id="rememberMe"
                            checked={persistChecked}
                            onChange={(e) => setPersistChecked(e.target.checked)}
                        />
                        <label htmlFor="rememberMe" className="remember_me_label">Remember Me</label>
                    </div>
                    
                    {/* Button */}
                    <button
                        className="auth-button"
                        disabled={!pwd || !identity}>
                        {loading ? 
                            (<LoadingSpinner message="" scale={0.45}/>)
                                    : (<span>Login</span>)}
                    </button>
                    
                    {/* ========== */}
                    {/* Forgot Password */}
                        <button 
                            type="button"
                            className="forget_password" 
                            onClick={handleForgot}>
                            Forgot Password?
                        </button>
                    {/* ========== */}           
                </form>
            </div>
        </div>
    </div>

        <SuccessModal
            isOpen={isSuccessOpen}
            onClose={() => setIsSuccessOpen(false)}
            onConfirm={() => setIsSuccessOpen(false)}
            message={successMessage}
        />
        
        <ErrorModal
            isOpen={isErrorOpen}
            onClose={() => setIsErrorOpen(false)}
            message={errMsg}
        />
    </>
  );
};

export default LogInPage;

// ==========
// COMPONENT
// ==================