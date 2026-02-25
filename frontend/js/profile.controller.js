import { profileService } from './profile.service.js';
import store from './store.js';
import { recommendationService } from './recommendation.service.js';

export const profileController = {
    async init() {
        try {
            await profileService.getProfile();
        } catch (error) {
            console.error('Profile initialization failed:', error);
        }
    },

    async handleSave(profileData) {
        try {
            await profileService.updateProfile(profileData);
            // PRD: Recalculate strength/alignment by calling recommendations silently
            await recommendationService.fetchRecommendations();
            return true;
        } catch (error) {
            console.error('Save failed:', error);
            return false;
        }
    }
};
