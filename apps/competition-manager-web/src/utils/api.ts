import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api'; // Need to get the base URL from the environment

let accessToken: string | null = null;

// Create an Axios instance
export const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, // Include cookies in requests
});

// Add a request interceptor to add the access token to each request
api.interceptors.request.use((config) => {

    // If the access token is not null, add it to the Authorization header
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
});

// Add a response interceptor to handle errors
api.interceptors.response.use(
    response => response,
    async (error) => {
        const originalRequest = error.config;
    
        // Check if error status is 401 (Unauthorized) and retry hasn't happened yet
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Prevents infinite loop
    
            try {
                // Call refresh token endpoint to get a new access token
                const { data } = await axios.post(`${BASE_URL}/users/refresh-token`, {}, { withCredentials: true });
                
                // Update the access token in memory
                accessToken = data.accessToken;
        
                // Retry the original request with the new access token
                originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                // Optional: Redirect to login page if refresh fails
                // window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);



