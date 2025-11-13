import './modal.css'
import { useEffect, useState } from 'react'
import useUserInfoApi from '../../api/userInfo'
import useOfficialsApi from '../../api/officialsApi';
import useComplaintsApi from '../../api/complaintsAPI';
import useAuth from '../../hooks/useAuth';
import SuccessModal from './SuccessModal';
import ErrorModal from './ErrorModal';
import ConfirmAssign from './ConfirmAssignModal';

const AssignActionModal = ({ isOpen, onClose, Action, assignDetails }) => {

  // ===========
  // User states
  const { auth } = useAuth();
  const userRole = auth?.role[0];
  const userBrgy = auth?.user?.barangay_id;
  const [assignBrgy, setAssignBrgy] = useState();

  // ===========
  // Barangay states
  const { getBarangays, getBarangayById } = useUserInfoApi();
  const [barangays, setBarangays] = useState([]);
  const [selectedBarangay, setSelectedBarangay] = useState('');

  // ===========
  // Official states
  const { getOfficialsByBarangay } = useOfficialsApi();
  const [officials, setOfficials] = useState([]);
  const [selectedOfficial, setSelectedOfficial] = useState('');

  // ===========
  // Complaint states
  const { StatusComplaintsByBarangayId, assignComplaints } = useComplaintsApi();
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState('');

  // =============
  // Error and Success messages 
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // ============
  // Fetching data

  useEffect(() => {
    setAssignBrgy(assignDetails?.barangay_id);
  }, [isOpen, assignDetails]);

  useEffect(() => {
    if (!assignDetails) return;

    if (Action === "Assign Complaint") {
      setSelectedComplaint(assignDetails);
    } else if (Action === "Assign Official") {
      setSelectedOfficial(assignDetails);
    }
  }, [Action, assignDetails]);


  // Fetch barangays when modal opens
  useEffect(() => {
    const fetchBarangayList = async () => {
      try {
        const res = await getBarangays();
        console.log("All brangays: ", res)
        setBarangays(res.data || []);
      } catch (err) {
        console.error("Error fetching barangays:", err);
      }
    };

    const fetchBarangay = async (id) => {
      try {
        const res = await getBarangayById(id);
        const brgy = res.barangay || [];
        setBarangays([brgy]);
        console.log(res)
        setSelectedBarangay(brgy.id)
        console.log("selectedBrgy", selectedBarangay);
      } catch (err) {
        console.error("Error fetching barangay:", err);
      }
    };

    if (isOpen){
       if (userRole === 1 || userRole === 2) {
        fetchBarangay(assignBrgy);
        fetchBarangayList();
      }
      else if (userRole === 3 || userRole === 4) {
        fetchBarangay(userBrgy);
      }
    }
  }, [isOpen, assignBrgy, assignDetails]);

  // Fetch barangay officials when barangay changes
  useEffect(() => {
    if (Action !== 'Assign Complaint' || !selectedBarangay) return
    const fetchOfficials = async () => {
      try {
        const res = await getOfficialsByBarangay(selectedBarangay);
        setOfficials(res.data || []);
      } catch (err) {
        console.error("Error fetching officials:", err);
      }
    };

    fetchOfficials();
  }, [Action, selectedBarangay, assignDetails]);

  // Fetch barangay complaints when barangay changes
  useEffect(() => {
    if (Action !== 'Assign Official' || !selectedBarangay) return
    const fetchComplaints = async () => {
      try {
        const res = await StatusComplaintsByBarangayId(selectedBarangay, "Pending");
        console.log("Complaints info: ", res)
        setComplaints(res.data || []);
      } catch (err) {
        console.error("Error fetching complaints: ", err);
      }
    };

    fetchComplaints();
  }, [isOpen, selectedBarangay, assignDetails, onClose]);

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
          const response = await assignComplaints(selectedComplaint.id, selectedOfficial.user_id);
          setSuccessMessage(response.message);
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
        errRef.current.focus();
    }
  }

  // ===========
  // Component contents
  let header = null;
  let content = null;

  if (Action === "Assign Complaint"){

    header = (
      <h2 className="title">Assign Complaint</h2>
    )

    content = (
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
      )
  }

  else if (Action === "Assign Official"){

    header = (
      <h2 className="title">Assign Official</h2>
    )

    content = (
      <div className="form-group">
        <label>Complaint</label>
        <select
          name="complaint"
          value={selectedComplaint?.id}
          onChange={(e) =>  {
            const selected = complaints.find(c => c.id === parseInt(e.target.value));
            setSelectedComplaint(selected);
          }}
          required
        >
          <option key="" value="">Select Complaint</option>
          {complaints.length > 0 ? (
            complaints.map((c) => (
              <option key={c.id} value={c.id}>
                {c.complaint_code}: {c.title}
              </option>
            ))
          ) : (
            <option disabled>Loading...</option>
          )}
        </select>
      </div>
      )
  }

  return (
    <>
      <div className="popup-overlay">
        <div className="popup-content">
          <button onClick={onClose} className="popup-close">✕</button>
          {header}
          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label>Barangay</label>
              <select
                name="barangay"
                value={selectedBarangay}
                key=""
                onChange={(e) => setSelectedBarangay(e.target.value)}
                required
                disabled = {userRole === 3 || userRole === 4}
              >
                <option value="">Select Barangay</option>
                {barangays.length > 0 ? (
                  barangays.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))
                ) : (
                  <option disabled>Loading...</option>
                )}
              </select>
            </div>
            {content}
            <div className="popup-footer">
              <button
                type="submit"
                className="okay-button"
                disabled = {
                  !selectedBarangay ||
                  (Action === 'Assign Complaint' && !selectedOfficial) ||
                  (Action === 'Assign Official' && !selectedComplaint)
                }>
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
        complaint={selectedComplaint}
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

export default AssignActionModal;
