import './modal.css'
import { useEffect, useState, useRef } from 'react'
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import useRegister from '../../hooks/useRegister';

import SuccessModal from './SuccessModal';
import ErrorModal from './ErrorModal';

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const CreateAdmin = ({ isOpen, onClose }) => {

  if (!isOpen) return null

  // ==================
  // SETUP
  // ==========

      // =============
      // References
      const userRef = useRef();
      const errRef = useRef();
  
      // =============
      // Unified form state
      const [formData, setFormData] = useState({
        user: '',
        email: '',
        barangay: '',
        position: '',
        role: ''
      });

      // =============
      // Validation states
      const [validName, setValidName] = useState(false);
      const [validEmail, setValidEmail] = useState(false);
      const [userFocus, setUserFocus] = useState(false);
      const [emailFocus, setEmailFocus] = useState(false);
  
      // =============
      // Error and Success messages 
      const [isErrorOpen, setIsErrorOpen] = useState(false);
      const [errMsg, setErrMsg] = useState('');
      const [isSuccessOpen, setIsSuccessOpen] = useState(false);
      const [successMessage, setSuccessMessage] = useState('');

      // =============
      // State update
  
      // user reference state
      useEffect(() => {
          userRef.current.focus();
      }, [])
  
      // user validation
      useEffect(() => {
          const result = USER_REGEX.test(formData.user);
          setValidName(result);
      }, [formData.user])
  
      // email validation
      useEffect(() => {
          const result = EMAIL_REGEX.test(formData.email);
          setValidEmail(result);
      }, [formData.email])
  
      // error message state
      useEffect(() => {
          setErrMsg('');
      }, [formData.user, formData.email])

      // unified input change handler
      const handleChange = (e) => {
          const { name, value } = e.target;
          setFormData((prev) => ({ ...prev, [name]: value }));
      };

      // =============
      // Sumission handler
      const handleSubmit = async (e) => {
          e.preventDefault();
          
          // secure submission
          const v1 = USER_REGEX.test(formData.user);
          const v2 = EMAIL_REGEX.test(formData.email);
          if (!v1 || !v2){
              setErrMsg("Invalid Entry");
              setIsErrorOpen(true);
              return;
          }
  
          // fetch and post to backend
          const register = useRegister();

          try {
              const response = await register(
                {
                  user: formData.user,
                  email: formData.email,
                  barangay: formData.barangay,
                  position: formData.position,
                  role: formData.role
                }
              )
              console.log(response)
              setSuccessMessage(response.message);
              setIsSuccessOpen(true);

          } catch (err) {
              if (!err?.response) {
                  setErrMsg('No Server Response');
                  setIsErrorOpen(true);
              } 
              else if (err.response?.status === 409) {
                  setErrMsg('Username Taken');
                  setIsErrorOpen(true);
              }
              else {
                  setErrMsg('Registration Failed');
                  setIsErrorOpen(true);
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
      <div className="popup-overlay">
        <div className="popup-content">
          <button onClick={onClose} className="popup-close">✕</button>

          {/* ========== */}
          {/* Header */}
          <h2 className="title">Create Account</h2>

          {/* ========== */}
          {/* FORM */}
          {/* === */}
          <form className="form" onSubmit={handleSubmit}>

            {/* ========== */}
            {/* Username */}

            {/* label */}
            <div className="form-group">
              <label htmlFor='username'>
                Username

                {/* validation icons */}
                <span className={validName ? "valid" : "hide"}>
                    <FontAwesomeIcon icon={faCheck} />
                </span>
                
                <span className={validName || !formData.user ? "hide" : "invalid"}>
                    <FontAwesomeIcon icon={faTimes} />
                </span>

              </label>

              {/* input field */}
              <input
                  type="text"
                  id="username"
                  name="user"
                  ref={userRef}
                  autoComplete="off"
                  value={formData.user}
                  onChange={handleChange}
                  required
                  aria-invalid={validName ? "false" : "true"}
                  aria-describedby="uidnote"
                  onFocus={() => setUserFocus(true)}
                  onBlur={() => setUserFocus(false)}
                  placeholder="Enter your username"
              />

              {/* instructions note */}
              <p 
                  id="uidnote" 
                  className={userFocus && formData.user && !validName ? "instructions" : "offscreen"}>
                  <FontAwesomeIcon icon={faInfoCircle} />
                      Username must be 4 to 24 characters 
                      and must begin with a letter.
              </p>
            </div>
            
            {/* ========== */}
            {/* Email */}

            <div className="form-group">

               {/* label */}
              <label htmlFor='email'>
                Email Address

                {/* validation icons */}
                <span className={validEmail ? "valid" : "hide"}>
                    <FontAwesomeIcon icon={faCheck} />
                </span>
                
                <span className={validEmail || !formData.email ? "hide" : "invalid"}>
                    <FontAwesomeIcon icon={faTimes} />
                </span>

              </label>

              {/* input field */}
              <input
                  type="text"
                  id="email"
                  name="email"
                  autoComplete="off"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  aria-invalid={validEmail ? "false" : "true"}
                  aria-describedby="emailnote"
                  onFocus={() => setEmailFocus(true)}
                  onBlur={() => setEmailFocus(false)}
                  placeholder="Enter your email"
              />

              {/* instructions note */}
              <p 
                  id="emailnote" 
                  className={emailFocus && formData.email && !validEmail ? "instructions" : "offscreen"}>
                  <FontAwesomeIcon icon={faInfoCircle} />
                      Email must at least be 2 characters long 
                      and contain a valid domain.
              </p>   
            </div>

            {/* Other info fields */}
            <div className="form-group">
              <label>Barangay</label>
              <input 
                name="barangay"
                value={formData.barangay}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="form-group">
              <label>Position</label>
              <input 
                name="position"
                value={formData.position}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="form-group">
              <label>Role</label>
              <input 
                name="role"
                value={formData.role}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="popup-footer">

              <button className="okay-button" disabled = {!validName || !validEmail ? true : false}>
                Create
              </button>

              <button className="revoke-button" onClick={onClose}>
                Cancel
              </button>

            </div>

          </form>
        </div>
      </div>

      <SuccessModal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        onConfirm={onClose}
        message={successMessage}
      />

      <ErrorModal
        isOpen={isErrorOpen}
        onClose={() => setIsErrorOpen(false)}
        onConfirm={onClose}
        message={errMsg}
      />
    </>
  )
};

export default CreateAdmin;

