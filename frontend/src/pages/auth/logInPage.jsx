// // ==================
// // IMPORTS
// // ==========

// // =============
// // Design
// import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons"; 
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

// // =============
// // Hooks and context
// import { useRef, useState, useEffect } from "react";
// import useAuth from "../../hooks/useAuth.jsx";
// import useLogin from "../../hooks/useLogin.jsx"; 
// import { Link, useNavigate, useLocation } from "react-router-dom";

// // ==========
// // IMPORTS
// // ==================

// const LogInPage = () => {
    
// // ==================
// // SETUP
// // ==========

//     // =============
//     // Authorization Context
//     const { auth, setPersist } = useAuth();
//     const login = useLogin();

//     // =============
//     // Navigation
//     const navigate = useNavigate();
//     const location = useLocation();
//     const from = location.state?.from?.pathname || "/"

//     // =============
//     // References
//     const userRef = useRef();
//     const errRef = useRef();

//     // =============
//     // Identification states
//     const [identity, setIdentity] = useState('');

//     // =============
//     // Password states
//     const [pwd, setPwd] = useState('');

//     // =============
//     // Error messages 
//     // TODO: Popup
//     const [errMsg, setErrMsg] = useState('');

//     // =============
//     // State update

//     // persist state
//     const [persistChecked, setPersistChecked] = useState(
//         JSON.parse(localStorage.getItem("persist")) || false
//     );

//     useEffect(() => {
//         setPersist(persistChecked);
//         localStorage.setItem("persist", JSON.stringify(persistChecked));
//     }, [persistChecked, setPersist]);

//     // user reference state
//     useEffect(() => {
//         userRef.current.focus();
//     }, [])

//     // error message state
//     useEffect(() => {
//         setErrMsg('');
//     }, [identity, pwd])

//     // =============
//     // Sumission handler
//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         try {

//             const { role, user } = await login(identity, pwd)

//             setIdentity('');
//             setPwd('');

//             // redirect path after login    
//             let redirectPath = "/";

//             const userRole = role?.[0];
//             console.log(auth);
//             switch (userRole) {
//                 case 1: 
//                     redirectPath = "/superadmin/dashboard";
//                     break;
//                 case 2:
//                     redirectPath = "/cityadmin/dashboard";
//                     break;
//                 case 3:
//                     redirectPath = "/brgycap/dashboard";
//                     break;
//                 case 4:
//                     redirectPath = "/brgyoff/dashboard";
//                     break;
//                 default:
//                     redirectPath = from;
//             }

//             navigate(redirectPath, { replace: true });

//         } catch (err) {
//             if (!err?.response) {
//                 console.log(err)
//                 setErrMsg('No Server Response');
//             } else if (err.response?.status === 400) {
//                 setErrMsg('Missing Username or Password');
//             } else if (err.response?.status === 401) {
//                 setErrMsg('Unauthorized');
//             } else {
//                 setErrMsg('Login Failed');
//             }
//             errRef.current.focus();
//         }
//     }

// // ==========
// // SETUP
// // ==================


// // ================== 
// // COMPONENT
// // ==========
//   return (
//     <div className="auth-container">

//         {/* ========== */}
//         {/* Error Message */}
//         <p 
//             ref={errRef} 
//             className={errMsg ? "errmsg" : "offscreen"} 
//             aria-live="assertive">

//                 {errMsg}
//         </p>

//         {/* ========== */}
//         {/* Header */}
//         <h1 className="auth-title">iReklamo</h1>


//         {/* ========== */}
//         {/* FORM */}
//         {/* === */}
//         <form className="auth-form" onSubmit={handleSubmit}>
        
//         {/* ========== */}
//             {/* Username or Email */}

//             {/* label */}
//             <label className="auth-label" htmlFor="identity">
//                 Username/Email:
//             </label>

//             {/* input field */}
//             <input
//                 type="text"
//                 id="identity"
//                 ref={userRef}
//                 autoComplete="off"
//                 onChange={(e) => setIdentity(e.target.value)}
//                 required
//                 placeholder="Enter your username/email"
//                 className="auth-input"
//             />

//             {/* ========== */}
//             {/* Password */}

//             {/* label */}
//             <label className="auth-label" htmlFor="password">
//                 Password:
//             </label>
            
//             {/* input field */}
//             <input
//                 type="password"
//                 id="password"
//                 autoComplete="off"
//                 onChange={(e) => setPwd(e.target.value)}
//                 required
//                 placeholder="Enter your password"
//                 className="auth-input"
//             />

//             {/* ========== */}
//             {/* Persist */}
//             <div className="remember_me">
//                 <input
//                     type="checkbox"
//                     id="rememberMe"
//                     checked={persistChecked}
//                     onChange={(e) => setPersistChecked(e.target.checked)}
//                 />
//                 <label htmlFor="rememberMe">Remember me</label>
//             </div>

//             {/* ========== */}
//             {/* Button */}
//             <button 
//                 className="auth-button"
//                 disabled={!pwd || !identity}>

//                     LOG IN

//             </button>
//         </form>
//     </div>
//   );
// };

// export default LogInPage;

// // ==========
// // COMPONENT
// // ==================


// ==================
// IMPORTS
// ==========

// =============
// Hooks and context
import { useRef, useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth.jsx";
import useLogin from "../../hooks/useLogin.jsx"; 
import { Link, useNavigate, useLocation } from "react-router-dom";
import IliganLogo from "../../components/navheaders/iliganLogo.jsx";
import SuccessModal from '../../components/modals/SuccessModal';
import ErrorModal from '../../components/modals/ErrorModal';
import "./auth.css";

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
      // Error and Success messages 
      const [isErrorOpen, setIsErrorOpen] = useState(false);
      const [errMsg, setErrMsg] = useState('');
      const [isSuccessOpen, setIsSuccessOpen] = useState(false);
      const [successMessage, setSuccessMessage] = useState('');

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
            onConfirm={() => setIsErrorOpen(false)}
            message={errMsg}
        />
    </>
  );
};

export default LogInPage;

// ==========
// COMPONENT
// ==================