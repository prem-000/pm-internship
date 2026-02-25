import { api } from './api.js';
import store from './store.js';

export const profileService = {
    async getProfile() {
        store.profileLoading = true;
        try {
            const data = await api.get('/user/profile');
            store.profile = data;
            store.profileStrength = data.profile_strength;
            store.semanticAlignment = data.semantic_alignment;
            return data;
        } catch (error) {
            console.error('Failed to fetch profile:', error);
            throw error;
        } finally {
            store.profileLoading = false;
        }
    },

    async updateProfile(profileData) {
        try {
            const response = await api.put('/user/profile/update', profileData);
            // Refresh local state after update
            await this.getProfile();
            return response;
        } catch (error) {
            console.error('Failed to update profile:', error);
            throw error;
        }
    }
};
