/**
 * auth.service.js - Authentication Service Layer
 */

import { api } from './api.js';
import store from './store.js';

const authService = {
    async login(email, password) {
        const response = await api.post('/auth/login', { email, password });
        if (response.access_token) {
            store.setToken(response.access_token);
            // Fetch profile and store user data
            const profile = await api.get('/user/profile');
            store.setUser({
                email: email,
                name: email.split('@')[0], // Fallback name from email
                ...profile
            });
            return response;
        }
    },

    async register(email, password) {
        const response = await api.post('/auth/register', { email, password });
        // Auto-login after registration as per PRD Step 7.3
        await this.login(email, password);
        return response;
    },

    logout() {
        store.clearToken();
        window.location.hash = '#/login';
    },

    checkAuth() {
        return store.isAuthenticated;
    }
};

export default authService;
