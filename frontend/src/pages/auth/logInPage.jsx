
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
    const [incPwd, setincPwd] = useState(false)
    const { forgotPassword } = useUsersApi();

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
                    setincPwd(true);
                }
                console.log(err?.response?.data)
                setErrMsg(err?.response?.data?.error);
                setIsErrorOpen(true);
                setIsErrorOpen(true)
            } else if (err.response?.status) {
                if(err?.response?.data?.error === "Incorrect password") {
                    console.log("Password error")
                    setincPwd(true);
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
        }
    }

    // =============
    // Forgot Password handler
    const handleForgot = async (e) => {
        e.preventDefault();
        setLoading(true)
        try{
            const response = await forgotPassword(identity)
            if (response.success) {
                setSuccessMessage(response?.data?.message)
                setIsSuccessOpen(true)
            }
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
            setincPwd(false);
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
        <div className="auth-container">

            <IliganLogo scale={1.65} mode="login"/>
            <p className="sessionmessage">Sign in to start your session</p>

            {/* ========== */}
            {/* FORM */}
            {/* === */}
            <form className="auth-form" onSubmit={handleSubmit}>
        
            {/* ========== */}
                {/* Username or Email */}
                {/* label */}
                {/* input field */}
                <div className="input-wrapper">
                    <input
                        type="text"
                        id="identity"
                        ref={userRef}
                        autoComplete="off"
                        onChange={(e) => setIdentity(e.target.value)}
                        required
                        placeholder="Username/Email"
                        className="auth-input"
                    />
                    <i className="bi bi-envelope-fill input-icon" style={{ color: 'gray'}}></i>
                </div>
                {/* ========== */}
                {/* Password */}
                {/* label */}        
                {/* input field */}
                <div className="input-wrapper"> 
                    <input
                        type="password"
                        id="password"
                        autoComplete="off"
                        onChange={(e) => setPwd(e.target.value)}
                        required
                        placeholder="Password"
                        className="auth-input"
                    />
                    <i className="bi bi-lock-fill input-icon" style={{ color: 'gray'}}></i>
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
                    <label htmlFor="rememberMe" className="remember_me_label">Remember me</label>
                    {/* Button */}
                    <button
                        className="auth-button"
                        disabled={!pwd || !identity}>
                            Login
                    </button>
                </div>
                {/* ========== */}     
                
                {/* ========== */}
                {/* Forgot Password */}
                {incPwd && !loading && (
                    <p className="forget_password" onClick={handleForgot}>
                        Forgot Password?
                    </p>
                )}
                {loading && incPwd && (
                    <LoadingSpinner message="Sending password reset request..." scale={0.75}/>
                )}
                {/* ========== */}           
            </form>
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