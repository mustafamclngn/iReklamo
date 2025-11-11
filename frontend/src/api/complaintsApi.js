import axios from './axios';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const useComplaintsApi = () => {
  const axiosPrivate = useAxiosPrivate();

  // Get all complaints in progress under an official
  const ongoingComplaints = async (assigned_official_id) => {
    try {
      const encodedAssignee = encodeURIComponent(assigned_official_id);
      const response = await axiosPrivate.get(`/api/complaints/ongoing/${encodedAssignee}`);
      console.log("Fetching: ", response)
      return response.data;
    } catch (error) {
      console.error('Error fetching complaints by assignee ID:', error);
      throw error;
    }
  };

  const complaintsByBarangayId = async (barangay_id) => {
    try {
      const encodedBarangay = encodeURIComponent(barangay_id);
      const response = await axiosPrivate.get(`/api/complaints/all_complaints?barangay=${encodedBarangay}`);
      console.log("Fetching: ", response)
      return response.data;
    } catch (error) {
      console.error('Error fetching complaints by barangay ID:', error);
      throw error;
    }
  };

  const StatusComplaintsByBarangayId = async (barangay_id, status) => {
    try {
      const params = new URLSearchParams();

      params.append('barangay', encodeURIComponent(barangay_id));
      params.append('status', encodeURIComponent(status));

      const response = await axiosPrivate.get(`/api/complaints/all_complaints?${params.toString()}`);
      console.log("Fetching: ", response)
      return response.data;
    } catch (error) {
      console.error('Error fetching pending complaints by barangay ID:', error);
      throw error;
    }
  };

  const assignComplaints = async (complaint_id, assigned_official_id) => {
    try {
      const encodedComplaint = encodeURIComponent(complaint_id);
      const encodedAssignee = encodeURIComponent(assigned_official_id);
      const response = await axiosPrivate.get(`/api/complaints/assign/${encodedComplaint}/${encodedAssignee}`);
      console.log("Fetching: ", response)
      return response.data;
    } catch (error) {
      console.error('Error assigning complaint to officer', error);
      throw error;
    }
  };

  return { ongoingComplaints, complaintsByBarangayId, StatusComplaintsByBarangayId, assignComplaints }
};

export default useComplaintsApi;