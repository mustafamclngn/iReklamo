import './modal.css'
import useUsersApi from "../../api/usersApi";

const ConfirmDelete = ({ isOpen, onClose, onConfirm, assignedComplaints, revokeType, user }) => {

  const { revokePermissions, revokeAccount } = useUsersApi();

  if (!isOpen) return null;

  const handleRevoke = async () => {
    try {
      if (revokeType === "Permissions") {
        await revokePermissions(user.user_id);
      } else if (revokeType === "Account") {
        await revokeAccount(user.user_id);
      }
      onConfirm(); 
    } catch (error) {
      console.error("Revoke failed:", error);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="confirm-content">
        <button onClick={onClose} className="popup-close">✕</button>

        <h2 className="title">Confirm</h2>

        <form className="form">
          <div className="form-group">
            <label>Are you sure you want to revoke {user.first_name} {user.last_name}'s {revokeType}?</label>
          </div>

          <div className="form-group">
            <label>Affected Assignments</label>
            <div className="complaint-list">
              {assignedComplaints.length > 0 ? (
                <ol>
                  {assignedComplaints.map((complaint, index) => (
                    <li key={complaint.id}>
                      <strong>{index + 1}</strong>. <em>{complaint.title}</em>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="no-complaints">None</p>
              )}
            </div>
          </div>

          <div className="popup-footer">
              <button type="button" className="revoke-button" onClick={handleRevoke}>
                Revoke {revokeType}
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

export default ConfirmDelete;
