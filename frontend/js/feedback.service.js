import { api } from './api.js';
import store from './store.js';

export const feedbackService = {
    async sendFeedback(internshipId, action) {
        try {
            const response = await api.post('/feedback/', {
                internship_id: internshipId,
                action: action
            });

            // Optimistic updates could be done here if the store supports it
            // For now, we'll just return the response
            return response;
        } catch (error) {
            console.error('Failed to send feedback:', error);
            throw error;
        }
    }
};
