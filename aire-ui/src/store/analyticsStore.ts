import { create } from 'zustand';
import api from '@/lib/api';

interface AnalyticsData {
  matchTrend: any[];
  growthPercentage: number;
  sectorDistribution: any;
  behavioralHeatmap: any[];
}

interface AnalyticsStore {
  data: AnalyticsData | null;
  isLoading: boolean;
  error: string | null;
  fetchAnalytics: () => Promise<void>;
}

export const useAnalyticsStore = create<AnalyticsStore>((set) => ({
  data: null,
  isLoading: false,
  error: null,

  fetchAnalytics: async () => {
    set({ isLoading: true, error: null });
    try {
      const [trendRes, sectorRes, heatmapRes] = await Promise.all([
        api.get('/analytics/match-trend'),
        api.get('/analytics/sector-distribution'),
        api.get('/analytics/behavioral-heatmap')
      ]);

      set({ 
        data: {
          matchTrend: trendRes.data.trend || [],
          growthPercentage: trendRes.data.growth_percentage || 0,
          sectorDistribution: sectorRes.data,
          behavioralHeatmap: heatmapRes.data,
        },
        isLoading: false 
      });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch analytics', isLoading: false });
    }
  }
}));
