import './modal.css'

const ErrorModal = ({ isOpen, onClose, message }) => {

  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="confirm-content">
        <button onClick={onClose} className="popup-close">✕</button>
        <h2 className="title" style={{color: '#ef4444'}}>Error</h2>
        
        <div className="form">
          <div className="form-group">
            <p style={{color: '#374151'}}>{message}</p>
          </div>

          <div className="popup-footer">
              <button type="button" className="revoke-button" onClick={onClose}>
                Close 
              </button>
          </div>
        </div>
      </div>
    </div>
  )
};

export default ErrorModal;