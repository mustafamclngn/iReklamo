import './modal.css'
import { useEffect, useState } from 'react'
import useUserInfoApi from '../../api/userInfo'
import useOfficialsApi from '../../api/officialsApi';
import useComplaintsApi from '../../api/complaintsAPI';
import SuccessModal from './SuccessModal';
import ErrorModal from './ErrorModal';
import ConfirmAssign from './ConfirmAssignModal';
import useAuth from '../../hooks/useAuth';

// This modal is for assigning complaints to an official
const AssignComplaintModal = ({ isOpen, onClose, selectedComplaints }) => {

  // selectedComplaintsIds is an array of the selected complaints for assignment. NOTE: These are objects, not ids

  const { auth } = useAuth();
  const user = auth.user
  const brgyId = user.barangay_id // User brgy id, cap can only assign complaints under their brgy

  // ===========
  // Barangay states
  const { getBarangayById } = useUserInfoApi();
  const [assignBrgy, setAssignBrgy] = useState(); // turn brgy id to brgy object for info

  // ===========
  // Official states
  const { getOfficialsByBarangay } = useOfficialsApi();
  const [officials, setOfficials] = useState([]); // for dropdown
  const [selectedOfficial, setSelectedOfficial] = useState(null); // selected

  // ===========
  // Complaint states
  const { StatusComplaintsByBarangayId, assignComplaints } = useComplaintsApi();
  // const [complaints, setComplaints] = useState([]);
  // const [selectedComplaints, setSelectedComplaints] = useState([]);
  // commented out as we dont nedd these anymore, use array of complaint objets: selectedComplaints


  // =============
  // Error and Success messages 
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // ============
  // Fetch barangay data
  useEffect(() => {
    const fetchBarangay = async (id) => {
      try {
        const res = await getBarangayById(id);
        setAssignBrgy(res.barangay || [])
      } catch (err) {
        setErrMsg("Error fetching barangay:", err);
        setIsErrorOpen(true);
      }
    };

    fetchBarangay(brgyId);
  }, [isOpen, brgyId]);

  // Fetch barangay officials
  useEffect(() => {
    if (!assignBrgy) return
    const fetchOfficials = async () => {
      try {
        const res = await getOfficialsByBarangay(assignBrgy.id);
        setOfficials(res.data || []);
      } catch (err) {
        setErrMsg("Error fetching officials:", err);
        setIsErrorOpen(true);
      }
    };

    fetchOfficials();
  }, [assignBrgy]);

  if (!isOpen) return null;
  if(!selectedComplaints) return null;

  // ==========
  // Submit 
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsConfirmOpen(true);
  };

  // ===========
  // Assign
  const handleAssign = async () => {
    try {
      const responses = await Promise.all(
        selectedComplaints.map(c =>
          assignComplaints(c.id, selectedOfficial?.user_id)
        )
      );
      setSuccessMessage("All complaints assigned successfully!");
      setIsSuccessOpen(true);
    } catch (err) {
        if (!err?.response) {
            setErrMsg('No Server Response');
            setIsErrorOpen(true);
        } 
        else {
            setErrMsg('Assignment Failed');
            setIsErrorOpen(true);
        }
    }
  }

  return (
    <>
      <div className="popup-overlay">
        <div className="popup-content">
          <button onClick={onClose} className="popup-close">✕</button>
          <h2 className="title">Assign Complaint</h2>
          <h4 className='title'>{assignBrgy.name}</h4>
          <form onSubmit={handleSubmit} className="form">

            <label>Selected Complaints</label>
              <div className="complaint-list">
                {selectedComplaints.length > 0 ? (
                  <ol>
                    {selectedComplaints.map((complaint, index) => (
                      <li key={complaint.id}>
                        <strong>{index + 1}</strong>. <em>{complaint.title}</em>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="no-complaints">None</p>
                )}
              </div>
            
            <div className="form-group">
              <label>Official</label>
              <select
                name="official"
                value={selectedOfficial?.user_id}
                onChange={(e) => {
                  const selected = officials.find(o => o.user_id === parseInt(e.target.value));
                  setSelectedOfficial(selected);
                }}
                required
              >
                <option key="" value="">Select Official</option>
                {officials.length > 0 ? (
                  officials.map((o) => (
                    <option key={o.user_id} value={o.user_id}>
                      {o.first_name} {o.last_name}
                    </option>
                  ))
                ) : (
                  <option disabled>Loading...</option>
                )}
              </select>
            </div>

            <div className="popup-footer">
              <button
                type="submit"
                className="okay-button"
                disabled = {!selectedOfficial}>
                  Assign
              </button>
              <button type="button" onClick={onClose} className="revoke-button">Cancel</button>
            </div>
          </form>
        </div>
      </div>

      <ConfirmAssign 
        isOpen={isConfirmOpen} 
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => {
          setIsConfirmOpen(false);
          handleAssign();
        }}
        complaints={selectedComplaints}
        official={selectedOfficial}
      />

      <SuccessModal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        onConfirm={onClose}
        message={successMessage}
      />

      <ErrorModal
        isOpen={isErrorOpen}
        onClose={() => setIsErrorOpen(false)}
        onConfirm={onClose}
        message={errMsg}
      />
    </>
  );
};

export default AssignComplaintModal;
