import React, { useState } from 'react';

const CU_TrackComplaintPage = () => {
  const [complaintId, setComplaintId] = useState('');

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
                className="w-full bg-[#66BBFB] hover:bg-[#5DADE2] text-white px-6 py-4 rounded-xl font-bold text-2xl transition-colors"
              >
                SUBMIT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CU_TrackComplaintPage;