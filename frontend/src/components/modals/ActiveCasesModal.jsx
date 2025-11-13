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
        console.log("Searching for complaints for user:", user_id)
        const response = await getActiveCases(user_id)
        setAssignedComplaints(response?.complaints || [])
        console.log("Fetched ongoing complaints: ", assignedComplaints)
      } catch (error) {
        console.error("Error fetching assigned complaints:", error)
        setAssignedComplaints([])
      }
    }

    fetchComplaints()
  }, [isOpen, user_id])

  if (!isOpen || !officialData) return null

  console.log(officialData);

  return (
    <>
      <div className="popup-overlay">
        <div className="popup-content">
          <button onClick={onClose} className="popup-close">✕</button>
          <h2 className="title">Active Cases</h2>
          <form className="form">
            <div className="form-group">
              <div className="complaint-list">
                {assignedComplaints.length > 0 ? (
                  <ol>
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
              <button type="button" className="okay-button" onClick={onClose}>
                Okay
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
};

export default ActiveCasesModal;
