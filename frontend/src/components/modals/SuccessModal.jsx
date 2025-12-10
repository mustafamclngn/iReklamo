import './modal.css'

const SuccessModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onClose();
    if(onConfirm) onConfirm();
  }

  return (
    <div className="popup-overlay">
      <div className="confirm-content">
        <button onClick={onClose} className="popup-close">✕</button>
        <h2 className="title" style={{color: '#16a34a'}}>Success</h2>
        <div className="form">
          <div className="form-group">
            <p style={{color: '#374151'}}>{message}</p>
          </div>
          <div className="popup-footer">
              <button type="button" className="okay-button" onClick={handleConfirm}>
                Okay 
              </button>
          </div>
        </div>
      </div>
    </div>
  )
};

export default SuccessModal;