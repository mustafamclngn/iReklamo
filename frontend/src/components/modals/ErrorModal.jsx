import './modal.css'

const ErrorModal = ({ isOpen, onClose, message }) => {

  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="confirm-content">
        <button onClick={onClose} className="popup-close">✕</button>

        <h2 className="title">Error</h2>

        <form className="form">
          <div className="form-group">
            <label>{message}</label>
          </div>

          <div className="popup-footer">
              <button type="button" className="revoke-button" onClick={onClose}>
                Okay 
              </button>
          </div>

        </form>
      </div>
    </div>
  )
};

export default ErrorModal;
