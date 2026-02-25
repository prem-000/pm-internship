import { api } from './api.js';

export const settingsService = {
    async getMyInfo() {
        return await api.get('/user/me');
    },

    async resetBehavior() {
        return await api.post('/behavior/reset');
    },

    async clearFeedback() {
        return await api.delete('/feedback/clear');
    }
};
