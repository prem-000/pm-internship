import store from '../js/store.js';
import { recommendationsController } from '../js/recommendations.controller.js';
import { toast } from '../components/toast.js';
import { renderSidebar } from '../components/sidebar.js';

export const renderRecommendations = async (container) => {
    // Show loader
    container.innerHTML = `
        <div class="flex items-center justify-center min-h-screen bg-background-light">
            <div class="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    `;

    await recommendationsController.init();
    renderMainLayout(container);
};

function renderMainLayout(container) {
    const { profile, user, recommendations } = store;
    const filters = recommendationsController.state.filters;

    container.innerHTML = `
<div class="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
<!-- SideNavBar -->
${renderSidebar('#/recommendations')}
<!-- Main Content -->
<main class="flex-1 flex flex-col min-w-0 overflow-hidden ml-72">
<!-- Header -->
<header class="h-16 border-b border-primary/10 bg-white dark:bg-background-dark flex items-center justify-between px-8 shrink-0">
<div class="flex items-center gap-6 flex-1">
<h2 class="text-xl font-bold text-primary dark:text-slate-100 whitespace-nowrap">Full Recommendations</h2>

</div>
<div class="flex items-center gap-4">

<div class="flex items-center gap-3 pl-4 border-l border-primary/10">
<div class="text-right hidden sm:block">
<p class="text-xs font-bold text-slate-900 dark:text-slate-100">${profile?.full_name || user?.name || 'User'}</p>
<p class="text-[10px] text-slate-500 font-medium">${profile?.target_roles?.[0] || 'Intern'}</p>
</div>
<div class="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
<span class="material-symbols-outlined text-primary dark:text-primary-100">account_circle</span>
</div>
</div>
</div>
</header>
<!-- Filters Bar -->
<div class="bg-white dark:bg-background-dark border-b border-primary/10 px-8 py-4 shrink-0">
<div class="flex flex-wrap items-center gap-6">
<!-- Dropdown: Location -->
<div class="flex flex-col gap-1">
    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Location</span>
    <div class="relative">
        <select id="locationFilter" class="appearance-none flex items-center justify-between min-w-[140px] px-3 py-2 bg-primary/5 dark:bg-primary/10 rounded-lg text-sm font-medium border-none focus:ring-0 cursor-pointer">
            <option value="remote" ${filters.location === 'remote' ? 'selected' : ''}>Remote</option>
            <option value="onsite" ${filters.location === 'onsite' ? 'selected' : ''}>On-site</option>
            <option value="hybrid" ${filters.location === 'hybrid' ? 'selected' : ''}>Hybrid</option>
            <option value="all" ${filters.location === 'all' ? 'selected' : ''}>All Locations</option>
        </select>
        <span class="material-symbols-outlined text-sm absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">expand_more</span>
    </div>
</div>
<!-- Slider: Match Score -->
<div class="flex flex-col gap-1 flex-1 max-w-xs">
<div class="flex justify-between px-1">
<span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Match Score Range</span>
<span class="text-[10px] font-bold text-primary uppercase tracking-widest" id="scoreValueDisplay">${filters.min_score}% - 100%</span>
</div>
<div class="relative h-2 bg-primary/10 rounded-full mt-3 flex items-center">
    <input type="range" id="scoreSlider" min="0" max="100" value="${filters.min_score}" class="absolute w-full h-2 bg-transparent appearance-none cursor-pointer z-10 accent-primary">
    <div id="scoreBar" class="absolute left-0 h-full bg-primary rounded-full" style="width: ${filters.min_score}%; left: 0;"></div>
</div>
</div>

</div>
</div>
<!-- Main Scrollable Grid -->
<div class="flex-1 overflow-y-auto p-8" id="recommendationsGrid">
    ${renderGrid(recommendations)}
</div>
</main>
</div>
    `;

    setupEventListeners(container);
    triggerAnimations(container);
}

function renderGrid(recommendations) {
    if (!recommendations || recommendations.length === 0) {
        return `
            <div class="flex flex-col items-center justify-center py-20 opacity-0 entrance-animation">
                <span class="material-symbols-outlined text-6xl text-slate-200 mb-4">search_off</span>
                <p class="text-slate-500 font-medium">No recommendations found. Try adjusting your filters.</p>
            </div>
        `;
    }

    return `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            ${recommendations.map((rec, i) => renderCard(rec, i)).join('')}
        </div>
    `;
}

