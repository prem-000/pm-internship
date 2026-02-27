import { api } from '../js/api.js';

export const renderDashboard = async (container) => {
    container.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            ${Array(4).fill(0).map(() => `<div class="glass-panel p-6 h-32 skeleton"></div>`).join('')}
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2 glass-panel p-8 h-96 skeleton"></div>
            <div class="glass-panel p-8 h-96 skeleton"></div>
        </div>
    `;

    try {
        const stats = await api.get('/admin/stats');
        const activity = await api.get('/admin/activity?limit=10');

        container.innerHTML = `
            <!-- System Pulse Header -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                ${renderKPIMetric('Live Traffic', '42 req/s', 'speed', 'accent')}
                ${renderKPIMetric('Global Users', stats.total_users, 'public', 'primary')}
                ${renderKPIMetric('API Latency', '124ms', 'bolt', 'warning')}
                ${renderKPIMetric('Model Status', 'Nominal', 'verified', 'success')}
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <!-- Real-time Activity Hub -->
                <div class="lg:col-span-2 glass-panel flex flex-col">
                    <div class="p-6 border-b border-border-color flex items-center justify-between">
                        <div>
                            <h3 class="text-sm font-black text-text-main uppercase tracking-widest">Global Activity Hub</h3>
                            <p class="text-[9px] text-text-muted font-bold uppercase tracking-tighter">Real-time event synchronization</p>
                        </div>
                        <span class="text-[9px] bg-success/10 text-success border border-success/20 px-2.5 py-1 rounded-full font-black uppercase tracking-widest animate-pulse">Live Tracking</span>
                    </div>
                    <div class="p-6 space-y-4 overflow-y-auto max-h-[400px]">
                        ${renderActivityLog(activity)}
                    </div>
                </div>

                <!-- Circular Risk Gauge -->
                <div class="glass-panel p-8 flex flex-col items-center justify-center text-center">
                    <h3 class="text-sm font-black text-text-main uppercase tracking-widest mb-8">System Risk Index</h3>
                    <div class="relative size-48 flex items-center justify-center">
                        <svg class="size-full transform -rotate-90">
                            <circle cx="96" cy="96" r="80" stroke="#F1F5F9" stroke-width="12" fill="transparent" />
                            <circle cx="96" cy="96" r="80" stroke="#F97316" stroke-width="12" stroke-linecap="round" fill="transparent"
                                stroke-dasharray="502.6" stroke-dashoffset="377" class="transition-all duration-1000" />
                        </svg>
                        <div class="absolute inset-0 flex flex-col items-center justify-center">
                            <span class="text-4xl font-black text-text-main">25%</span>
                            <span class="text-[9px] font-black text-accent uppercase tracking-[0.2em] mt-2">Low Risk</span>
                        </div>
                    </div>
                    <p class="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-8">All systems within operational safety margins.</p>
                </div>
            </div>

            <div class="glass-panel p-8">
                <div class="flex items-center justify-between mb-8">
                    <h3 class="text-sm font-black text-text-main uppercase tracking-widest">Quick Operations</h3>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    ${renderOpButton('trigger', 'Retrain Model', 'Force re-learning on latest dataset', 'primary')}
                    ${renderOpButton('bolt', 'Traffic Simulation', 'Test system elasticity under load', 'accent')}
                    ${renderOpButton('refresh', 'Clear Cache', 'Purge distributed inference cache', 'warning')}
                </div>
            </div>
        `;

    } catch (error) {
        container.innerHTML = `<div class="glass-panel p-20 text-center font-bold text-danger uppercase tracking-widest">Dashboard Failure: ${error.message}</div>`;
    }
};

function renderKPIMetric(title, value, icon, color) {
    const colorMap = {
        primary: 'text-primary bg-primary/10 border-primary/20',
        accent: 'text-accent bg-accent/10 border-accent/20',
        warning: 'text-warning bg-warning/10 border-warning/20',
        success: 'text-success bg-success/10 border-success/20'
    };

    return `
        <div class="glass-panel p-6 border-l-4 ${color === 'primary' ? 'border-primary' : color === 'accent' ? 'border-accent' : color === 'warning' ? 'border-warning' : 'border-success'}">
            <div class="flex items-center gap-4">
                <div class="size-10 rounded-xl flex items-center justify-center shrink-0 ${colorMap[color]}">
                    <span class="material-symbols-outlined">${icon}</span>
                </div>
                <div>
                    <p class="text-[9px] text-text-muted font-black uppercase tracking-widest truncate">${title}</p>
                    <h4 class="text-xl font-black text-text-main">${value}</h4>
                </div>
            </div>
        </div>
    `;
}

function renderActivityLog(activities) {
    return activities.map(act => `
        <div class="flex gap-4 group">
            <div class="flex flex-col items-center">
                <div class="size-2 rounded-full mt-2 ${act.type === 'critical' ? 'bg-danger' : act.type === 'warning' ? 'bg-warning' : 'bg-primary'}"></div>
                <div class="w-px flex-1 bg-border-color my-2"></div>
            </div>
            <div class="pb-4">
                <p class="text-xs font-bold text-text-main tracking-wide">${act.message}</p>
                <div class="flex items-center gap-3 mt-1 opactiy-50">
                    <span class="text-[9px] text-text-muted font-black uppercase tracking-tighter">${act.user || 'System'}</span>
                    <span class="text-[9px] text-text-muted">•</span>
                    <span class="text-[9px] text-text-muted font-medium">${new Date(act.timestamp).toLocaleTimeString()}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function renderOpButton(icon, title, desc, color) {
    const borderColor = color === 'primary' ? 'hover:border-primary/40' : color === 'accent' ? 'hover:border-accent/40' : 'hover:border-warning/40';
    const bgColor = color === 'primary' ? 'hover:bg-primary/5' : color === 'accent' ? 'hover:bg-accent/5' : 'hover:bg-warning/5';
    const iconColor = color === 'primary' ? 'text-primary bg-primary/10' : color === 'accent' ? 'text-accent bg-accent/10' : 'text-warning bg-warning/10';

    return `
        <button class="flex items-start gap-4 p-5 rounded-2xl bg-bg-light border border-transparent ${borderColor} ${bgColor} transition-all text-left group">
            <div class="size-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${iconColor}">
                <span class="material-symbols-outlined">${icon}</span>
            </div>
            <div>
                <p class="text-xs font-black text-text-main mb-1 uppercase tracking-tight">${title}</p>
                <p class="text-[10px] text-text-muted font-medium leading-tight">${desc}</p>
            </div>
        </button>
    `;
}
