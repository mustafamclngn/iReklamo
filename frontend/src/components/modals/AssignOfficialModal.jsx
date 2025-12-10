import './modal.css'
import { useEffect, useState } from 'react'
import useUserInfoApi from '../../api/userInfo'
import useComplaintsApi from '../../api/complaintsAPI';
import useAuth from '../../hooks/useAuth';
import SuccessModal from './SuccessModal';
import ErrorModal from './ErrorModal';
import ConfirmAssign from './ConfirmAssignModal';
import SelectedComplaintsList from './SelectedComplaints';


//  for assigning official to complaints
const AssignOfficialModal = ({ isOpen, onClose, onConfirm, officialDetails }) => {



  // ===========
  // User states
  const { auth } = useAuth();
  const user = auth.user
  const role = auth.role[0]
  const brgyId = user.barangay_id

  // ===========
  // Barangay states
  const { getBarangayById } = useUserInfoApi();
  const [assignBrgy, setAssignBrgy] = useState(); // turn brgy id to brgy object for info

  // ===========
  // Complaint states
  const { StatusComplaintsByBarangayId, assignComplaints, getAllComplaints } = useComplaintsApi();
  const [complaints, setComplaints] = useState([]); // All complaints under barangay
  const [availableComplaints, setAvailableComplaints] = useState([])

  // ===========
  // Refresh states
  const [refresh, setRefresh] = useState(false)

  // ===========
  // Selection states
  const [selectedComplaints, setSelectedComplaints] = useState(new Map()); // selected complaints for assignment
  const [clickedComplaint, setClickedComplaint] = useState(null)

  const handleSelect = (complaint, isChecked) => {
    setSelectedComplaints(prev => {
      const map = new Map(prev);
      if (isChecked) map.set(complaint.id, complaint);
      else map.delete(complaint.id);
      return map;
    });
  };

  // =============
  // Error and Success messages 
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // ============
  // Fetching barangay data
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

  // Fetch barangay complaints
  useEffect(() => {
    if (!assignBrgy || !officialDetails) return;
    const fetchComplaints = async () => {
      try {

        let res = null

        if(role === 1 || role === 2){
          console.log("official barangay: ", officialDetails?.barangay_id)
          res = await getAllComplaints({
            "status":"Pending",
            "barangay_id": officialDetails?.barangay_id});

          console.log("All complaints pending and barangay: ", res)
        }
        else{
          res = await StatusComplaintsByBarangayId(assignBrgy.id, "Pending");
          console.log("All complaints pending and barangay: ", res)
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
        [...selectedComplaints.entries()].map(([id, complaint], index) => (
          assignComplaints(complaint.id, officialDetails?.user_id)
        ))
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

  // ===========
  // Component contents
  return (
    <>
      <div className="popup-overlay">
        <div className="popup-content">
          <button onClick={onClose} className="popup-close">✕</button>
          <h2 className="title">Assign Official</h2> 
          <p className='subtitle'>{(role === 1 || role === 2) ? "Admin" : assignBrgy?.name}</p>
          <form onSubmit={handleSubmit} className="form">
            
            <SelectedComplaintsList 
              selectedComplaints={selectedComplaints}
              onRemove={(complaint) => {handleSelect(complaint, false); setRefresh(prev => !prev)}}
              button={true}
              />
              
              <div className="form-group">
                <label>Add Complaint: </label>
                <div className='row'>
                  <select
                    name="complaint"
                    value={clickedComplaint?.id}
                    onChange={(e) =>  {
                      const selected = availableComplaints.find(c => c.id === parseInt(e.target.value));
                      setClickedComplaint(selected);
                    }}
                  >
                    <option key="" value="">Select Complaint</option>
                    {availableComplaints?.length > 0 ? (
                      availableComplaints.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.complaint_code}: {c.title}
                        </option>
                      ))
                    ) : (
                      <option disabled>Loading...</option>
                    )}
                  </select>
                  <button
                    type='button'
                    className='add_complaint'
                    disabled = {!clickedComplaint}
                    onClick={() => {handleSelect(clickedComplaint, true); setRefresh(prev => !prev)}}>
                    <i className="bi bi-plus-circle"></i>
                  </button>
                </div>
              </div>
            
            <div className="popup-footer">
              <button
                type="submit"
                className="okay-button"
                disabled = {selectedComplaints.size <= 0}>
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
