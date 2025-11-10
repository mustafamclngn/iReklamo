import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import complaintsApi from '../../api/complaintsApi';

const CU_TrackComplaintDetailsPage = () => {
  const { complaintCode } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const response = await complaintsApi.trackComplaint(complaintCode);
        if (response.success) {
          setComplaint(response.data);
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError("Complaint not found.");
      }
    };

    fetchComplaint();
  }, [complaintCode]);

  if (error) return <div className="text-center mt-20 text-red-600 text-2xl">{error}</div>;
  if (!complaint) return <div className="text-center mt-20 text-xl text-gray-600">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-4xl font-bold text-center mb-8">Complaint Details</h1>

      <div className="bg-white shadow-lg rounded-xl p-8 space-y-6">
        <p><strong>Complaint Code:</strong> {complaint.complaint_code}</p>
        <p><strong>Title:</strong> {complaint.title}</p>
        <p><strong>Case Type:</strong> {complaint.case_type}</p>
        <p><strong>Description:</strong> {complaint.description}</p>
        <p><strong>Status:</strong> {complaint.status}</p>
        <p><strong>Priority:</strong> {complaint.priority}</p>
        <p><strong>Barangay:</strong> {complaint.barangay_name}</p>
        <p><strong>Complainant:</strong> {complaint.complainant_name}</p>
        <p><strong>Assigned Official:</strong> {complaint.assigned_official}</p>
        <p><strong>Date Submitted:</strong> {new Date(complaint.created_at).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default CU_TrackComplaintDetailsPage;
