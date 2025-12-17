import './modal.css'
import { useEffect, useState, useRef } from 'react'
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import useRegister from '../../hooks/useRegister';

import SuccessModal from './SuccessModal';
import ErrorModal from './ErrorModal';
import ConfirmCreateAdmin from './ConfirmCreateAdmin';
import useUserInfoApi from '../../api/userInfo';

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const CreateAdmin = ({ isOpen, onClose }) => {

  if (!isOpen) return null

  const { getBarangays, getRoles, getPositions } = useUserInfoApi();
  const userRef = useRef();
  const errRef = useRef();

  const [formData, setFormData] = useState({
    user: '',
    email: '',
    barangay: '',
    barangay_display_name: '',
    position: '',
    role: '',
    role_display_name: ''
  });

  const [validName, setValidName] = useState(false);
  const [validEmail, setValidEmail] = useState(false);
  const [userFocus, setUserFocus] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const [barangays, setBarangays] = useState([]);
  const [roles, setRoles] = useState([]);
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [barangayRes, rolesRes, positionsRes] = await Promise.all([
          getBarangays(),
          getRoles(),
          getPositions()
        ]);
        setBarangays(barangayRes.data || []);
        setRoles(rolesRes.data || []);
        setPositions(positionsRes.data || [])
      } catch (err) {
        console.error("Error fetching:", err);
      }
    };
    if (isOpen) fetchData();
  }, [isOpen]);

  useEffect(() => {
      if(userRef.current) userRef.current.focus();
  }, [isOpen])

  useEffect(() => {
      const result = USER_REGEX.test(formData.user);
      setValidName(result);
  }, [formData.user])

  useEffect(() => {
      const result = EMAIL_REGEX.test(formData.email);
      setValidEmail(result);
  }, [formData.email])

  useEffect(() => {
      setErrMsg('');
  }, [formData.user, formData.email])

  const handleChange = (e) => {
      const { name, value } = e.target;
      if (name === "barangay") {
        const selectedBarangay = barangays.find((b) => b.id == value);
        setFormData((prev) => ({
          ...prev,
          barangay: value,
          barangay_display_name: selectedBarangay ? selectedBarangay.name : ""
        }))
      } else if (name === "role") {
        const selectedRole = roles.find((r) => r.id == value);
        setFormData((prev) => ({
          ...prev,
          role: value,
          role_display_name: selectedRole ? selectedRole.name : ""
        })) 
      } else if (name === "position") {
        const selectedPosition = positions.find((p) => p.id == value);
        setFormData((prev) => ({
          ...prev,
          position: value,
          position_display_name: selectedPosition ? selectedPosition.name : ""
        }))
      } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      const v1 = USER_REGEX.test(formData.user);
      const v2 = EMAIL_REGEX.test(formData.email);
      if (!v1 || !v2){
          setErrMsg("Invalid Entry");
          setIsErrorOpen(true);
          return;
      }
      setIsConfirmOpen(true);
  }

  const handleConfirmCreate = async () => {
      const register = useRegister();
      try {
          const response = await register({
            user: formData.user,
            email: formData.email,
            barangay: formData.barangay,
            position: formData.position,
            role: formData.role
          });
          setSuccessMessage(response.message);
          setIsSuccessOpen(true);
      } catch (err) {
          if (!err?.response) {
              setErrMsg('No Server Response');
              setIsErrorOpen(true);
          } else if (err.response?.status === 409) {
              setErrMsg(err.response.data.error);
              setIsErrorOpen(true);
          } else {
              setErrMsg('Registration Failed');
              setIsErrorOpen(true);
          }
      }
  }

  return (
    <>
      <div className="popup-overlay">
        <div className="popup-content">
          <button onClick={onClose} className="popup-close">✕</button>
          <h2 className="title">Create Account</h2>
          <p className="subtitle">Create a new barangay captain or official account</p>

          <form className="form" onSubmit={handleSubmit}>

            <div className="form-group">
              <label htmlFor='username'>
                Username
                <span className={validName ? "valid" : "hide"}><FontAwesomeIcon icon={faCheck} /></span>
                <span className={validName || !formData.user ? "hide" : "invalid"}><FontAwesomeIcon icon={faTimes} /></span>
              </label>
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
                  onFocus={() => setUserFocus(true)}
                  onBlur={() => setUserFocus(false)}
                  placeholder="e.g. jdelacruz_admin"
              />
              <p className={userFocus && formData.user && !validName ? "instructions" : "offscreen"}>
                  <FontAwesomeIcon icon={faInfoCircle} /> Must be 4-24 chars, start with a letter.
              </p>
            </div>
            
            <div className="form-group">
              <label htmlFor='email'>
                Email Address
                <span className={validEmail ? "valid" : "hide"}><FontAwesomeIcon icon={faCheck} /></span>
                <span className={validEmail || !formData.email ? "hide" : "invalid"}><FontAwesomeIcon icon={faTimes} /></span>
              </label>
              <input
                  type="text"
                  id="email"
                  name="email"
                  autoComplete="off"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  aria-invalid={validEmail ? "false" : "true"}
                  onFocus={() => setEmailFocus(true)}
                  onBlur={() => setEmailFocus(false)}
                  placeholder="e.g. juan.delacruz@email.com"
              />
              <p className={emailFocus && formData.email && !validEmail ? "instructions" : "offscreen"}>
                  <FontAwesomeIcon icon={faInfoCircle} /> Must be a valid email address.
              </p>   
            </div>

            <div className="form-group">
              <label>Barangay</label>
              <select
                name="barangay"
                value={formData.barangay}
                onChange={handleChange}
                required
              >
                <option value="">Select Barangay</option>
                {barangays.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Position</label>
              <select
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
              >
                <option value="">Select Position</option>
                {positions.map((p) => (
                  <option key={p.id} value={p.id}>{p.position_name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="">Select Role</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>{r.description}</option>
                ))}
              </select>
            </div>

            <div className="popup-footer">
              <button className="revoke-button" type="button" onClick={onClose}>
                Cancel
              </button>
              <button className="okay-button" disabled={!validName || !validEmail}>
                Create Account
              </button>
            </div>

          </form>
        </div>
      </div>

      <ConfirmCreateAdmin 
        isOpen={isConfirmOpen} 
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => {
          setIsConfirmOpen(false);
          handleConfirmCreate();
        }}
        user={formData}
      />

      <SuccessModal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        onConfirm={onClose}
        message={successMessage}
      />

      <ErrorModal
        isOpen={isErrorOpen}
        onClose={() => setIsErrorOpen(false)}
        message={errMsg}
      />
    </>
  )
};

export default CreateAdmin;