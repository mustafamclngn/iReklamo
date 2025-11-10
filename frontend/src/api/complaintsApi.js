import axios from './axios';

export const complaintsApi = {
  ongoingComplaintsAssignee: async (assigned_official_id) => {
    try {
      const encodedAssignee = encodeURIComponent(assigned_official_id);
      const response = await axios.get(`/api/complaints/ongoing/${encodedAssignee}`);
      console.log("Fetching: ", response)
      return response.data;
    } catch (error) {
      console.error('Error fetching complaints by assignee ID:', error);
      throw error;
    }
  }

};

export default complaintsApi;