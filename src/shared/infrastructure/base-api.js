import axios from 'axios';

/**
 * Base Axios instance for Vantage PMO API.
 * Reads the base URL from the environment variable VITE_API_BASE_URL.
 */
const baseApi = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

baseApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default baseApi;
