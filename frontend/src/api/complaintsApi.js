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

const complaintsApi = {
  getAllComplaints: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await axiosPrivate.get(`/api/complaints/?${params}`);
    return response.data;
  },

  getComplaintById: async (id) => {
    const response = await axiosPrivate.get(`/api/complaints/${id}`);
    return response.data;
  },

  updateComplaint: async (id, data) => {
    const response = await axiosPrivate.put(`/api/complaints/${id}`, data);
    return response.data;
  },

  getBarangays: async () => {
    const response = await axiosPrivate.get('/api/complaints/barangays');
    return response.data;
  },

  getBarangayComplaints: async (barangayName) => {
    const response = await axiosPrivate.get(`/api/complaints/barangay/${barangayName}`);
    return response.data;
  },

  getAssignedComplaints: async (officialId) => {
    const response = await axiosPrivate.get(`/api/complaints/assigned/${officialId}`);
    return response.data;
  },

  // Role-based endpoints
  getBarangayCaptainComplaints: async (userId) => {
    const response = await axiosPrivate.get(`/api/complaints/barangay-captain/${userId}`);
    return response.data;
  },

  getBarangayOfficialComplaints: async (userId) => {
    const response = await axiosPrivate.get(`/api/complaints/barangay-official/${userId}`);
    return response.data;
  },
};

export default complaintsApi;
