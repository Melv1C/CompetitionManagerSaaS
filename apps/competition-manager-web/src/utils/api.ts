import { getRefreshToken } from '@/api';
import axios from 'axios';
import i18n from '../i18n';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

let accessToken: string | null = null;

export const setAccessToken = (token: string) => {
    accessToken = token;
};

// Create an Axios instance
export const api = axios.create({
    baseURL: BASE_URL,
});

export const apiWithCredentials = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, // Include cookies in requests
});

// Add a request interceptor to add the access token to each request
api.interceptors.request.use((config) => {
    // If the access token is not null, add it to the Authorization header
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    config.headers['Accept-Language'] = i18n.language;

    return config;
});

// Add a response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Check if error status is 401 (Unauthorized) and retry hasn't happened yet
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Prevents infinite loop

            try {
                // Call refresh token endpoint to get a new access token
                const token = await getRefreshToken();

                // Update the access token in memory
                accessToken = token;

                // Retry the original request with the new access token
                originalRequest.headers[
                    'Authorization'
                ] = `Bearer ${accessToken}`;
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
