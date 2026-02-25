import store from './store.js';
import { recommendationService } from './recommendation.service.js';
import { behaviorService } from './behavior.service.js';
import { feedbackService } from './feedback.service.js';

export const dashboardController = {
    async init() {
        console.log("🚀 Initializing Dashboard Controller...");
        try {
            // Step 1 & 2: Parallel fetch
            await Promise.all([
                recommendationService.fetchRecommendations(),
                behaviorService.fetchBehaviorProfile()
            ]);
            console.log("✅ Dashboard Data Loaded");
        } catch (error) {
            console.error("❌ Dashboard Initialization Failed:", error);
        }
    },

    async handleAction(internshipId, action) {
        console.log(`User action: ${action} on ${internshipId}`);
        try {
            await feedbackService.sendFeedback(internshipId, action);

            if (action === 'rejected') {
                // Remove from local store for immediate UI feedback
                store.recommendations = store.recommendations.filter(r => r.internship_id !== internshipId);
            }

            // Re-fetch to get updated scores and boosts
            await behaviorService.fetchBehaviorProfile();
            // recommendationService.fetchRecommendations(); // Optional: Re-rank

            return true;
        } catch (error) {
            alert('Action failed. Please try again.');
            return false;
        }
    }
};
