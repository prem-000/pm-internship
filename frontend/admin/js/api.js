/**
 * admin/js/api.js - Admin specific fetch wrapper
 */

const getBaseUrl = () => {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:8000/api';
    }
    return 'https://pm-internship-u7yf.onrender.com/api';
};

const BASE_URL = getBaseUrl();

export const api = {
    getToken: () => localStorage.getItem('admin_token'),
    setToken: (token) => localStorage.setItem('admin_token', token),
    clearToken: () => localStorage.removeItem('admin_token'),

    request: async (method, endpoint, body = null) => {
        const token = api.getToken();
        const headers = {
            'Content-Type': 'application/json',
        };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const options = { method, headers };
        if (body) options.body = JSON.stringify(body);

        try {
            const response = await fetch(`${BASE_URL}${endpoint}`, options);

            if (response.status === 401) {
                api.clearToken();
                window.location.href = 'login.html';
                return;
            }

            const data = await response.json();
            if (!response.ok) throw new Error(data.detail || 'API Error');
            return data;
        } catch (error) {
            if (error instanceof TypeError && error.message.includes('fetch')) {
                console.error('Network Error: Could not connect to the server at', BASE_URL);
                throw new Error(`Connection Failed: Please ensure the backend server is running at ${BASE_URL}. If it is, check for CORS issues.`);
            }
            console.error(`API Error [${method} ${endpoint}]:`, error.message);
            throw error;
        }
    },

    get: (endpoint) => api.request('GET', endpoint),
    post: (endpoint, body) => api.request('POST', endpoint, body),
    patch: (endpoint, body) => api.request('PATCH', endpoint, body),
    delete: (endpoint) => api.request('DELETE', endpoint),
};
