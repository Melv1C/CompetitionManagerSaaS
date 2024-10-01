import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

import { jwtDecode } from 'jwt-decode';

const ADMIN_URL = "https://competitionmanager.be/api/myadmin";


// Create a new Axios instance
const myAxios: AxiosInstance = axios.create({
    baseURL: ADMIN_URL || 'http://localhost:3000/admin',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add an interceptor to the Axios instance
myAxios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Export the Axios instance
export default myAxios;

async function refreshToken(setHasToken: (hasToken: boolean) => void) {
    console.log('Refreshing token');
    const token = localStorage.getItem('token');
    if (!token) {
        setHasToken(false);
        return;
    }
    try {
        const response = await myAxios.post('/refresh-token');
        const newToken = response.data.token;

        // Decode the new token and set a new timeout
        const decodedToken = jwtDecode(newToken);
        const expiration = decodedToken.exp! * 1000 - 60000; // 1 minute before expiration
        setTimeout(() => refreshToken(setHasToken), expiration - Date.now());

        localStorage.setItem('token', newToken);
        setHasToken(true);
        
        console.log('Token refreshed');

    } catch (error) {
        localStorage.removeItem('token');
        setHasToken(false);
        console.error('Error refreshing token:', error);
    }   
}

export { refreshToken };

async function MySQLQuery(query: string, values: any) {
    try {
        const response = await myAxios.post('/MYSQL', { query, values });
        return response.data.data;
    } catch (error) {
        console.error('Error querying MySQL:', error);
        throw error;
    }
}

export { MySQLQuery };
