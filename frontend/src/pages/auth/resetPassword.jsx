import { useLocation, useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";

import IliganLogo from "../../components/navheaders/iliganLogo.jsx";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "./auth.css";

import useUsersApi from "../../api/usersApi.js";

import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import SuccessModal from '../../components/modals/SuccessModal';
import ErrorModal from '../../components/modals/ErrorModal';

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,24}$/;

const ResetPassword = () => {
 
    // =============
    // Auth states
    const query = new URLSearchParams(useLocation().search);
    const token = query.get("token");
    const { resetPassword } = useUsersApi();

    // =============
    // Password states
    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [showPwd, setShowPwd] = useState(false);
    const [showMatchPwd, setShowMatchPwd] = useState(false);

    // =============
    // Error and Success messages 
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] =useState(false)
    const navigate = useNavigate();

    // =============
    // Confirm password (match) states
    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);
    
    // password validation
    useEffect(() => {
        const result = PWD_REGEX.test(pwd);
        setValidPwd(result);

        const match = (pwd === matchPwd) && pwd && matchPwd;
        setValidMatch(match);
    }, [pwd, matchPwd])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try{
        const response = await resetPassword(token, pwd)
        console.log(response)
        if (response?.data?.success) {
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
        }
    };

  return (
    <>
        <div className="auth-container">
        
            <IliganLogo scale={1.65} mode="login"/>
            <p className="sessionmessage">Enter your new password</p>
            <form className="auth-form" onSubmit={handleSubmit}>
            {/* ========== */}
            {/* New Password */}
            {/* input field */}
            <div className="input-row">
                <div className="input-wrapper">
                    <input
                        type={showPwd ? "text" : "password"}
                        id="pwd"
                        autoComplete="off"
                        onChange={(e) => setPwd(e.target.value)}
                        required
                        aria-invalid={validPwd ? "false" : "true"}
                        aria-describedby="pwdnote"
                        onFocus={() => setPwdFocus(true)}
                        onBlur={() => setPwdFocus(false)}
                        placeholder="New Password"
                        className="auth-input"
                    />
                    <i className="bi bi-lock-fill input-icon" style={{ color: 'gray'}}>
                        {/* validation icons */}
                        <span className={validPwd ? "valid" : "hide"}>
                            <FontAwesomeIcon icon={faCheck} />
                        </span>
                        <span className={validPwd || !pwd ? "hide" : "invalid"}>
                            <FontAwesomeIcon icon={faTimes} />
                        </span>
                    </i>
                </div>
                <i
                    className={`bi ${showPwd ? "bi-eye-fill" : "bi-eye-slash-fill"} pwd-toggle`}
                    onClick={() => setShowPwd((prev) => !prev)}
                />
            </div>
            {/* instructions note */}
            <p
                id="pwdnote"
                className={pwdFocus && pwd && !validPwd ? "instructions" : "offscreen"}>
                <FontAwesomeIcon icon={faInfoCircle} />
                    Password must be 8 to 24 characters,
                    contain uppercase and lowercase letters, 
                    and includes atleast one number. 
            </p>
            {/* ========== */}
            {/* Confirm New Password */}
            {/* input field */}
            <div className="input-row">
                <div className="input-wrapper">
                    <input
                        type={showMatchPwd ? "text" : "password"}
                        id="matchPwd"
                        autoComplete="off"
                        onChange={(e) => setMatchPwd(e.target.value)}
                        required
                        aria-invalid={validPwd ? "false" : "true"}
                        aria-describedby="pwdnote"
                        onFocus={() => setMatchFocus(true)}
                        onBlur={() => setMatchFocus(false)}
                        placeholder="Confirm Password"
                        className="auth-input"
                    />
                    <i className="bi bi-lock-fill input-icon" style={{ color: 'gray'}}>
                        {/* validation icons */}
                        <span className={validMatch ? "valid" : "hide"}>
                            <FontAwesomeIcon icon={faCheck} />
                        </span>
                        <span className={validMatch || !matchPwd ? "hide" : "invalid"}>
                            <FontAwesomeIcon icon={faTimes} />
                        </span>
                    </i>
                </div>
                <i
                    className={`bi ${showMatchPwd ? "bi-eye-fill" : "bi-eye-slash-fill"} pwd-toggle`}
                    onClick={() => setShowMatchPwd((prev) => !prev)}
                />
            </div>
            {/* instructions note */}
            <p
                id="matchpwdnote"
                className={matchFocus && matchPwd && !validMatch ? "instructions" : "offscreen"}>
                <FontAwesomeIcon icon={faInfoCircle} />
                    Password fields must match.
            </p>
            {/* Button */}
            <button
                className="auth-button"
                disabled={!pwd || !matchPwd || !validMatch || !validPwd}>
                    Confirm
            </button>
            {/* ========== */}
            {/* Loading Update */}
            {loading && (
                <LoadingSpinner message="Updating password..." scale={0.95}/>
            )}
            {/* ========== */} 
            </form>
        </div>

        <SuccessModal
            isOpen={isSuccessOpen}
            onClose={() => setIsSuccessOpen(false)}
            onConfirm={() => navigate('/auth/login')}
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
