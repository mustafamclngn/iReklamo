// ==================
// IMPORTS
// ==========

// =============
// Hooks and context
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useUsersApi from "../../api/usersApi.js";
import IliganLogo from "../../components/navheaders/iliganLogo.jsx";
import SuccessModal from '../../components/modals/SuccessModal';
import ErrorModal from '../../components/modals/ErrorModal';
import "./auth.css";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import useLockBodyScroll from '../../hooks/useLockBodyScroll';

// ==========
// IMPORTS
// ==================

const ResetPassword = () => {
    
// ==================
// SETUP
// ==========

    // =============
    // Navigation
    const navigate = useNavigate();

    // =============
    // Users API
    const { forgotPassword } = useUsersApi();

    // =============
    // References
    const userRef = useRef();

    // =============
    // Identification states
    const [identity, setIdentity] = useState('');

    // =============
    // Error and Success messages 
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] =useState(false)

    // =============
    // State update

    // user reference state
    useEffect(() => {
        userRef.current.focus();
    }, [])

    // error message state
    useEffect(() => {
        setErrMsg('');
    }, [identity])

    // =============
    // Sumission handler
    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true)
        try{
            const response = await forgotPassword(identity)
            setSuccessMessage(response?.data?.message)
            setIsSuccessOpen(true)

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
                <p className="sessionmessage">Enter email or username to reset your password.</p>

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
                    
                    {/* Button */}
                    <button
                        className="auth-button"
                        disabled={!identity}>
                        {loading ? 
                            (<LoadingSpinner message="" scale={0.45}/>)
                                    : (<span>Confirm</span>)}
                    </button>
                    
                    {/* ========== */}
                    {/* Cancel Password */}
                    <button 
                            type="button"
                            className="forget_password" 
                            onClick={() => navigate("/auth/login")}>
                            Back to Log In
                        </button>
                    {/* ========== */}           
                </form>
            </div>
        </div>
    </div>

        <SuccessModal
            isOpen={isSuccessOpen}
            onClose={() => setIsSuccessOpen(false)}
            onConfirm={() => {setIsSuccessOpen(false); 
                                        navigate("/auth/login", { replace: true });}}
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

export default ResetPassword;

// ==========
// COMPONENT
// ==================