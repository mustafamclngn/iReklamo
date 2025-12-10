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
        <p className="subtitle">Are you sure you want to end your session?</p>

        <form className="form">
          <div className="popup-footer" style={{marginTop: '0'}}>
              <button type="button" className="revoke-button" onClick={onClose}>
                Cancel 
              </button>
              <button type="button" className="okay-button" onClick={handleConfirm} style={{backgroundColor: '#ef4444'}}>
                Log Out 
              </button>
          </div>
        </form>
      </div>
    </div>
  )
};

export default LogOutModal;