function renderCard(rec, index) {
    const score = Math.round(rec.score || rec.overall_score || 0);
    const skillMatch = Math.round(rec.score_breakdown?.skill_match || rec.match_details?.skill_match_percentage || 0);
    const semanticFit = Math.round(rec.score_breakdown?.semantic_similarity || 0);
    const behaviorBoost = Math.round(rec.score_breakdown?.feedback_boost || 0);

    const colorClass = score >= 85 ? 'border-emerald-500 text-emerald-600' : score >= 70 ? 'border-blue-500 text-blue-600' : score >= 50 ? 'border-amber-500 text-amber-600' : 'border-rose-500 text-rose-600';

    return `
<div class="bg-white dark:bg-background-dark border border-primary/10 rounded-xl p-6 flex flex-col gap-5 hover:shadow-xl transition-all duration-300 group opacity-0 translate-y-8 recommendation-card" style="transition-delay: ${index * 50}ms">
<div class="flex justify-between items-start">
<div class="flex gap-4">
<div class="w-12 h-12 bg-primary/5 rounded-lg flex items-center justify-center overflow-hidden border border-primary/5">
    <span class="material-symbols-outlined text-primary/40 text-3xl">business</span>
</div>
<div>
<h3 class="font-bold text-slate-900 dark:text-slate-100 leading-tight">${rec.title}</h3>
<p class="text-sm text-slate-500">${rec.organization || rec.company || 'Unknown'} • ${rec.location}</p>
</div>
</div>
<div class="flex flex-col items-center">
<div class="w-12 h-12 rounded-full border-4 ${colorClass.split(' ')[0]} flex items-center justify-center ${colorClass.split(' ')[1]} font-bold text-sm">
                                    ${score}
                                </div>
<span class="text-[10px] font-bold text-slate-400 mt-1">MATCH</span>
</div>
</div>
<div class="grid grid-cols-3 gap-2 py-3 border-y border-primary/5">
<div class="flex flex-col items-center text-center">
<p class="text-xs font-bold text-slate-900 dark:text-slate-100">${skillMatch}%</p>
<p class="text-[10px] text-slate-500">Skill Match</p>
</div>
<div class="flex flex-col items-center text-center border-x border-primary/5">
<p class="text-xs font-bold text-slate-900 dark:text-slate-100">${semanticFit}%</p>
<p class="text-[10px] text-slate-500">Semantic Fit</p>
</div>
<div class="flex flex-col items-center text-center">
<p class="text-xs font-bold ${behaviorBoost >= 0 ? 'text-emerald-500' : 'text-rose-500'}">${behaviorBoost >= 0 ? '+' : ''}${behaviorBoost}%</p>
<p class="text-[10px] text-slate-500">Behavior</p>
</div>
</div>
<div class="flex flex-col gap-3">
<button data-action="applied" data-id="${rec.internship_id}" data-url="${rec.apply_url}" class="action-btn w-full py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 transition-colors">Apply Now</button>
<div class="grid grid-cols-2 gap-3">
<a href="#/roadmap/${rec.internship_id}" class="py-2.5 bg-primary/5 dark:bg-primary/20 text-primary dark:text-slate-200 text-xs font-bold rounded-lg hover:bg-primary/10 transition-colors flex items-center justify-center gap-2">
<span class="material-symbols-outlined text-sm">route</span> Roadmap
                                </a>
<button data-action="saved" data-id="${rec.internship_id}" class="action-btn py-2.5 border border-primary/10 text-slate-600 dark:text-slate-400 text-xs font-bold rounded-lg hover:bg-primary/5 transition-colors flex items-center justify-center gap-2">
<span class="material-symbols-outlined text-sm">bookmark</span> Save
                                </button>
</div>
</div>
</div>
    `;
}

function setupEventListeners(container) {
    const locationFilter = container.querySelector('#locationFilter');
    const scoreSlider = container.querySelector('#scoreSlider');
    const scoreValueDisplay = container.querySelector('#scoreValueDisplay');
    const grid = container.querySelector('#recommendationsGrid');
    const logoutBtn = container.querySelector('#logoutBtn');

    let debounceTimer;

    locationFilter.onchange = (e) => {
        recommendationsController.updateFilters({ location: e.target.value });
        refreshGrid(grid);
    };

    scoreSlider.oninput = (e) => {
        const val = e.target.value;
        scoreValueDisplay.innerText = `${val}% - 100%`;

        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            recommendationsController.updateFilters({ min_score: parseInt(val) });
            refreshGrid(grid);
        }, 300);
    };

    logoutBtn.onclick = () => {
        store.clearToken();
        window.location.hash = '#/login';
    };

    // Card Actions
    grid.addEventListener('click', async (e) => {
        const btn = e.target.closest('.action-btn');
        if (!btn) return;

        const id = btn.dataset.id;
        const action = btn.dataset.action;
        const url = btn.dataset.url;

        if (btn.disabled) return;
        btn.disabled = true;
        const originalHtml = btn.innerHTML;
        btn.innerHTML = `<span class="size-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>`;

        const success = await recommendationsController.handleAction(id, action);
        if (success) {
            toast.success(`Action '${action}' successful`);
            if (action === 'applied') {
                btn.innerHTML = 'Applied ✓';
                btn.classList.replace('bg-primary', 'bg-slate-800');
                if (url && url !== '#') setTimeout(() => window.open(url, '_blank'), 500);
            } else {
                btn.innerHTML = originalHtml;
                btn.disabled = false;
            }
            // Trigger refresh
            refreshGrid(grid);
        } else {
            btn.innerHTML = originalHtml;
            btn.disabled = false;
            toast.error("Action failed");
        }
    });
}

function refreshGrid(grid) {
    // Basic fade out/in effect
    grid.style.opacity = '0.5';
    setTimeout(() => {
        grid.innerHTML = renderGrid(store.recommendations);
        grid.style.opacity = '1';
        triggerAnimations(grid);
    }, 200);
}

function triggerAnimations(container) {
    container.querySelectorAll('.recommendation-card').forEach((card, i) => {
        setTimeout(() => {
            card.classList.remove('opacity-0', 'translate-y-8');
        }, i * 50);
    });
}
