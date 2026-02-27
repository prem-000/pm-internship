/**
 * api.js - Centralized Fetch Wrapper
 * Responsibilities:
 * - Attach JWT automatically
 * - Handle 401 globally
 * - Centralized error parsing
 */

import store from './store.js';

// Base URL configuration
const getBaseUrl = () => {
    if (
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1'
    ) {
        return 'http://localhost:8000/api';
    }

    // Production backend (Render)
    return 'https://pm-internship-u7yf.onrender.com/api';
};

const BASE_URL = getBaseUrl();

async function apiRequest(method, endpoint, body = null) {
    const url = `${BASE_URL}${endpoint}`;

    const headers = {
        'Content-Type': 'application/json',
    };

    if (store.token) {
        headers['Authorization'] = `Bearer ${store.token}`;
    }

    const options = {
        method,
        headers,
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(url, options);

        if (response.status === 401) {
            // Global Unauthorized Handler
            store.clearToken();
            window.location.hash = '#/login';
            throw new Error('Session expired. Please login again.');
        }

        const data = await response.json();

        if (!response.ok) {
            // Handle structured FastAPI errors (detail field)
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
    post: (endpoint, body) => apiRequest('POST', endpoint, body),
    put: (endpoint, body) => apiRequest('PUT', endpoint, body),
    delete: (endpoint) => apiRequest('DELETE', endpoint),
};
