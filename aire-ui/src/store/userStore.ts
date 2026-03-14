import { create } from 'zustand';
import api from '@/lib/api';

interface UserProfile {
  full_name?: string;
  email?: string;
  bio?: string;
  skills?: string[];
  target_roles?: string[];
  sector_preference?: string;
  location_preference?: string;
  preferred_language?: string;
  university?: string;
  graduation_year?: string;
  education?: string;
  linkedin_url?: string | null;
  github_url?: string | null;
  portfolio_url?: string | null;
  profile_strength?: number;
}

interface UserStore {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  logout: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  profile: null,
  isLoading: false,
  error: null,

  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      // First get basic me info
      const meRes = await api.get('/user/me');
      const profileRes = await api.get('/user/profile');
      
      set({ 
        profile: { ...meRes.data, ...profileRes.data }, 
        isLoading: false 
      });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch user', isLoading: false });
    }
  },

  updateProfile: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.put('/user/profile/update', data);
      set((state) => ({
        profile: { ...state.profile, ...res.data.profile },
        isLoading: false
      }));
    } catch (err: any) {
      set({ error: err.message || 'Failed to update profile', isLoading: false });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ profile: null });
    window.location.href = '/login';
  }
}));
