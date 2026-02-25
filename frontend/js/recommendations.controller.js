import { recommendationService } from './recommendation.service.js';
import store from './store.js';

export const recommendationsController = {
    state: {
        filters: {
            location: 'remote',
            min_score: 60,
            max_score: 100,
            limit: 30
        },
        loading: false
    },

    async init() {
        // Sync filter with user preference if available
        if (store.profile?.location_preference) {
            this.state.filters.location = store.profile.location_preference;
        }
        await this.loadResults();
    },

    async loadResults() {
        this.state.loading = true;
        try {
            await recommendationService.fetchRecommendations(this.state.filters);
        } catch (error) {
            console.error('Controller: Failed to load results', error);
        } finally {
            this.state.loading = false;
        }
    },

    async updateFilters(newFilters) {
        this.state.filters = { ...this.state.filters, ...newFilters };
        await this.loadResults();
    },

    async handleAction(internshipId, action) {
        try {
            await recommendationService.sendFeedback(internshipId, action);
            // Re-fetch after feedback to reflect re-ranking
            await this.loadResults();
            return true;
        } catch (error) {
            console.error(`Controller: Action ${action} failed`, error);
            return false;
        }
    }
};
