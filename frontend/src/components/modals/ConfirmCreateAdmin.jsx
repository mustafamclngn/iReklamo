import './modal.css'
import { useState } from 'react'


const ConfirmCreateAdmin = ({ isOpen, onClose, onConfirm, user }) => {



  const [isChecked, setIsChecked] = useState(false);

  if (!isOpen) return null;

  return (
    <>
      <div className="popup-overlay">
        <div className="confirm-content">
          <button onClick={onClose} className="popup-close">✕</button>
          <h2 className="title">Confirm Account Creation</h2>
          <form className="form">
            <div className="form-group">
              <label>
                You are about to create a new admin account for:
              </label>
              <div className="user-summary">
                <p><strong>Username:</strong> {user.user}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Barangay:</strong> {user.barangay_display_name}</p>
                <p><strong>Position:</strong> {user.position}</p>
                <p><strong>Role:</strong> {user.role_display_name}</p>
              </div>
            </div>

            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="confirmCheckbox"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
              />
              <label htmlFor="confirmCheckbox">
                I hereby confirm, by the management responsibilities bestowed upon me, 
                to create this account.
              </label>
            </div>

            <div className="popup-footer">
              <button
                type="button"
                className="okay-button"
                onClick={onConfirm}
                disabled={!isChecked}
              >
                Confirm
              </button>
              <button
                type="button"
                className="revoke-button"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default ConfirmCreateAdmin;