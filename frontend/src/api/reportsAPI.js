import { axiosPrivate } from "./axios";

const getAnnualComplaintCounts = async (role, userId) => {
    const params = new URLSearchParams();
    if (role) params.append('role', role);
    if (userId) params.append('user_id', userId);

    const response = await axiosPrivate.get(`/api/dashboard/annual_complaint_counts?${params.toString()}`);
    return response.data; 
};


const getMonthlyComplaintCounts = async (role, barangayId, userId, year) => {
    const params = new URLSearchParams();
    if (role) params.append('role', role);
    if (barangayId) params.append('barangay_id', barangayId);
    if (userId) params.append('user_id', userId);
    if (year) params.append('year', year);

    const response = await axiosPrivate.get(`/api/dashboard/monthly_complaint_counts?${params.toString()}`);
    return response.data;
};


const getTop3CaseTypes = async (role, barangayId, userId, year) => {
    const params = new URLSearchParams();
    if (role) params.append('role', role);
    if (barangayId) params.append('barangay_id', barangayId);
    if (userId) params.append('user_id', userId);
    if (year) params.append('year', year);

    const response = await axiosPrivate.get(`/api/dashboard/top_case_types?${params.toString()}`);
    return response.data;
};


const getMonthlyCaseTypePerBarangay = async (month, year) => {
    const params = new URLSearchParams();
    if (month) params.append('month', month);
    if (year) params.append('year', year);

    const response = await axiosPrivate.get(`/api/dashboard/monthly_case_type_per_barangay?${params.toString()}`);
    return response.data;
};


const getMonthlyStatusPerBarangay = async (month, year) => {
    const params = new URLSearchParams();
    if (month) params.append('month', month);
    if (year) params.append('year', year);

    const response = await axiosPrivate.get(`/api/dashboard/monthly_status_per_barangay?${params.toString()}`);
    return response.data;
};


const getAvgResolutionTimePerBarangay = async () => {
    const response = await axiosPrivate.get('/api/dashboard/avg_resolution_time_per_barangay');
    return response.data;
};


const getTopUrgentBarangays = async () => {
    const response = await axiosPrivate.get('/api/dashboard/top_urgent_barangays');
    return response.data;
};


const getTopModerateBarangays = async () => {
    const response = await axiosPrivate.get('/api/dashboard/top_moderate_barangays');
    return response.data;
};


const getTopLowBarangays = async () => {
    const response = await axiosPrivate.get('/api/dashboard/top_low_barangays');
    return response.data;
};


const getPriorityCountsPerBarangay = async (month, year) => {
    const params = new URLSearchParams();
    if (month) params.append('month', month);
    if (year) params.append('year', year);

    const response = await axiosPrivate.get(`/api/dashboard/priority_counts_per_barangay?${params.toString()}`);
    return response.data;
};


export default {
    getAnnualComplaintCounts,
    getMonthlyComplaintCounts,
    getTop3CaseTypes,
    getMonthlyCaseTypePerBarangay,
    getMonthlyStatusPerBarangay,
    getAvgResolutionTimePerBarangay,
    getTopUrgentBarangays,
    getTopModerateBarangays,
    getTopLowBarangays,
    getPriorityCountsPerBarangay
}