import { api } from './api.js';
import store from './store.js';

export const behaviorService = {
    async fetchBehaviorProfile() {
        try {
            const data = await api.get('/behavior/profile');
            store.setBehaviorProfile(data);
            return data;
        } catch (error) {
            // If the endpoint doesn't exist yet, return mock data as per PRD
            console.warn('Behavior profile endpoint not found, using mock data.');
            const mockData = {
                total_boost: 12,
                breakdown: {
                    initiative: 5,
                    communication: 4,
                    critical_thinking: 3
                }
            };
            store.setBehaviorProfile(mockData);
            return mockData;
        }
    }
};
