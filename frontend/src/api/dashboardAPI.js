import { axiosPrivate } from './axios';

const getDashboardCounts = async (role, barangayId, userId) => {
    const params = new URLSearchParams();

    if (role) {
        params.append('role', role);
    }
    if (barangayId) {
        params.append('barangay_id', barangayId);
    }
    if (userId) {
        params.append('user_id', userId);
    }
    const response = await axiosPrivate.get(`/api/dashboard/counts?${params.toString()}`);
    
    return response.data;
};

const getCaseTypeBreakdown = async (role, barangayId, userId) => {
    const params = new URLSearchParams();
    if (role) params.append('role', role);
    if (barangayId) params.append('barangay_id', barangayId);
    if (userId) params.append('user_id', userId);

    const response = await axiosPrivate.get(`/api/dashboard/case_type_breakdown?${params.toString()}`);
    return response.data; 
};

const getPriorityBreakdown = async (role, barangayId, userId) => {
    const params = new URLSearchParams();
    if (role) params.append('role', role);
    if (barangayId) params.append('barangay_id', barangayId);
    if (userId) params.append('user_id', userId);

    const response = await axiosPrivate.get(`/api/dashboard/priority_breakdown?${params.toString()}`);
    return response.data; 
};

const getUrgentComplaints = async (role, barangayId, userId) => {
    const params = new URLSearchParams();
    if (role) params.append('role', role);
    if (barangayId) params.append('barangay_id', barangayId);
    if (userId) params.append('user_id', userId);

    const response = await axiosPrivate.get(`/api/dashboard/urgent_complaints?${params.toString()}`);
    return response.data; 
};

const getRecentComplaints = async (role, barangayId, userId) => {
    const params = new URLSearchParams();
    if (role) params.append('role', role);
    if (barangayId) params.append('barangay_id', barangayId);
    if (userId) params.append('user_id', userId);

    const response = await axiosPrivate.get(`/api/dashboard/recent_complaints?${params.toString()}`);
    return response.data; // Returns: [{ id: 1, title: "...", status: "Pending" }, ...]
};


const getUnassignedOfficials = async (role, barangayId) => {
    const params = new URLSearchParams();
    if (role) params.append('role', role);
    if (barangayId) params.append('barangay_id', barangayId);

    const response = await axiosPrivate.get(`/api/dashboard/unassigned_officials?${params.toString()}`);
    return response.data; // Returns: [{ user_id: 5, first_name: 'Padre', last_name: 'Damaso' }, ...]
};






// Export the API functions
const dashboardApi = {
    getDashboardCounts,
    getCaseTypeBreakdown,
    getPriorityBreakdown,
    getUrgentComplaints,
    getRecentComplaints,
    getUnassignedOfficials,
};

export default dashboardApi;