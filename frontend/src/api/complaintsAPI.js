const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const complaintsApi = {
  getAllComplaints: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE_URL}/api/complaints/?${params}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return await response.json();
  },

  getComplaintById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/api/complaints/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return await response.json();
  },

  updateComplaint: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/api/complaints/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  },

  getBarangayComplaints: async (barangayName) => {
    const response = await fetch(`${API_BASE_URL}/api/complaints/barangay/${barangayName}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return await response.json();
  },

  getAssignedComplaints: async (officialId) => {
    const response = await fetch(`${API_BASE_URL}/api/complaints/assigned/${officialId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return await response.json();
  },
};

export default complaintsApi;
