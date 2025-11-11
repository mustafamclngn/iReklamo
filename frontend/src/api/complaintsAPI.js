import { axiosPrivate } from './axios';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

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

  // track complaint
  trackComplaint: async (complaintCode) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/complaints/track/${complaintCode}`);
      return response.data;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      }
      throw error;
    }
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