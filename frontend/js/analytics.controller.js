
import { analyticsService } from './analytics.service.js';
import store from './store.js';

export const analyticsController = {
    state: {
        trend: [],
        growth: 0,
        sectors: [],
        totalMatch: 0,
        heatmap: [],
        timeline: [],
        loading: false
    },

    async init() {
        this.state.loading = true;
        try {
            const [trendData, sectorData, heatmapData, timelineData] = await Promise.all([
                analyticsService.getMatchTrend(),
                analyticsService.getSectorDistribution(),
                analyticsService.getBehavioralHeatmap(),
                analyticsService.getSkillTimeline()
            ]);

            this.state.trend = trendData.trend;
            this.state.growth = trendData.growth_percentage;
            this.state.sectors = sectorData.sectors;
            this.state.totalMatch = sectorData.total_match;
            this.state.heatmap = heatmapData;
            this.state.timeline = timelineData;

            console.log("📊 Analytics Data Loaded:", this.state);
        } catch (error) {
            console.error("❌ Analytics Initialization Failed:", error);
        } finally {
            this.state.loading = false;
        }
    }
};
