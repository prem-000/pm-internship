import { create } from 'zustand';
import api from '@/lib/api';

export interface Recommendation {
  internship_id: string;
  title: string;
  organization?: string;
  company?: string;
  location?: string;
  apply_url?: string;
  score: number;
  match_details: {
    matched_skills: string[];
    missing_skills: string[];
    skill_match_percentage: number;
  };
  gap_analysis: {
    missing_skills: string[];
    skill_impact_score: number;
    semantic_gap_score: number;
    estimated_score_if_completed: number;
    recommended_focus_order: string[];
  };
}

interface SkillGapReport {
  internship: {
    id: string;
    title: string;
  };
  user_skills: string[];
  missing_skills: {
    skills: string[];
  };
  explanation: {
    gemini_text: string;
  };
}

interface GapAnalysis {
  missing_skills: string[];
  impact_scores: Record<string, number>;
}

interface RecommendationStore {
  recommendations: Recommendation[];
  gap_analysis: GapAnalysis | null;
  skillGapReport: SkillGapReport | null;
  isLoading: boolean;
  isGapLoading: boolean;
  error: string | null;
  fetchRecommendations: () => Promise<void>;
  fetchSkillGap: (internshipId: string) => Promise<void>;
  clearSkillGap: () => void;
}

export const useRecommendationStore = create<RecommendationStore>((set) => ({
  recommendations: [],
  gap_analysis: null,
  skillGapReport: null,
  isLoading: false,
  isGapLoading: false,
  error: null,

  fetchRecommendations: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/recommend/');
      set({ 
        recommendations: res.data.recommendations || [], 
        gap_analysis: res.data.gap_analysis || null,
        isLoading: false 
      });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch recommendations', isLoading: false });
    }
  },

  fetchSkillGap: async (internshipId: string) => {
    set({ isGapLoading: true, error: null });
    try {
      const res = await api.get(`/recommend/${internshipId}/skill-gap`);
      set({ 
        skillGapReport: res.data,
        isGapLoading: false 
      });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch skill gap', isGapLoading: false });
    }
  },

  clearSkillGap: () => set({ skillGapReport: null, isGapLoading: false })
}));
