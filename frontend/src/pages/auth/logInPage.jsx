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
import useUsersApi from '../../api/usersApi.js'
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";

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
    const { forgotPassword } = useUsersApi();
    const [forgotCooldown, setForgotCooldown] = useState(0);

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

    useEffect(() => {
        const stored = localStorage.getItem("forgotCooldown");
        if (stored) {
            const expiresAt = Number(stored);
            const now = Date.now();

            if (expiresAt > now) {
                setForgotCooldown(Math.floor((expiresAt - now) / 1000));
            }
        }
    }, []);

    useEffect(() => {
        if (forgotCooldown <= 0) return;

        const interval = setInterval(() => {
            setForgotCooldown(prev => {
                if (prev <= 1) {
                    localStorage.removeItem("forgotCooldown");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [forgotCooldown]);


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

        if (forgotCooldown > 0) return;

        setLoading(true)
        try{
            const response = await forgotPassword(identity)
            setSuccessMessage(response?.data?.message)
            setIsSuccessOpen(true)
            
            const expiresAt = Date.now() + 15 * 60 * 1000; 
            localStorage.setItem("forgotCooldown", expiresAt);
            setForgotCooldown(15 * 60);

        } catch (err) {
            if (!err?.response) {
                console.log(err)
                setErrMsg('No Server Response');
                setIsErrorOpen(true)
            }
            else if (err.response?.status) {
                console.log(err?.response?.data)
                setErrMsg(err?.response?.data?.error);
                setIsErrorOpen(true);
            } 
        } finally {
            setLoading(false);
        }
        
    }

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
                            placeholder="Email"
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
                    {(forgotCooldown <= 0) ? 
                        (<button 
                            type="button"
                            className="forget_password" 
                            onClick={handleForgot} 
                            disabled={!identity || forgotCooldown > 0}>
                            Forgot Password?
                        </button>)
                            :
                        <p className="forgot_pressed">Request to reset password has already been sent to your email.</p>}
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