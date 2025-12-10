import './modal.css'
import { useEffect, useState } from 'react'
import useUserInfoApi from '../../api/userInfo'
import useOfficialsApi from '../../api/officialsApi';
import useComplaintsApi from '../../api/complaintsAPI';
import SuccessModal from './SuccessModal';
import ErrorModal from './ErrorModal';
import ConfirmAssign from './ConfirmAssignModal';
import useAuth from '../../hooks/useAuth';
import SelectedComplaintsList from './SelectedComplaints';

const AssignComplaintModal = ({ isOpen, onClose, onConfirm, selectedComplaints }) => {

  const { auth } = useAuth();
  const user = auth.user
  const role = auth.role[0]
  const brgyId = user.barangay_id

  const { getBarangayById } = useUserInfoApi();
  const [assignBrgy, setAssignBrgy] = useState(); 

  const { getAllOfficials, getOfficialsByBarangay } = useOfficialsApi();
  const [officials, setOfficials] = useState([]); 
  const [selectedOfficial, setSelectedOfficial] = useState(null); 

  const { assignComplaints } = useComplaintsApi();

  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

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

  useEffect(() => {
    if (!assignBrgy) return
    const fetchOfficials = async () => {
      try {
        let res = null
        if(role === 1 || role === 2){
          res = await getAllOfficials();
        } else {
          res = await getOfficialsByBarangay(assignBrgy.id); 
        }
        setOfficials(res?.data || []);
      } catch (err) {
        setErrMsg(`Error fetching officials: ${err}`);
        setIsErrorOpen(true);
      }
    };
    fetchOfficials();
  }, [assignBrgy, user]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsConfirmOpen(true);
  };

  const handleAssign = async () => {
    try {
      await Promise.all(
        selectedComplaints.map(c =>
          assignComplaints(c.id, selectedOfficial?.user_id)
        )
      );
      setSuccessMessage("All complaints assigned successfully!");
      setIsSuccessOpen(true);
    } catch (err) {
        setErrMsg(err?.response ? 'Assignment Failed' : 'No Server Response');
        setIsErrorOpen(true);
    }
  }

  return (
    <>
      <div className="popup-overlay">
        <div className="popup-content">
          <button onClick={onClose} className="popup-close">✕</button>
          <h2 className="title">Assign Complaint</h2>
          <p className='subtitle'>
            {(role === 1 || role === 2) ? "Administrator Action" : `Assigning for ${assignBrgy?.name || 'Barangay'}`}
          </p>
          
          <form onSubmit={handleSubmit} className="form">
            <SelectedComplaintsList 
              selectedComplaints={selectedComplaints}
              onRemove={null}
              button={false}
            />
            
            <div className="form-group">
              <label>Assign to Official</label>
              <select
                name="official"
                value={selectedOfficial?.user_id || ""}
                onChange={(e) => {
                  const selected = officials.find(o => o.user_id === parseInt(e.target.value));
                  setSelectedOfficial(selected);
                }}
                required
              >
                <option value="">Select an Official</option>
                {officials.map((o) => (
                  <option key={o.user_id} value={o.user_id}>
                    {o.first_name} {o.last_name} ({o.position})
                  </option>
                ))}
              </select>
            </div>

            <div className="popup-footer">
              <button type="button" onClick={onClose} className="revoke-button">Cancel</button>
              <button
                type="submit"
                className="okay-button"
                disabled={!selectedOfficial}>
                  Assign Complaint
              </button>
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
        onConfirm={onConfirm}
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