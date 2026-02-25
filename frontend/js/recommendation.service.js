import { api } from './api.js';
import store from './store.js';

export const recommendationService = {
    async fetchRecommendations(filters = {}) {
        store.loading = true;
        try {
            const data = await api.post('/recommend/', filters);
            // The response might be a list or an object
            if (Array.isArray(data)) {
                store.recommendations = data;
            } else if (data && data.recommendations) {
                store.recommendations = Array.isArray(data.recommendations) ? data.recommendations : [];
                store.profileStrength = data.profile_strength || store.profileStrength;
                store.semanticAlignment = data.semantic_alignment || store.semanticAlignment;
                store.gapAnalysis = data.gap_analysis || store.gapAnalysis;
            } else {
                store.recommendations = [];
            }
            return data;
        } catch (error) {
            console.error('Failed to fetch recommendations:', error);
            throw error;
        } finally {
            store.loading = false;
        }
    },

    async sendFeedback(internshipId, action) {
        try {
            const response = await api.post('/feedback/', {
                internship_id: internshipId,
                action: action
            });
            return response;
        } catch (error) {
            console.error('Failed to send feedback:', error);
            throw error;
        }
    }
};
