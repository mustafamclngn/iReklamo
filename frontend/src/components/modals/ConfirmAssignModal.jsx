import './modal.css'
import { useState } from 'react'

const ConfirmAssign = ({ isOpen, onClose, onConfirm, complaints, official }) => {

  const [isChecked, setIsChecked] = useState(false);

  if (!isOpen) return null;

  return (
    <>
      <div className="popup-overlay">
        <div className="confirm-content">
          <button onClick={onClose} className="popup-close">✕</button>
          <h2 className="title">Confirm Assignment</h2>
          <form className="form">
            
            <div className="form-group">
              <label>
                You are about to assign the complaint/s:
              </label>
              <div className="user-summary">
                <div className="complaint-list">
                  {complaints.length > 0 ? (
                    <ol>
                      {complaints.map((complaint, index) => (
                        <li key={complaint.id}>
                          <strong>{index + 1}</strong>. <em>{complaint.complaint_code}</em>: <em>{complaint.title}</em>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p className="no-complaints">None</p>
                  )}
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>
                You are about to assign official:
              </label>
              <div className="user-summary">
                <p><strong>Official Position:</strong> {official.position}</p>
                <p><strong>Official Name:</strong> {official.first_name} {official.last_name}</p>
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
                to approve of this assignment.
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

export default ConfirmAssign;