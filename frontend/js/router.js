import { renderLogin } from '../pages/login.js';
import { renderRegister } from '../pages/register.js';
import { renderProfile } from '../pages/profile.js';
import { renderDashboard } from '../pages/dashboard.js';
import { renderRecommendations } from '../pages/recommendations.js';
import { renderRoadmap } from '../pages/roadmap.js';
import { renderAnalytics } from '../pages/analytics.js';
import { renderSettings } from '../pages/settings.js';
import store from './store.js';

const routes = {
    '#/login': { render: renderLogin, auth: false },
    '#/register': { render: renderRegister, auth: false },
    '#/dashboard': { render: renderDashboard, auth: true },
    '#/profile': { render: renderProfile, auth: true },
    '#/recommendations': { render: renderRecommendations, auth: true },
    '#/roadmap': { render: renderRoadmap, auth: true, dynamic: true },
    '#/analytics': { render: renderAnalytics, auth: true },
    '#/settings': { render: renderSettings, auth: true }
};

function router() {
    const hash = window.location.hash || (store.isAuthenticated ? '#/dashboard' : '#/login');

    // Check for dynamic routes
    let matchedRoute = routes[hash];
    let params = {};

    if (!matchedRoute) {
        // Try matching dynamic routes (e.g. #/roadmap/123 matches #/roadmap)
        for (const [path, config] of Object.entries(routes)) {
            if (config.dynamic && hash.startsWith(path + '/')) {
                matchedRoute = config;
                params.id = hash.replace(path + '/', '');
                break;
            }
        }
    }

    if (!matchedRoute) {
        window.location.hash = store.isAuthenticated ? '#/dashboard' : '#/login';
        return;
    }

    // Route Protection
    if (matchedRoute.auth && !store.isAuthenticated) {
        window.location.hash = '#/login';
        return;
    }

    const app = document.getElementById('app');
    matchedRoute.render(app, params);
}

window.addEventListener('hashchange', router);
window.addEventListener('load', router);

export const navigate = (hash) => {
    window.location.hash = hash;
};
