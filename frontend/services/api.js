/**
 * api.js - Centralized Fetch Wrapper
 */

import store from '../js/store.js';

const getBaseUrl = () => {
    if (
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1'
    ) {
        return 'http://localhost:8000/api';
    }

    return 'https://pm-internship-u7yf.onrender.com/api';
};

const BASE_URL = getBaseUrl();

async function apiRequest(method, endpoint, body = null, isMultipart = false) {
    const url = `${BASE_URL}${endpoint}`;

    const headers = {};
    if (!isMultipart) {
        headers['Content-Type'] = 'application/json';
    }

    if (store.token) {
        headers['Authorization'] = `Bearer ${store.token}`;
    }

    const options = {
        method,
        headers,
    };

    if (body) {
        options.body = isMultipart ? body : JSON.stringify(body);
    }

    try {
        const response = await fetch(url, options);

        if (response.status === 401) {
            store.clearToken();
            window.location.hash = '#/login';
            throw new Error('Session expired. Please login again.');
        }

        const data = await response.json();

        if (!response.ok) {
            const errorMessage = data.detail || 'An unexpected error occurred';
            throw new Error(errorMessage);
        }

        return data;
    } catch (error) {
        console.error(`API Error [${method} ${endpoint}]:`, error.message);
        throw error;
    }
}

export const api = {
    get: (endpoint) => apiRequest('GET', endpoint),
    post: (endpoint, body, isMultipart = false) => apiRequest('POST', endpoint, body, isMultipart),
    put: (endpoint, body) => apiRequest('PUT', endpoint, body),
    delete: (endpoint) => apiRequest('DELETE', endpoint),
};
