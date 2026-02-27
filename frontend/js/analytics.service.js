
import { api } from './api.js';

export const analyticsService = {
    async getMatchTrend(range = '6months') {
        return await api.get(`/analytics/match-trend?range=${range}`);
    },

    async getSectorDistribution() {
        return await api.get('/analytics/sector-distribution');
    },

    async getBehavioralHeatmap() {
        return await api.get('/analytics/behavioral-heatmap');
    },

    async getSkillTimeline() {
        return await api.get('/analytics/skill-timeline');
    }
};
