import './modal.css'


const LogOutModal = ({ isOpen, onClose, onConfirm }) => {



  if (!isOpen) return null;

  const handleConfirm = () => {
    onClose();
    onConfirm();
  }

  return (
    <div className="popup-overlay">
      <div className="confirm-content">
        <button onClick={onClose} className="popup-close">✕</button>

        <h2 className="title">Log Out</h2>

        <form className="form">
          <div className="form-group">
            <label>Are you sure you want to log out?</label>
          </div>

          <div className="popup-footer">
              <button type="button" className="revoke-button" onClick={handleConfirm}>
                Okay 
              </button>

              <button type="button" className="okay-button" onClick={onClose}>
                Cancel 
              </button>
          </div>

        </form>
      </div>
    </div>
  )
};

export default LogOutModal;
