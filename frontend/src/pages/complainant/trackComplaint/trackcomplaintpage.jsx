import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CU_TrackComplaintPage = () => {
  const [complaintId, setComplaintId] = useState('');
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (!complaintId.trim()) return;
    navigate(`/track/${complaintId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-[1591px] mx-auto px-8">
        <div
          className="relative w-full h-[800px] bg-gray-800 bg-cover bg-center rounded-3xl overflow-hidden shadow-xl"
          style={{
            backgroundImage: `url('/images/trackcomplaint.jpg')`,
          }}
        >
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center px-8">
            <h1 className="text-white text-5xl font-bold mb-8 text-center">
              TRACK YOUR COMPLAINT
            </h1>
            
            <div className="w-full max-w-3xl">
              <input
                type="text"
                placeholder="Ex: CMP-202501-0001"
                value={complaintId}
                onChange={(e) => setComplaintId(e.target.value)}
                className="w-full px-6 py-4 rounded-xl mb-4 text-lg focus:outline-none focus:ring-2 focus:ring-[#578fe0]"
              />
              
              <button
                onClick={handleSubmit}
                className="w-full bg-[#66BBFB] hover:bg-[#5DADE2] text-white px-6 py-4 rounded-xl font-bold text-2xl transition-colors"
              >
                SUBMIT
              </button>
            </div>
            <p className="text-white text-lg text-center mt-12 max-w-3xl leading-relaxed">
              Note: Before tracking your complaint make sure you have received a unique complaint 
              ID associated with your submitted complaint. This complaint ID typically provided 
              to you upon successfully submitting a complaint through your provided email address
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CU_TrackComplaintPage;