import './modal.css'
import { useEffect, useState } from 'react'
import useUserInfoApi from '../../api/userInfo'
import useComplaintsApi from '../../api/complaintsAPI';
import useAuth from '../../hooks/useAuth';
import SuccessModal from './SuccessModal';
import ErrorModal from './ErrorModal';
import ConfirmAssign from './ConfirmAssignModal';
import SelectedComplaintsList from './SelectedComplaints';

const AssignOfficialModal = ({ isOpen, onClose, onConfirm, officialDetails }) => {

  const { auth } = useAuth();
  const user = auth.user
  const role = auth.role[0]
  const brgyId = user.barangay_id

  const { getBarangayById } = useUserInfoApi();
  const [assignBrgy, setAssignBrgy] = useState(); 

  const { StatusComplaintsByBarangayId, assignComplaints, getAllComplaints } = useComplaintsApi();
  const [complaints, setComplaints] = useState([]); 
  const [availableComplaints, setAvailableComplaints] = useState([])
  const [refresh, setRefresh] = useState(false)
  const [selectedComplaints, setSelectedComplaints] = useState(new Map()); 
  const [clickedComplaint, setClickedComplaint] = useState(null)

  const handleSelect = (complaint, isChecked) => {
    setSelectedComplaints(prev => {
      const map = new Map(prev);
      if (isChecked) map.set(complaint.id, complaint);
      else map.delete(complaint.id);
      return map;
    });
  };

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
    if (!assignBrgy || !officialDetails) return;
    const fetchComplaints = async () => {
      try {
        let res = null
        if(role === 1 || role === 2){
          res = await getAllComplaints({
            "status":"Pending",
            "barangay_id": officialDetails?.barangay_id});
        } else {
          res = await StatusComplaintsByBarangayId(assignBrgy.id, "Pending");
        }
        setComplaints(res?.data || []);
      } catch (err) {
        setErrMsg(`Error fetching complaints: ${err}`);
        setIsErrorOpen(true);
      }
    };
    setSelectedComplaints(new Map());
    fetchComplaints();
  }, [assignBrgy, officialDetails]);

  useEffect(() => {
    if (!complaints) return;
    const selectedIds = new Set([...selectedComplaints.keys()]);
    const filtered = complaints.filter(c => !selectedIds.has(c.id));
    setAvailableComplaints(filtered);
    setClickedComplaint(null)
  }, [complaints, selectedComplaints, refresh]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsConfirmOpen(true);
  };

  const handleAssign = async () => {
      try {
      await Promise.all(
        [...selectedComplaints.entries()].map(([id, complaint]) => (
          assignComplaints(complaint.id, officialDetails?.user_id)
        ))
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
          <h2 className="title">Assign Official</h2> 
          <p className='subtitle'>Select complaints for {officialDetails?.first_name} {officialDetails?.last_name}</p>
          
          <form onSubmit={handleSubmit} className="form">
            <SelectedComplaintsList 
              selectedComplaints={selectedComplaints}
              onRemove={(complaint) => {handleSelect(complaint, false); setRefresh(prev => !prev)}}
              button={true}
            />
              
            <div className="form-group">
              <label>Add Complaint</label>
              <div className='row'>
                <select
                  name="complaint"
                  value={clickedComplaint?.id || ""}
                  onChange={(e) =>  {
                    const selected = availableComplaints.find(c => c.id === parseInt(e.target.value));
                    setClickedComplaint(selected);
                  }}
                >
                  <option value="">Select a Complaint</option>
                  {availableComplaints?.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.complaint_code}: {c.title}
                    </option>
                  ))}
                </select>
                <button
                  type='button'
                  className='add_complaint'
                  disabled={!clickedComplaint}
                  onClick={() => {handleSelect(clickedComplaint, true); setRefresh(prev => !prev)}}>
                  <i className="bi bi-plus-circle"></i>
                </button>
              </div>
            </div>
            
            <div className="popup-footer">
              <button type="button" onClick={onClose} className="revoke-button">Cancel</button>
              <button
                type="submit"
                className="okay-button"
                disabled={selectedComplaints.size <= 0}>
                  Assign Official
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
        complaints={[...selectedComplaints.values()]}
        official={officialDetails}
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

export default AssignOfficialModal;