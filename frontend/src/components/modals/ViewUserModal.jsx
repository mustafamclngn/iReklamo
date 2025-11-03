import './modal.css'

const ViewModal = ({ isOpen, onClose, viewData }) => {
  if (!isOpen || !viewData) return null

  return (
    <div className="viewpopup-overlay">
      <div className="viewpopup-content">
        <button onClick={onClose} className="viewpopup-close">✕</button>

        <h2 className="view-title">View {viewData["user_name"]} Details</h2>

        <form className="view-form">
          <div className="form-group">
            <label>Username</label>
            <input value={viewData["user_name"] || ""} readOnly />
          </div>

          <div className="form-group">
            <label>First Name</label>
            <input value={viewData["first_name"] || ""} readOnly />
          </div>

          <div className="form-group">
            <label>Last Name</label>
            <input value={viewData["last_name"] || ""} readOnly />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input value={viewData["email"] || ""} readOnly />
          </div>

          <div className="form-group">
            <label>Contact Number</label>
            <input value={viewData["contact_number"] || ""} readOnly />
          </div>

          <div className="form-group">
            <label>Barangay</label>
            <input value={viewData["barangay"] || ""} readOnly />
          </div>

          <div className="form-group">
            <label>Position</label>
            <input value={viewData["position"] || ""} readOnly />
          </div>

          <div className="form-group">
            <label>Role</label>
            <input value={viewData["role"] || ""} readOnly />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" value={viewData["user_password"] || ""} readOnly />
          </div>

          <div className="viewpopup-footer">
            <button className="okay-button" onClick={onClose}>
              Okay
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default ViewModal
