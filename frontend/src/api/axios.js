import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || "/";

export default axios.create({
    baseURL: BASE_URL
})

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json'},
    withCredentials: true
});

// Add request interceptor to include auth token
axiosPrivate.interceptors.request.use(
    (config) => {
        // Get token from localStorage since we can't use hooks in interceptors
        const auth = JSON.parse(localStorage.getItem('auth') || '{}');
        if (auth?.accessToken) {
            config.headers.Authorization = `Bearer ${auth.accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add response interceptor to handle token refresh
axiosPrivate.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Try to refresh the token
                const refreshResponse = await axios.get('/api/auth/refresh', {
                    baseURL: BASE_URL,
                    withCredentials: true
                });

                const newAccessToken = refreshResponse.data.accessToken;
                const newRoles = refreshResponse.data.roles;

                // Update localStorage
                const currentAuth = JSON.parse(localStorage.getItem('auth') || '{}');
                const updatedAuth = {
                    ...currentAuth,
                    accessToken: newAccessToken,
                    roles: newRoles
                };
                localStorage.setItem('auth', JSON.stringify(updatedAuth));

                // Update the original request with new token
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                // Retry the original request
                return axiosPrivate(originalRequest);
            } catch (refreshError) {
                // Refresh failed, redirect to login or handle appropriately
                console.error('Token refresh failed:', refreshError);
                // Clear auth data
                localStorage.removeItem('auth');
                localStorage.removeItem('persist');
                // You might want to redirect to login page here
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);
