import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useComplaintsApi from '../../../api/complaintsAPI';

const CU_TrackComplaintPage = () => {
  const [complaintId, setComplaintId] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const {trackComplaint} = useComplaintsApi();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleSubmit = async () => {
    if (!complaintId.trim()) {
      setError('Please enter a complaint ID');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const response = await trackComplaint(complaintId.trim());

      if (response.success && response.data) {
        navigate(`/track/${complaintId.trim()}`);
      } else {
        setError('No complaint found with this ID. Please check and try again.');
        setTimeout(() => setError(''), 5000);
      }
    } catch (err) {
      setError('No complaint found with this ID. Please check and try again.');
      setTimeout(() => setError(''), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    setComplaintId(e.target.value);
    if (error) setError('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1591px] mx-auto px-8">
        <div
          className="relative w-full h-[870px] bg-gray-800 bg-cover bg-center rounded-3xl overflow-hidden shadow-xl"
          style={{ backgroundImage: `url('/images/trackcomplaint.jpg')` }}
        >
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center px-8">
            <h1 className="text-white text-5xl font-bold mb-8 text-center">
              TRACK YOUR COMPLAINT
            </h1>
            
            <div className="w-full max-w-3xl">
              <div className="relative mb-4">
                <i className="bi bi-search text-gray-500 absolute left-4 top-1/2 -translate-y-1/2 text-xl"></i>
                <input
                  type="text"
                  placeholder="Ex: CMP-202501-0001"
                  value={complaintId}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  className={`w-full pl-14 pr-6 py-4 rounded-xl text-lg focus:outline-none focus:ring-2 ${
                    error ? 'ring-2 ring-red-500 focus:ring-red-500' : 'focus:ring-[#578fe0]'
                  }`}
                />
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-[#66BBFB] hover:bg-[#5DADE2] text-white px-6 py-4 rounded-xl font-bold text-2xl transition-colors"
              >
                SUBMIT
              </button>
            </div>

            {error ? (
              <p className="text-red-500 text-lg text-center mt-12 max-w-3xl leading-relaxed py-4 px-6 rounded-lg flex items-center justify-center gap-2">
                <i className="bi bi-exclamation-circle-fill"></i>
                {error}
              </p>
            ) : (
              <p className="text-white text-lg text-center mt-12 max-w-3xl leading-relaxed">
                Note: Before tracking your complaint make sure you have received a unique complaint 
                ID associated with your submitted complaint. This complaint ID is typically provided 
                to you upon successfully submitting a complaint through your provided email address
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CU_TrackComplaintPage;