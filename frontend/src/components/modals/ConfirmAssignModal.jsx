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
          <p className="subtitle">Review assignment details before proceeding.</p>

          <form className="form">
            
            <div className="form-group">
              <label>Selected Complaints:</label>
              <div className="user-summary">
                <div className="complaint-list">
                  {complaints?.length > 0 ? (
                    <ol style={{paddingLeft: '1.2rem', margin: 0}}>
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
              <label>Assignee:</label>
              <div className="user-summary">
                <p><strong>Name:</strong> {official.first_name} {official.last_name}</p>
                <p><strong>Position:</strong> {official.position}</p>
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
                className="revoke-button"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="button"
                className="okay-button"
                onClick={onConfirm}
                disabled={!isChecked}
              >
                Confirm Assignment
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default ConfirmAssign;