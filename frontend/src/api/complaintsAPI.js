import axios from './axios';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const useComplaintsApi = () => {
  const axiosPrivate = useAxiosPrivate();

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

  // track complaint (public endpoint - no auth required)
  const trackComplaint = async (complaintCode) => {
    try {
      console.log("Tracking complaint:", complaintCode)
      const response = await axios.get(`/api/complaints/track/${complaintCode}`, { withCredentials: true });
      console.log("Tracked: ", response.data)
      return response.data;
    } catch (error) {
      console.error('Error tracking complaint:', error);
      if (error.response) {
        return error.response.data;
      }
      return {
        success: false,
        message: 'Unable to track complaint. Please try again later.'
      };
    }
  };

  const getAllComplaints = async (filters = {}) => {
      try {
        const params = new URLSearchParams(filters).toString();
        const response = await axiosPrivate.get(`/api/complaints/?${params}`);
        console.log(response)
        return response.data;
      } catch (error) {
        console.error('Error fetching complaints', error);
        throw error;
      }
  };

  const getActiveCases = async (assigned_official_id) => {
      try {
        const response = await axiosPrivate.get(`/api/complaints/cases/active/${assigned_official_id}`);
        console.log(response)
        return response.data;
      } catch (error) {
        console.error('Error fetching complaint', error);
        throw error;
      }
  };

  const getResolvedCases = async (assigned_official_id) => {
      try {
        const response = await axiosPrivate.get(`/api/complaints/cases/resolved/${assigned_official_id}`);
        console.log(response)
        return response.data;
      } catch (error) {
        console.error('Error assigning complaint', error);
        throw error;
      }
  };

  const getComplaintById = async (id) => {
    const response = await axiosPrivate.get(`/api/complaints/${id}`);
    return response.data;
  };

  const updateComplaint = async (id, data) => {
    const response = await axiosPrivate.put(`/api/complaints/${id}`, data);
    return response.data;
  };

  const getBarangays = async () => {
    const response = await axiosPrivate.get('/api/complaints/barangays');
    return response.data;
  };

  const getBarangayComplaints = async (barangayName) => {
    const response = await axiosPrivate.get(`/api/complaints/barangay/${barangayName}`);
    return response.data;
  };

  const getAssignedComplaints = async (officialId) => {
    const response = await axiosPrivate.get(`/api/complaints/assigned/${officialId}`);
    return response.data;
  };

  const getBarangayCaptainComplaints = async (userId) => {
    const response = await axiosPrivate.get(`/api/complaints/barangay-captain/${userId}`);
    return response.data;
  };

  const getBarangayOfficialComplaints = async (userId) => {
    const response = await axiosPrivate.get(`/api/complaints/barangay-official/${userId}`);
    return response.data;
  };

return {
    complaintsByBarangayId,
    StatusComplaintsByBarangayId,
    assignComplaints,
    trackComplaint,
    getAllComplaints,
    getComplaintById,
    updateComplaint,
    getBarangays,
    getBarangayComplaints,
    getAssignedComplaints,
    getBarangayCaptainComplaints,
    getBarangayOfficialComplaints,
    getActiveCases,
    getResolvedCases
  };

};

export default useComplaintsApi;