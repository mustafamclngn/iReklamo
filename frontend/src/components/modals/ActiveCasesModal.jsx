import './modal.css'
import useComplaintsApi from '../../api/complaintsAPI';
import { useEffect, useState } from 'react'

const ActiveCasesModal = ({ isOpen, onClose, officialData }) => {
  const [assignedComplaints, setAssignedComplaints] = useState([])
  const user_id = officialData?.user_id
  const { getActiveCases } = useComplaintsApi();

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

  if (!isOpen || !officialData) return null

  return (
    <>
      <div className="popup-overlay">
        <div className="popup-content">
          <button onClick={onClose} className="popup-close">✕</button>
          <h2 className="title">Active Cases</h2>
          <p className="subtitle">Ongoing assignments for {officialData.first_name} {officialData.last_name}</p>
          
          <form className="form">
            <div className="form-group">
              <div className="user-summary">
                {(assignedComplaints && assignedComplaints.length > 0) ? (
                  <ol style={{paddingLeft: '1.2rem', margin: 0}}>
                    {assignedComplaints.map((complaint, index) => (
                      <li key={complaint.id}>
                        <strong>{index + 1}</strong>. <em>{complaint.complaint_code}: {complaint.title}</em>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="no-complaints">No ongoing assignments</p>
                )}
              </div>
            </div>
            <div className="popup-footer">
              <button type="button" className="revoke-button" onClick={onClose}>
                Close
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
};

export default ActiveCasesModal;