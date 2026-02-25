import { api } from './api.js';

export const roadmapService = {
    async getGapAnalysis(internshipId) {
        try {
            const data = await api.get(`/internship/${internshipId}/gap-analysis`);
            return data;
        } catch (error) {
            console.error('roadmapService: Failed to fetch gap analysis', error);
            throw error;
        }
    }
};
