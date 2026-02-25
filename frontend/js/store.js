/**
 * store.js - Authentication State Management
 */

const store = {
    token: sessionStorage.getItem('aire_token') || null,
    user: JSON.parse(sessionStorage.getItem('aire_user')) || null,
    isAuthenticated: !!sessionStorage.getItem('aire_token'),

    // Dashboard State
    recommendations: [],
    behaviorProfile: null,
    profile: null,
    profileStrength: 0,
    semanticAlignment: 0,
    gapAnalysis: null,
    loading: false,
    profileLoading: false,

    setToken(token) {
        this.token = token;
        this.isAuthenticated = true;
        sessionStorage.setItem('aire_token', token);
    },

    setUser(user) {
        this.user = user;
        sessionStorage.setItem('aire_user', JSON.stringify(user));
    },

    setDashboardData(data) {
        this.recommendations = data.recommendations || [];
        this.profileStrength = data.profile_strength || 0;
        this.semanticAlignment = data.semantic_alignment || 0;
        this.gapAnalysis = data.gap_analysis || {};
    },

    setBehaviorProfile(profile) {
        this.behaviorProfile = profile;
    },

    clearToken() {
        this.token = null;
        this.user = null;
        this.isAuthenticated = false;
        this.recommendations = [];
        this.behaviorProfile = null;
        sessionStorage.removeItem('aire_token');
        sessionStorage.removeItem('aire_user');
    }
};

export default store;

