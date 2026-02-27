import { api } from '../js/api.js';

export const renderAnalytics = async (container) => {
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
        const metrics = await api.get('/admin/model-metrics');
        const health = await api.get('/admin/health');
        const trend = await api.get('/admin/internships/trend');

        container.innerHTML = `
            <!-- KPI Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                ${renderKPICard('Total Participants', stats.total_users, 'group', 'primary')}
                ${renderKPICard('Active Placements', stats.active_internships, 'business_center', 'indigo')}
                ${renderKPICard('Model Precision', (metrics.precision * 100).toFixed(1) + '%', 'psychology', 'accent')}
                ${renderKPICard('System Uptime', '99.9%', 'sensors', 'success')}
            </div>

            <!-- Main Charts Section -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <div class="lg:col-span-2 glass-panel p-8">
                    <div class="flex items-center justify-between mb-8">
                        <div>
                            <h3 class="text-lg font-black text-text-main uppercase tracking-tight">INTERNSHIP TRAJECTORY</h3>
                            <p class="text-[10px] text-text-muted font-bold uppercase tracking-widest">30-Day Deployment Volume</p>
                        </div>
                    </div>
                    <div class="h-64 relative">
                        <canvas id="internshipTrendChart"></canvas>
                    </div>
                </div>

                <div class="glass-panel p-8">
                    <h3 class="text-lg font-black text-text-main mb-6 uppercase tracking-tight">SKILL GAP ANALYSIS</h3>
                    <div id="skill-gap-heatmap" class="space-y-4">
                        <!-- Heatmap content -->
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div class="glass-panel p-8">
                    <h3 class="text-lg font-black text-text-main mb-6 uppercase tracking-tight">MODEL PERFORMANCE</h3>
                    <div class="grid grid-cols-2 gap-6" id="performance-radials">
                        <!-- Radials -->
                    </div>
                </div>
                <div class="glass-panel p-8">
                    <h3 class="text-lg font-black text-text-main mb-6 uppercase tracking-tight">INFRASTRUCTURE HEALTH</h3>
                    <div class="space-y-6">
                        ${renderHealthMetric('Backend Services', health.backend, 95)}
                        ${renderHealthMetric('ML Inference Node', health.ml_model, 88)}
                        ${renderHealthMetric('Distributed DB', 'Stable', 100)}
                    </div>
                </div>
            </div>
        `;

        initTrendChart(trend);
        renderHeatmap();
        renderPerformanceMetrics(metrics);
        animateKPIs();

    } catch (error) {
        container.innerHTML = `<div class="glass-panel p-20 text-center text-danger font-bold">CRITICAL SYSTEM ERROR: ${error.message}</div>`;
    }
};

function renderKPICard(title, value, icon, color) {
    const colorClasses = {
        primary: 'text-primary bg-primary/10 border-primary/20',
        accent: 'text-accent bg-accent/10 border-accent/20',
        success: 'text-success bg-success/10 border-success/20',
        indigo: 'text-indigo-600 bg-indigo-50 border-indigo-100'
    };

    return `
        <div class="glass-panel p-6">
            <div class="flex items-center justify-between mb-4">
                <div class="size-10 rounded-xl flex items-center justify-center shrink-0 ${colorClasses[color] || colorClasses.primary}">
                    <span class="material-symbols-outlined">${icon}</span>
                </div>
                <div class="flex items-center gap-1 text-success text-[10px] font-bold">
                    <span class="material-symbols-outlined text-sm">trending_up</span>
                    +12%
                </div>
            </div>
            <p class="text-[10px] text-text-muted font-black uppercase tracking-widest mb-1">${title}</p>
            <h4 class="text-2xl font-black text-text-main kpi-value" data-value="${parseInt(value) || value}">${value}</h4>
        </div>
    `;
}

function renderHealthMetric(label, status, value) {
    return `
        <div>
            <div class="flex justify-between items-center mb-2">
                <span class="text-xs font-bold text-text-main">${label}</span>
                <span class="text-[10px] font-black text-success uppercase">${status}</span>
            </div>
            <div class="w-full bg-bg-light h-2 rounded-full overflow-hidden">
                <div class="bg-primary h-full transition-all duration-1000" style="width: ${value}%"></div>
            </div>
        </div>
    `;
}

function initTrendChart(data) {
    const ctx = document.getElementById('internshipTrendChart')?.getContext('2d');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Postings',
                data: data.datasets[0].data,
                borderColor: '#F97316',
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                backgroundColor: 'rgba(249, 115, 22, 0.05)',
                pointRadius: 4,
                pointBackgroundColor: '#F97316'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { display: false }, ticks: { color: '#64748B', font: { weight: '600', size: 10 } } },
                y: { grid: { color: '#F1F5F9' }, ticks: { color: '#64748B' } }
            }
        }
    });
}

function renderHeatmap() {
    const container = document.getElementById('skill-gap-heatmap');
    const skills = [
        { name: 'React', gap: 75 },
        { name: 'Python', gap: 40 },
        { name: 'Docker', gap: 90 },
        { name: 'AI/ML', gap: 65 }
    ];

    container.innerHTML = skills.map(skill => `
        <div class="flex items-center gap-4">
            <span class="text-xs font-bold text-text-muted w-24">${skill.name}</span>
            <div class="flex-1 flex gap-1.5">
                ${Array(10).fill(0).map((_, i) => `
                    <div class="h-5 flex-1 rounded-sm ${i < skill.gap / 10 ? 'bg-accent' : 'bg-bg-light'}" 
                         style="opacity: ${0.2 + (i / 10)}"></div>
                `).join('')}
            </div>
            <span class="text-[10px] font-black text-accent w-8 text-right">${skill.gap}%</span>
        </div>
    `).join('');
}

function renderPerformanceMetrics(metrics) {
    const container = document.getElementById('performance-radials');
    const items = [
        { label: 'Precision', val: 92, color: '#1E3A8A' },
        { label: 'Recall', val: 88, color: '#F97316' },
        { label: 'F1 Score', val: 90, color: '#10B981' },
        { label: 'ROC AUC', val: 94, color: '#F59E0B' }
    ];

    container.innerHTML = items.map(item => `
        <div class="text-center group">
            <div class="relative size-24 mx-auto mb-4 flex items-center justify-center transition-transform group-hover:scale-105">
                <svg class="size-full transform -rotate-90">
                    <circle cx="48" cy="48" r="42" stroke="#F1F5F9" stroke-width="6" fill="transparent" />
                    <circle cx="48" cy="48" r="42" stroke="${item.color}" stroke-width="6" fill="transparent"
                        stroke-dasharray="263.9" stroke-dashoffset="${263.9 * (1 - item.val / 100)}" stroke-linecap="round" />
                </svg>
                <span class="absolute text-sm font-black text-text-main">${item.val}%</span>
            </div>
            <p class="text-[10px] text-text-muted font-bold uppercase tracking-widest">${item.label}</p>
        </div>
    `).join('');
}

function animateKPIs() {
    document.querySelectorAll('.kpi-value').forEach(el => {
        const targetStr = el.dataset.value;
        const target = parseInt(targetStr);
        if (isNaN(target)) return;

        let start = 0;
        const duration = 1500;
        const step = (timestamp) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            // Ease out cubic
            const ease = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(ease * target).toLocaleString() + (targetStr.includes('%') ? '%' : '');
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    });
}
