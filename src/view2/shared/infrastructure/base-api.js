import axios from 'axios';

/**
 * Base Axios instance for API communication
 */
const baseApi = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

console.log(
    'VITE_API_BASE_URL:',
    import.meta.env.VITE_API_BASE_URL,
    typeof import.meta.env.VITE_API_BASE_URL
);

export default baseApi;