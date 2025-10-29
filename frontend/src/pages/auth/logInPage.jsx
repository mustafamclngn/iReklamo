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
import useAuth from "./hooks";
import { Link, useNavigate, useLocation } from "react-router-dom";

// =============
// Endpoints
import axios from "../../api/axios";
const LOGIN_URL = "/login"

// ==========
// IMPORTS
// ==================

const LogInPage = () => {
    
// ==================
// SETUP
// ==========

    // =============
    // Authorization Context
    const { setAuth } = useAuth();

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

        // fetch and post to backend
        try {

            const response = await axios.post(
                LOGIN_URL,
                JSON.stringify({ identity, pwd },
                {
                    headers: {
                        'Content-Type' : 'application/json'
                    },
                    withCredentials: true
                }
            ));

            console.log(JSON.stringify(response?.data));
            //console.log(JSON.stringify(response));
            const accessToken = response?.data?.accessToken;
            const roles = response?.data?.roles;
            setAuth({ user, pwd, roles, accessToken });
            setUser('');
            setPwd('');
            navigate(from, { replace: true });
        } catch (err) {
            if (!err?.response) {
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
                
                {/* validation icons */}
                <span className={validIdentity ? "valid" : "hide"}>
                    <FontAwesomeIcon icon={faCheck} />
                </span>
                
                <span className={validIdentity || !identity ? "hide" : "invalid"}>
                    <FontAwesomeIcon icon={faTimes} />
                </span>

            </label>

            {/* input field */}
            <input
                type="text"
                id="identity"
                ref={userRef}
                autoComplete="off"
                onChange={(e) => setIdentity(e.target.value)}
                required
                aria-invalid={validIdentity ? "false" : "true"}
                aria-describedby="uidnote"
                onFocus={() => setIDentityFocus(true)}
                onBlur={() => setIDentityFocus(false)}
                placeholder="Enter your username/email"
                className="auth-input"
            />

            {/* instructions note */}
            <p 
                id="uidnote" 
                className={identityFocus && identity && !validIdentity ? "instructions" : "offscreen"}>
                <FontAwesomeIcon icon={faInfoCircle} />
                    Username must be 4 to 24 characters 
                    and must begin with a letter. 
                    <br />
                    Email must at least be 2 characters long 
                    and contain a valid domain.
            </p>           

            {/* ========== */}
            {/* Password */}

            {/* label */}
            <label className="auth-label" htmlFor="password">
                Password:
                
                {/* validation icons */}
                <span className={validPwd ? "valid" : "hide"}>
                    <FontAwesomeIcon icon={faCheck} />
                </span>
                
                <span className={validPwd || !pwd ? "hide" : "invalid"}>
                    <FontAwesomeIcon icon={faTimes} />
                </span>

            </label>
            
            {/* input field */}
            <input
                type="password"
                id="password"
                onChange={(e) => setPwd(e.target.value)}
                required
                aria-invalid={validPwd ? "false" : "true"}
                aria-describedby="pwdnote"
                onFocus={() => setPwdFocus(true)}
                onBlur={() => setPwdFocus(false)}
                placeholder="Enter your password"
                className="auth-input"
            />

            {/* instructions note */}
            <p 
                id="pwdnote" 
                className={pwdFocus && pwd && !validPwd ? "instructions" : "offscreen"}>
                <FontAwesomeIcon icon={faInfoCircle} />
                    Password must be 8 to 24 characters 
                    and must uppercase and lowercase letters, 
                    a number and a special character. <br />
                    Special characters allowed: 
                        <span aria-label="exclamation mark">!</span>
                        <span aria-label="at symbol">@</span>
                        <span aria-label="hashtag">#</span>
                        <span aria-label="dollar sign">$</span>
                        <span aria-label="percent">%</span>
            </p>

            {/* ========== */}
            {/* Button */}
            <button 
                className="auth-button"
                disabled={!validIdentity || !validPwd ? true : false
                }>

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