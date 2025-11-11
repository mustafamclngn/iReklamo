import './modal.css'
import useComplaintsApi from '../../api/complaintsApi';
import { useEffect, useState } from 'react'
import ConfirmDelete from './ConfirmDelete'

const DeleteModal = ({ isOpen, onClose, deleteData }) => {
  const [assignedComplaints, setAssignedComplaints] = useState([])
  const user_id = deleteData?.user_id

  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [revokeType, setRevokeType] = useState('')

  const { getActiveCases } = useComplaintsApi();

  const handleConfirmRevoke = (type) => {
    setRevokeType(type);
    setIsConfirmOpen(true);
  };

  useEffect(() => {

    if (!isOpen || !user_id) return

    const fetchComplaints = async () => {
      try {
        console.log("Searching for complaints for user:", user_id)
        const response = await getActiveCases(user_id)
        setAssignedComplaints(response.data || [])
      } catch (error) {
        console.error("Error fetching assigned complaints:", error)
        setAssignedComplaints([])
      }
    }

    fetchComplaints()
  }, [isOpen, user_id])

  const getRoleLabel = (roleId) => {
    switch(roleId) {
      case 1: return 'Super Admin';
      case 2: return 'City Admin';
      case 3: return 'Barangay Captain';
      case 4: return 'Barangay Official';
      default: return roleId || 'N/A';
    }
  };

  if (!isOpen || !deleteData) return null

  console.log(deleteData);

  return (
    <>
      <div className="popup-overlay">
        <div className="popup-content">
          <button onClick={onClose} className="popup-close">✕</button>
          <h2 className="title">User Details</h2>
          <form className="form">
            <div className="form-group">
              <label>Username</label>
              <input value={deleteData.user_name || ""} readOnly />
            </div>
            <div className="form-group">
              <label>Barangay</label>
              <input value={deleteData.barangay_name || ""} readOnly />
            </div>
            <div className="form-group">
              <label>Position</label>
              <input value={deleteData.position || ""} readOnly />
            </div>
            <div className="form-group">
              <label>Role</label>
              <input value={getRoleLabel(deleteData.role_id) || ""} readOnly />
            </div>
            <div className="form-group">
              <label>Ongoing Assignments</label>
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
                  <p className="no-complaints">No ongoing assignments</p>
                )}
              </div>
            </div>
            <div className="popup-footer">
              <div className="tooltip">
                <button type="button" className="revoke-button" onClick={() => handleConfirmRevoke("Permissions")}>
                  Revoke Permissions
                </button>
                <span className="tooltip-text">
                  Removes this user’s access to their role permissions.
                </span>
              </div>
              <div className="tooltip">
                <button type="button" className="revoke-button" onClick={() => handleConfirmRevoke("Account")}>
                  Revoke Account
                </button>
                <span className="tooltip-text">
                  Permanently disables the user’s account and removes login access.
                </span>
              </div>
              <button type="button" className="okay-button" onClick={onClose}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      <ConfirmDelete 
        isOpen={isConfirmOpen} 
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={(type) => {
          setIsConfirmOpen(false)
          onClose(type) 
        }}
        assignedComplaints={assignedComplaints}
        revokeType={revokeType}
        user={deleteData}
      />
    </>
  )
};

export default DeleteModal;
