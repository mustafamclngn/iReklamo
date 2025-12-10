import './modal.css'
import { useState } from 'react'
import useComplaintsApi from '../../api/complaintsAPI'
import ErrorModal from './ErrorModal'

const SetPriorityModal = ({ isOpen, onClose, complaint, onPriorityUpdate }) => {
  const [selectedPriority, setSelectedPriority] = useState(complaint?.priority || 'Moderate')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isErrorOpen, setIsErrorOpen] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const { setPriority } = useComplaintsApi()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!complaint?.id || isSubmitting) return

    setIsSubmitting(true)
    try {
      const response = await setPriority(complaint.id, selectedPriority)
      if (response.success) {
        onPriorityUpdate?.(selectedPriority)
        onClose()
      } else {
        setErrorMsg('Failed to update priority, please try again')
        setIsErrorOpen(true)
      }
    } catch (error) {
      console.error('Priority update failed:', error)
      setErrorMsg('Failed to update priority, please try again')
      setIsErrorOpen(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      <div className="popup-overlay">
        <div className="popup-content">
          <button onClick={onClose} className="popup-close">✕</button>
          <h2 className="title">Set Priority</h2>
          <p className="subtitle">Adjust the priority level for this complaint.</p>
          
          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label>Priority Level</label>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                required
              >
                <option value="Low">Low</option>
                <option value="Moderate">Moderate</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
            
            <div className="popup-footer">
              <button type="button" onClick={onClose} className="revoke-button" disabled={isSubmitting}>
                Cancel
              </button>
              <button
                type="submit"
                className="okay-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Updating...' : 'Update Priority'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <ErrorModal
        isOpen={isErrorOpen}
        onClose={() => setIsErrorOpen(false)}
        onConfirm={() => setIsErrorOpen(false)}
        message={errorMsg}
      />
    </>
  )
}

export default SetPriorityModal