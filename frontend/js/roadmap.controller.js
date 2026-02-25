import { roadmapService } from './roadmap.service.js';

export const roadmapController = {
    state: {
        internshipId: null,
        data: null,
        simulationEnabled: false,
        loading: false,
        error: null
    },

    async init(internshipId) {
        this.state.internshipId = internshipId;
        this.state.simulationEnabled = false;
        this.state.error = null;
        await this.loadData();
    },

    async loadData() {
        this.state.loading = true;
        try {
            this.state.data = await roadmapService.getGapAnalysis(this.state.internshipId);
        } catch (error) {
            console.error('RoadmapController: Load failed', error);
            this.state.error = "Unable to fetch gap analysis. Please try again.";
        } finally {
            this.state.loading = false;
        }
    },

    toggleSimulation() {
        this.state.simulationEnabled = !this.state.simulationEnabled;
        return this.state.simulationEnabled;
    },

    getCurrentScores() {
        if (!this.state.data) return null;

        const { internship, gap_analysis } = this.state.data;

        if (this.state.simulationEnabled) {
            return {
                overall: gap_analysis.projected_score_if_completed,
                skill_match: 100, // Simulated success
                semantic: internship.semantic_fit,
                behavior: internship.behavior_boost,
                isProjected: true
            };
        }

        return {
            overall: internship.overall_score,
            skill_match: internship.skill_match,
            semantic: internship.semantic_fit,
            behavior: internship.behavior_boost,
            isProjected: false
        };
    }
};
