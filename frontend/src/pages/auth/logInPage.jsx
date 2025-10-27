import React, { use } from "react";
import "./auth.css";
import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import axios from "../../api/axios";

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const LOGIN_URL = "/login"

const LogInPage = () => {
    
// ==================
// SETUP
// ==========

    // =============
    // References
    const userRef = useRef();
    const errRef = useRef();

    // =============
    // Identification states
    const [identity, setIdentity] = useState('');
    const [validIdentity, setValidIdentity] = useState(false);
    const [identityFocus, setIDentityFocus] = useState(false);

    // =============
    // Password states
    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    // =============
    // Error and Success messages 
    // TODO: Popup
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState('');

    // =============
    // State update

    // user reference state
    useEffect(() => {
        userRef.current.focus();
    }, [])

    // username or email validation
    useEffect(() => {
        const valid_username = USER_REGEX.test(identity);
        const valid_email = EMAIL_REGEX.test(identity);
        console.log(valid_username);
        console.log(valid_email);
        console.log(identity);
        setValidIdentity(valid_username || valid_email);
    }, [identity])

    // password validation
    useEffect(() => {
        const result = PWD_REGEX.test(pwd);
        console.log(result);
        console.log(pwd);
        setValidPwd(result);
    }, [pwd])

    // error message state
    useEffect(() => {
        setErrMsg('');
    }, [identity, pwd])

    // =============
    // Sumission handler
    // const handleSubmit = async (e) => {
    //     e.preventDefault();
        
    //     // secure submission
    //     const v1 = USER_REGEX.test(identity) || EMAIL_REGEX.test(identity);
    //     const v2 = PWD_REGEX.test(pwd);
    //     if (!v1 || !v2 ){
    //         setErrMsg("Invalid Entry");
    //         return;
    //     }

    //     // fetch and post to backend
    //     try {

    //         const response = await axios.post(
    //             LOGIN_URL,
    //             JSON.stringify({ identity, pwd },
    //             {
    //                 headers: {
    //                     'Content-Type' : 'application/json'
    //                 },
    //                 withCredentials: true
    //             }
    //         ));

    //         // console.log(response.data);
    //         // console.log(response.accessToken);
    //         // console.log(JSON.stringify(response));

    //         setSuccess(true);

    //         // TODO: clear input fields
    //     } catch (err) {
    //         if (!err?.response) {
    //             setErrMsg('No Server Response');
    //         } 
    //         else {
    //             setErrMsg('Log In Failed')
    //         }
    //         errRef.current.focus();
    //     }
    // }
    // onSubmit={handleSubmit}

// ==========
// SETUP
// ==================


// ==================
// COMPONENT
// ==========
  return (
    <>
        {/* ========== */}
        {/* Success Message */}
        {/* TODO: Design, Popup, redirect*/}
        {success ? ( 
            <div>
                <h1>
                    Success!
                </h1>
            </div>
        ) : (
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
            <form className="auth-form" >
            
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
        )}
    </>
  );
};

export default LogInPage;

// ==========
// COMPONENT
// ==================