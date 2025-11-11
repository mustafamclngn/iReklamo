import './modal.css'
import { useEffect, useState } from 'react'
import useUserInfoApi from '../../api/userInfo'
import useOfficialsApi from '../../api/officialsApi';
import useComplaintsApi from '../../api/complaintsApi';
import useAuth from '../../hooks/useAuth';

const AssignActionModal = ({ isOpen, onClose, Action }) => {

  // ===========
  // User states
  const { auth } = useAuth();
  const userRole = auth.role[0];
  const userBrgy = auth.user.barangay_id;

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
  const { complaintsByBarangayId, assignComplaints } = useComplaintsApi();
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState('');

  if (!isOpen) return null;

  // ============
  // Fetching data

  // Fetch barangays when modal opens
  useEffect(() => {
    const fetchBarangayList = async () => {
      try {
        const res = await getBarangays();
        setBarangays(res.data || []);
      } catch (err) {
        console.error("Error fetching barangays:", err);
      }
    };

    const fetchBarangay = async () => {
      try {
        const res = await getBarangayById(userBrgy);
        setBarangays(res.barangay || []);
        setSelectedBarangay(res.barangay.id || null)
      } catch (err) {
        console.error("Error fetching barangay:", err);
      }
    };

    if (isOpen){
       if (userRole === 1 || userRole === 2) {
        fetchBarangayList();
      }
      else if (userRole === 3 || userRole === 4) {
        fetchBarangay();
      }
    }
  }, [isOpen]);

  // Fetch barangay officials when barangay changes
  useEffect(() => {
    const fetchOfficials = async () => {
      if (Action !== 'Assign Complaint' || !selectedBarangay) return
      try {
        const res = await getOfficialsByBarangay(selectedBarangay);
        setOfficials(res.data || []);
      } catch (err) {
        console.error("Error fetching officials:", err);
      }
    };

    fetchOfficials();
  }, [Action, selectedBarangay]);

  // Fetch barangay complaints when barangay changes
  useEffect(() => {
    if (Action !== 'Assign Official' || !selectedBarangay) return
    const fetchComplaints = async () => {
      try {
        const res = await complaintsByBarangayId(selectedBarangay);
        setComplaints(res.data || []);
      } catch (err) {
        console.error("Error fetching complaints: ", err);
      }
    };

    fetchComplaints();
  }, [selectedBarangay]);

  // ==========
  // Submit Assign
  const handleSubmit = (e) => {
    e.preventDefault();
    const assign = async () => {
      try {
         await assignComplaints(selectedComplaint, selectedOfficial);
      } catch (err) {
        console.error("Error assigning complaint: ", err);
      }
    }
    assign()
    onClose();
  };

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
          value={selectedOfficial}
          onChange={(e) => setSelectedOfficial(e.target.value)}
          required
        >
          <option value="">Select Official</option>
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
          value={selectedComplaint}
          onChange={(e) => setSelectedComplaint(e.target.value)}
          required
        >
          <option value="">Select Complaint</option>
          {complaints.length > 0 ? (
            complaints.map((c) => (
              <option key={c.complaint_id} value={c.complaint_id}>
                {c.complaint_code}: {c.complaint_title}
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
  );
};

export default AssignActionModal;
