import { create } from 'zustand';
import api from '@/lib/api';

export interface Application {
  id: string;
  internship_id: string;
  title: string;
  company: string;
  status: string;
  date: string;
  location: string;
}

interface ApplicationStore {
  applications: Application[];
  isLoading: boolean;
  error: string | null;
  fetchApplications: () => Promise<void>;
}

export const useApplicationStore = create<ApplicationStore>((set) => ({
  applications: [],
  isLoading: false,
  error: null,

  fetchApplications: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get('/feedback/applications');
      set({ 
        applications: res.data || [], 
        isLoading: false 
      });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch applications', isLoading: false });
    }
  }
}));
