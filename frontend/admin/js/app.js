import { auth } from './auth.js';
import { renderSidebar } from '../components/sidebar.js';
import { renderHeader } from '../components/header.js';

// Page imports
import { renderDashboard } from '../pages/dashboard.js';
import { renderAnalytics } from '../pages/analytics.js';
import { renderUsers } from '../pages/users.js';
import { renderInternships } from '../pages/internships.js';
import { renderLogs } from '../pages/logs.js';
import { renderSettings } from '../pages/settings.js';

const renderPlaceholder = (title) => async (container) => {
    container.innerHTML = `
        <div class="p-8 group">
            <h2 class="text-xl font-black mb-4 text-white uppercase tracking-tight">${title}</h2>
            <div class="glass-panel p-20 text-center">
                <div class="size-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/5">
                    <span class="material-symbols-outlined text-text-muted text-3xl">construction</span>
                </div>
                <p class="text-text-muted font-bold uppercase tracking-widest text-[10px]">Module Synchronization Pending</p>
                <p class="text-text-muted/50 text-xs mt-2">Planned for Next Implementation Phase</p>
            </div>
        </div>`;
};

const routes = {
    '#/dashboard': { render: renderDashboard, title: 'Tactical Overview' },
    '#/analytics': { render: renderAnalytics, title: 'Strategic Intelligence' },
    '#/users': { render: renderUsers, title: 'Personnel Oversight' },
    '#/internships': { render: renderInternships, title: 'Deployment Assets' },
    '#/logs': { render: renderLogs, title: 'System Terminal' },
    '#/settings': { render: renderSettings, title: 'Core Configuration' },
};

const notify = (event) => {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    const colors = {
        critical: 'bg-danger border-danger/20',
        high: 'bg-accent border-accent/20',
        medium: 'bg-primary border-primary/20',
        low: 'bg-surface border-white/10'
    };

    toast.className = `glass-panel ${colors[event.priority] || colors.low} p-4 w-80 animate-in slide-in-from-right duration-300 flex gap-3 items-start`;
    toast.innerHTML = `
        <div class="size-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-sm text-white">${event.priority === 'critical' ? 'emergency' : 'notifications_active'}</span>
        </div>
        <div>
            <p class="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">${event.type}</p>
            <p class="text-xs font-bold text-white leading-tight">${event.message}</p>
        </div>
    `;

    container.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('animate-out', 'fade-out', 'slide-out-to-right');
        setTimeout(() => toast.remove(), 300);
    }, 5000);
};

let globalWS = null;
const initGlobalWS = () => {
    if (globalWS) globalWS.close();
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.hostname === 'localhost' ? 'localhost:8000' : 'pm-internship-u7yf.onrender.com';
    globalWS = new WebSocket(`${protocol}//${host}/api/admin/ws/logs`);

    globalWS.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.stream === 'events') {
            notify(data);
        }
    };

    globalWS.onclose = () => setTimeout(initGlobalWS, 5000);
};

async function init() {
    if (!auth.isAuthenticated() && !window.location.pathname.includes('login.html')) {
        window.location.href = 'login.html';
        return;
    }

    const appContainer = document.getElementById('app');
    const sidebarContainer = document.getElementById('sidebar-container');
    const headerContainer = document.getElementById('header-container');
    const mainContent = document.getElementById('main-content');

    const handleRouting = async () => {
        const hash = window.location.hash || '#/dashboard';
        const route = routes[hash] || routes['#/dashboard'];

        // Apply page fade out
        mainContent.classList.add('opacity-0');

        setTimeout(async () => {
            // Update containers
            sidebarContainer.innerHTML = renderSidebar(hash);
            headerContainer.innerHTML = renderHeader(route.title);

            // Render Page content
            await route.render(mainContent);

            // Re-setup logout listener since sidebar was re-rendered
            document.getElementById('logout-btn')?.addEventListener('click', () => {
                auth.logout();
            });

            // Fade in
            mainContent.classList.remove('opacity-0');
            mainContent.classList.add('transition-opacity', 'duration-300', 'opacity-100');
        }, 150);
    };

    window.addEventListener('hashchange', handleRouting);
    handleRouting();
    initGlobalWS();


}

document.addEventListener('DOMContentLoaded', init);
