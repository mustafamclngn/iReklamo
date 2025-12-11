import './modal.css'
import useComplaintsApi from '../../api/complaintsAPI';
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
        const response = await getActiveCases(user_id)
        setAssignedComplaints(response?.complaints || [])
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

  return (
    <>
      <div className="popup-overlay">
        <div className="popup-content">
          <button onClick={onClose} className="popup-close">✕</button>
          <h2 className="title">User Details</h2>
          <p className="subtitle">Manage account access and permissions.</p>

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
              <div className="user-summary">
                {assignedComplaints.length > 0 ? (
                  <ol style={{paddingLeft: '1.2rem', margin: 0}}>
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
              <button type="button" className="okay-button" onClick={onClose}>
                Cancel
              </button>
              
              <button 
                type="button" 
                className="revoke-button" 
                style={{backgroundColor: '#ef4444', color: 'white'}}
                onClick={() => handleConfirmRevoke("Permissions")}
                title="Removes this user’s access to their role permissions."
              >
                Revoke Permissions
              </button>
              
              {/* <button 
                type="button" 
                className="revoke-button" 
                style={{backgroundColor: '#ef4444', color: 'white'}}
                onClick={() => handleConfirmRevoke("Account")}
                title="Permanently disables the user’s account."
              >
                Revoke Account  
              </button> */}
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