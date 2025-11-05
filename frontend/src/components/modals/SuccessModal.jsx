import './modal.css'

const SuccessModal = ({ isOpen, onClose, onConfirm, message }) => {

  if (!isOpen) return null;

  const handleConfirm = () => {
    onClose();
    onConfirm();
  }

  return (
    <div className="popup-overlay">
      <div className="confirm-content">
        <button onClick={onClose} className="popup-close">✕</button>

        <h2 className="title">Success</h2>

        <form className="form">
          <div className="form-group">
            <label>{message}</label>
          </div>

          <div className="popup-footer">
              <button type="button" className="okay-button" onClick={handleConfirm}>
                Okay 
              </button>
          </div>

        </form>
      </div>
    </div>
  )
};

export default SuccessModal;
