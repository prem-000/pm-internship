import { api } from './api.js';

export const auth = {
    login: async (email, password) => {
        try {
            const data = await api.post('/admin/login', { email, password });
            if (data.access_token) {
                api.setToken(data.access_token);
                return true;
            }
            return false;
        } catch (error) {
            throw error;
        }
    },

    logout: () => {
        api.clearToken();
        window.location.href = 'login.html';
    },

    isAuthenticated: () => {
        return !!api.getToken();
    }
};
