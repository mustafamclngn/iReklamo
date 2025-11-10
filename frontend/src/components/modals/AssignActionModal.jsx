import './modal.css'
import { useEffect, useState } from 'react'
import useUserInfoApi from '../../api/userInfo'

const AssignActionModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const { getBarangays } = useUserInfoApi();
  const [barangays, setBarangays] = useState([]);
  const [selectedBarangay, setSelectedBarangay] = useState('');

  // Fetch barangays when modal opens
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getBarangays();
        setBarangays(res.data || []);
      } catch (err) {
        console.error("Error fetching barangays:", err);
      }
    };

    if (isOpen) fetchData();
  }, [isOpen]);

  const handleChange = (e) => {
    setSelectedBarangay(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Selected barangay ID:", selectedBarangay);
    onClose();
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button onClick={onClose} className="popup-close">✕</button>
        <h2 className="title">Assign Action</h2>

        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label>Barangay</label>
            <select
              name="barangay"
              value={selectedBarangay}
              onChange={handleChange}
              required
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

          <div className="popup-footer">
            <button type="submit" className="okay-button">Assign</button>
            <button type="button" onClick={onClose} className="revoke-button">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignActionModal;
