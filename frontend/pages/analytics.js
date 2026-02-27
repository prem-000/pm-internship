import { analyticsController } from '../js/analytics.controller.js';
import store from '../js/store.js';
import { renderSidebar } from '../components/sidebar.js';

export const renderAnalytics = async (container) => {
    // Show Loading
    container.innerHTML = `
        <div class="flex items-center justify-center min-h-screen bg-background-light">
            <div class="flex flex-col items-center gap-4">
                <div class="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p class="text-sm font-bold text-slate-500 animate-pulse">Syncing Engine Analytics...</p>
            </div>
        </div>
    `;

    await analyticsController.init();
    renderMainLayout(container);
};

function renderMainLayout(container) {
    const { trend, growth, sectors, totalMatch, heatmap, timeline } = analyticsController.state;
    const { user, profile } = store;
    const userName = profile?.full_name || user?.name || 'User';

    // 1. Calculate Line Chart Path
    const svgWidth = 800;
    const svgHeight = 200;
    const padding = 30;
    let linePath = "";
    let areaPath = "";
    const points = [];

    if (trend.length > 0) {
        const scores = trend.map(t => t.score);
        const minS = Math.min(...scores);
        const maxS = Math.max(...scores);
        const range = maxS - minS || 10;

        // Add 10% buffer
        const chartMin = Math.max(0, minS - range * 0.2);
        const chartMax = Math.min(100, maxS + range * 0.2);
        const chartRange = chartMax - chartMin || 1;

        trend.forEach((p, i) => {
            const x = (i * (svgWidth / (trend.length - 1 || 1)));
            const normalizedScore = (p.score - chartMin) / chartRange;
            const y = svgHeight - (normalizedScore * (svgHeight - padding * 2) + padding);
            points.push({ x, y });
        });

        linePath = `M ${points[0].x},${points[0].y} ` + points.slice(1).map(p => `L ${p.x},${p.y}`).join(' ');
        areaPath = `${linePath} L ${svgWidth},${svgHeight} L 0,${svgHeight} Z`;
    }

    // 2. Calculate Donut
    // stroke-dasharray="percentage, 100"
    const donutMatch = totalMatch || 82;

    container.innerHTML = `
<div class="flex min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
    <!-- Sidebar Navigation -->
    ${renderSidebar('#/analytics')}

    <!-- Main Content -->
    <main class="flex-1 ml-72 p-8">
        <header class="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
            <div>
                <h2 class="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Analytics Overview</h2>
                <p class="text-slate-500 mt-1">Deep insights into your market positioning and skill acquisition velocity.</p>
            </div>
            <div class="flex gap-2">
            </div>
        </header>

        <div class="grid grid-cols-12 gap-6">
            <!-- 1. Match Score Trend -->
            <div class="col-span-12 lg:col-span-8 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <span class="material-symbols-outlined text-primary">trending_up</span>
                        Match Score Trend
                    </h3>
                    <span class="text-xs font-bold ${growth >= 0 ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'} dark:bg-emerald-950/30 px-2 py-1 rounded">
                        ${growth >= 0 ? '+' : ''}${growth}% vs prev. period
                    </span>
                </div>
                <div class="h-[240px] w-full relative pt-4">
                    <svg class="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 800 200">
                        <defs>
                            <linearGradient id="lineGrad" x1="0%" x2="0%" y1="0%" y2="100%">
                                <stop offset="0%" stop-color="#1e1b4b" stop-opacity="0.25"></stop>
                                <stop offset="100%" stop-color="#1e1b4b" stop-opacity="0"></stop>
                            </linearGradient>
                            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation="3" result="blur" />
                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                            </filter>
                        </defs>
                        <path d="${areaPath}" fill="url(#lineGrad)" class="transition-all duration-1000"></path>
                        <path d="${linePath}" fill="none" stroke="#1e1b4b" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" filter="url(#glow)" class="transition-all duration-1000"></path>
                        ${points.map(p => `
                            <g class="chart-point opacity-0 transition-opacity duration-500" style="transition-delay: 500ms">
                                <circle cx="${p.x}" cy="${p.y}" fill="#1e1b4b" r="6"></circle>
                                <circle cx="${p.x}" cy="${p.y}" fill="white" r="3"></circle>
                            </g>
                        `).join('')}
                    </svg>
                    <div class="flex justify-between mt-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest px-2">
                        ${trend.map(t => `<span>${t.month}</span>`).join('')}
                    </div>
                </div>
            </div>

            <!-- 2. Sector Distribution -->
            <div class="col-span-12 lg:col-span-4 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
                <h3 class="font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
                    <span class="material-symbols-outlined text-primary">pie_chart</span>
                    Sector Distribution
                </h3>
                <div class="flex flex-col items-center justify-center py-4">
                    <div class="relative size-40">
                        <svg class="size-full -rotate-90" viewBox="0 0 36 36">
                            <circle class="stroke-slate-100 dark:stroke-slate-800" cx="18" cy="18" fill="none" r="16" stroke-width="4"></circle>
                            <circle class="stroke-primary" cx="18" cy="18" fill="none" r="16" stroke-dasharray="${donutMatch}, 100" stroke-linecap="round" stroke-width="4"></circle>
                        </svg>
                        <div class="absolute inset-0 flex flex-col items-center justify-center text-center">
                            <span class="text-2xl font-black text-primary dark:text-white">${donutMatch}%</span>
                            <span class="text-[9px] font-bold text-slate-400 uppercase">Match</span>
                        </div>
                    </div>
                    <div class="mt-8 space-y-2 w-full">
                        ${sectors.map((s, i) => `
                        <div class="flex items-center justify-between text-sm">
                            <div class="flex items-center gap-2">
                                <div class="size-2 rounded-full ${['bg-primary', 'bg-slate-400', 'bg-slate-200'][i % 3]}"></div>
                                <span class="text-slate-600 dark:text-slate-400">${s.name}</span>
                            </div>
                            <span class="font-bold">${s.percentage}%</span>
                        </div>
                        `).join('')}
                    </div>
                </div>
            </div>

            <!-- 3. Behavioral Heatmap -->
            <div class="col-span-12 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <span class="material-symbols-outlined text-primary">bar_chart</span>
                        Behavioral Heatmap
                    </h3>
                    <div class="flex gap-4 text-xs font-bold">
                        <div class="flex items-center gap-1"><div class="size-2 rounded-full bg-primary"></div>Applied</div>
                        <div class="flex items-center gap-1"><div class="size-2 rounded-full bg-slate-200 dark:bg-slate-700"></div>Viewed</div>
                    </div>
                </div>
                <div class="space-y-6">
                    ${heatmap.map(h => {
        const total = h.applied + h.viewed;
        const appliedP = total > 0 ? (h.applied / total) * 100 : 0;
        return `
                        <div class="space-y-2">
                            <div class="flex justify-between text-xs font-bold text-slate-500 uppercase">
                                <span>${h.sector}</span>
                                <span>${h.applied} applied / ${h.viewed} viewed</span>
                            </div>
                            <div class="flex h-6 gap-1">
                                <div class="bg-primary rounded-l-md h-full transition-all duration-1000" style="width: 0%" data-target-width="${appliedP}%"></div>
                                <div class="bg-slate-200 dark:bg-slate-700 rounded-r-md h-full flex-1 transition-all duration-1000"></div>
                            </div>
                        </div>
                        `;
    }).join('')}
                </div>
            </div>
    </main>
</div>
    `;

    setupEventListeners(container);
    triggerAnimations(container);
}

function setupEventListeners(container) {
    const logoutBtn = container.querySelector('#logoutBtn');
    if (logoutBtn) {
        logoutBtn.onclick = () => {
            store.clearToken();
            window.location.hash = '#/login';
        };
    }
}

function triggerAnimations(container) {
    // Animate points
    setTimeout(() => {
        container.querySelectorAll('.chart-point').forEach((group, i) => {
            setTimeout(() => group.classList.replace('opacity-0', 'opacity-100'), i * 100);
        });
    }, 600);
}
