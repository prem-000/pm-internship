/**
 * api.js - Centralized Fetch Wrapper
 * Responsibilities:
 * - Attach JWT automatically
 * - Handle 401 globally
 * - Centralized error parsing
 */

import store from './store.js';

// Base URL — switch to your Render URL for production
const BASE_URL = 'https://pm-internship-u7yf.onrender.com/api'; // production (Render)

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
