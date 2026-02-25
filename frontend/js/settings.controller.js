import { settingsService } from './settings.service.js';
import store from './store.js';

export const settingsController = {
    async init() {
        try {
            const userData = await settingsService.getMyInfo();
            store.setUser({ ...store.user, ...userData });
            return userData;
        } catch (error) {
            console.error('Failed to load settings data:', error);
            throw error;
        }
    },

    async handleResetBehavior() {
        try {
            const response = await settingsService.resetBehavior();
            return response;
        } catch (error) {
            console.error('Failed to reset behavior:', error);
            throw error;
        }
    },

    async handleClearFeedback() {
        try {
            const response = await settingsService.clearFeedback();
            // Also refresh recommendations in store if needed
            store.recommendations = [];
            return response;
        } catch (error) {
            console.error('Failed to clear feedback:', error);
            throw error;
        }
    }
};
