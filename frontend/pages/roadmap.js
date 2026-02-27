import { roadmapController } from '../js/roadmap.controller.js';
import store from '../js/store.js';
import { renderSidebar } from '../components/sidebar.js';
import { renderTopBar } from '../components/mobileNav.js';

export const renderRoadmap = async (container, params) => {
    const id = params.id;

    // If no ID, show selection screen
    if (!id) {
        await renderSelectionScreen(container);
        return;
    }

    container.innerHTML = `
        <div class="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark">
            <div class="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    `;

    await roadmapController.init(id);
    renderMainLayout(container);
};

async function renderSelectionScreen(container) {
    // Ensure we have recommendations to pick from
    if (!store.recommendations || store.recommendations.length === 0) {
        // Try fetching them silently
        try {
            const { recommendationService } = await import('../js/recommendation.service.js');
            await recommendationService.fetchRecommendations();
        } catch (e) { }
    }

    const recs = store.recommendations || [];

    container.innerHTML = `
        <div class="flex flex-col lg:flex-row min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 overflow-x-hidden">
            <!-- Mobile Top Bar -->
            ${renderTopBar('ROADMAPS')}

            <!-- Sidebar -->
            ${renderSidebar('#/roadmap')}

            <main class="flex-1 lg:ml-72 ml-0 p-6 md:p-12 overflow-y-auto pb-24 lg:pb-12">
                <header class="mb-12">
                    <h2 class="text-3xl font-black text-slate-900 dark:text-white mb-2">My Roadmaps</h2>
                    <p class="text-slate-500">Select an internship to view your personalized skill gap analysis and AI-generated roadmap.</p>
                </header>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    ${recs.length > 0 ? recs.map(rec => `
                        <a href="#/roadmap/${rec.internship_id}" class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-primary hover:shadow-xl transition-all group">
                            <div class="flex items-center justify-between mb-4">
                                <div class="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center text-primary">
                                    <span class="material-symbols-outlined">business</span>
                                </div>
                                <span class="text-xs font-bold text-slate-400 group-hover:text-primary transition-colors">View Analysis →</span>
                            </div>
                            <h3 class="font-bold text-slate-900 dark:text-white leading-tight mb-1">${rec.title}</h3>
                            <p class="text-sm text-slate-500 mb-4">${rec.company || rec.organization}</p>
                            <div class="flex items-center gap-2">
                                <div class="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div class="h-full bg-primary" style="width: ${rec.score || rec.overall_score}%"></div>
                                </div>
                                <span class="text-[10px] font-bold text-slate-400">${Math.round(rec.score || rec.overall_score)}% Match</span>
                            </div>
                        </a>
                    `).join('') : `
                        <div class="col-span-full py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center">
                            <span class="material-symbols-outlined text-6xl text-slate-300 mb-4">map</span>
                            <p class="text-slate-500 font-medium mb-4">No active recommendations to generate roadmaps from.</p>
                            <a href="#/recommendations" class="bg-primary text-white px-8 py-3 rounded-xl font-bold text-sm shadow-xl shadow-primary/20 hover:bg-slate-900 transition-all">Explore Recommendations</a>
                        </div>
                    `}
                </div>
            </main>
        </div>
    `;
}

function renderMainLayout(container) {
    if (roadmapController.state.error) {
        container.innerHTML = `
            <div class="flex flex-col items-center justify-center min-h-screen bg-background-light p-8">
                <span class="material-symbols-outlined text-6xl text-rose-500 mb-4">error</span>
                <p class="text-slate-900 font-bold text-xl mb-2">${roadmapController.state.error}</p>
                <button onclick="window.location.hash = '#/recommendations'" class="bg-primary text-white px-6 py-2 rounded-lg font-bold shadow-lg">Back to Recommendations</button>
            </div>
        `;
        return;
    }

    const { data } = roadmapController.state;
    const scores = roadmapController.getCurrentScores();
    const { internship, gap_analysis, gemini_roadmap } = data;

    container.innerHTML = `
<div class="flex flex-col lg:flex-row min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 overflow-x-hidden">
<!-- Mobile Top Bar -->
${renderTopBar('ROADMAP')}

<!-- Sidebar -->
${renderSidebar('#/roadmap')}

<!-- Main Content -->
<main class="flex-1 flex flex-col overflow-hidden lg:ml-72 ml-0 pb-24 lg:pb-0">
<!-- Header -->
<header class="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark flex items-center justify-between px-8">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-primary/60">folder_open</span>
<span class="text-slate-400 text-sm">/</span>
<h2 class="text-slate-900 dark:text-slate-100 font-bold text-sm tracking-tight">Roadmap / Gap Analysis</h2>
</div>
<div class="flex items-center gap-4">
    <p class="text-xs font-bold text-slate-400">${internship.title} • ${internship.company}</p>
</div>
</header>
<div class="flex-1 overflow-y-auto p-8 space-y-8">
<!-- Top Section: Scores -->
<div class="grid grid-cols-12 gap-6">
<!-- Main Circular Score -->
<div class="col-span-12 lg:col-span-4 bg-white dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center">
<h3 class="text-slate-500 text-xs font-bold uppercase tracking-widest mb-6">Overall Match Score</h3>
<div id="overallCircle" class="relative w-40 h-40 flex items-center justify-center rounded-full transition-all duration-700" style="background: conic-gradient(#1e1b4b 0%, #e2e8f0 0% 100%)">
<div class="absolute inset-2 bg-white dark:bg-slate-900 rounded-full flex flex-col items-center justify-center">
<span id="overallNumber" class="text-4xl font-black text-primary">0%</span>
<span id="overallLabel" class="text-[10px] text-slate-400 font-bold uppercase">${scores.isProjected ? 'Projected Fit' : 'Current Fit'}</span>
</div>
</div>
</div>
<!-- Small Score Cards -->
<div class="col-span-12 lg:col-span-8 grid grid-cols-3 gap-6">
<div class="bg-white dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
<span class="material-symbols-outlined text-primary mb-2">stars</span>
<div>
<p class="text-slate-500 text-sm font-medium">Skill Match</p>
<p id="skillMatchNumber" class="text-3xl font-bold text-slate-900 dark:text-slate-100">${scores.skill_match}%</p>
</div>
</div>
<div class="bg-white dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
<span class="material-symbols-outlined text-primary mb-2">hub</span>
<div>
<p class="text-slate-500 text-sm font-medium">Semantic Fit</p>
<p class="text-3xl font-bold text-slate-900 dark:text-slate-100">${scores.semantic}%</p>
</div>
</div>
<div class="bg-primary text-white p-6 rounded-xl border border-primary flex flex-col justify-between">
<span class="material-symbols-outlined text-indigo-300 mb-2">rocket_launch</span>
<div>
<p class="text-indigo-200 text-sm font-medium">Behavioral Boost</p>
<p class="text-3xl font-bold">+${scores.behavior}%</p>
</div>
</div>
</div>
</div>

<!-- Middle Section: Main Analysis & Roadmap -->
<div class="grid grid-cols-12 gap-8">
<!-- Skill Gap List -->
<div class="col-span-12 xl:col-span-8 space-y-6">
<div class="flex items-center justify-between">
<h2 class="text-xl font-bold text-slate-900 dark:text-slate-100">Skill Gap Impact</h2>
<div class="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full">
<span class="text-xs font-bold text-slate-600 dark:text-slate-400">Simulate Learning</span>
<button id="simulateToggle" class="w-10 h-5 bg-slate-400 rounded-full relative flex items-center px-1 transition-colors">
<div class="w-3.5 h-3.5 bg-white rounded-full transition-transform ${roadmapController.state.simulationEnabled ? 'translate-x-4' : ''}"></div>
</button>
</div>
</div>
<div class="space-y-4">
${gap_analysis.missing_skills.map((skill, i) => `
<div class="bg-white dark:bg-slate-900/50 p-5 rounded-xl border border-slate-200 dark:border-slate-800 opacity-0 translate-y-4 skill-card" style="transition-delay: ${i * 100}ms">
<div class="flex items-center justify-between mb-3">
<div class="flex items-center gap-3">
<div class="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
<span class="material-symbols-outlined text-slate-600 dark:text-slate-400">memory</span>
</div>
<div>
<h4 class="font-bold text-slate-900 dark:text-slate-100">${skill.name}</h4>
<p class="text-xs text-slate-500 italic">Impact on Overall Match</p>
</div>
</div>
<div class="text-right">
<span class="text-xs font-bold text-primary">+${skill.impact_score}% Impact</span>
</div>
</div>
<div class="relative h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
<div class="absolute left-0 top-0 h-full bg-slate-400 dark:bg-slate-600 rounded-full transition-all duration-1000" style="width: 0%" data-width="${skill.current_progress_percent}%"></div>
<div class="absolute left-0 top-0 h-full bg-primary opacity-30 rounded-full transition-all duration-1000 delay-300" style="width: 0%" data-width="${skill.target_progress_percent}%"></div>
</div>
<div class="flex justify-between mt-2">
<span class="text-[10px] font-medium text-slate-400">Current proficiency</span>
<span class="text-[10px] font-bold text-primary">Target proficiency</span>
</div>
</div>
`).join('')}
</div>
</div>

<!-- Right Sidebar: AI Advisory Roadmap -->
<div class="col-span-12 xl:col-span-4">
<div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden sticky top-8 animate-in fade-in slide-in-from-right duration-700">
<div class="bg-primary p-6 text-white">
<div class="flex items-center gap-2 mb-1">
<span class="material-symbols-outlined text-indigo-300">smart_toy</span>
<h3 class="text-sm font-bold uppercase tracking-wider">AI Advisory Roadmap</h3>
</div>
<p class="text-xs text-indigo-200">Generated by Gemini Engine</p>
</div>
<div class="p-6">
<div class="relative border-l-2 border-slate-100 dark:border-slate-800 ml-3 space-y-8">
${gemini_roadmap.phases.map((phase, i) => `
<div class="relative pl-8 roadmap-step opacity-0">
<div class="absolute -left-[11px] top-0 w-5 h-5 bg-white dark:bg-slate-900 rounded-full border-2 ${i === 0 ? 'border-primary' : 'border-slate-200 dark:border-slate-700'} flex items-center justify-center">
${i === 0 ? '<div class="w-2 h-2 bg-primary rounded-full"></div>' : ''}
</div>
<div>
<span class="text-[10px] font-bold uppercase ${i === 0 ? 'text-primary' : 'text-slate-400'}">${phase.duration}: ${phase.title}</span>
<ul class="mt-2 space-y-1">
${phase.items.map(item => `
<li class="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
<span class="text-primary mt-0.5">•</span> ${item}
</li>
`).join('')}
</ul>
</div>
</div>
`).join('')}
</div>
<div class="mt-8 p-4 bg-primary/5 dark:bg-primary/20 rounded-lg border border-primary/10">
<div class="flex items-center gap-2 mb-2">
<span class="material-symbols-outlined text-primary text-sm">lightbulb</span>
<h6 class="text-xs font-bold text-primary uppercase tracking-tighter">Strategy Highlight</h6>
</div>
<p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
    "${gemini_roadmap.strategy_highlight}"
</p>
</div>
</div>
</div>
</div>
</div>
</div>
</main>
</div>
    `;

    setupEventListeners(container);
    triggerAnimations(container);
}

function setupEventListeners(container) {
    const simulateToggle = container.querySelector('#simulateToggle');
    const logoutBtn = container.querySelector('#logoutBtn');

    if (simulateToggle) {
        simulateToggle.onclick = () => {
            roadmapController.toggleSimulation();
            updateScoresUI(container);

            // Toggle visual state
            const circle = simulateToggle.querySelector('div');
            if (roadmapController.state.simulationEnabled) {
                simulateToggle.classList.replace('bg-slate-400', 'bg-primary');
                circle.classList.add('translate-x-4');
            } else {
                simulateToggle.classList.replace('bg-primary', 'bg-slate-400');
                circle.classList.remove('translate-x-4');
            }
        };
    }

    if (logoutBtn) {
        logoutBtn.onclick = () => {
            store.clearToken();
            window.location.hash = '#/login';
        };
    }
}

function updateScoresUI(container) {
    const scores = roadmapController.getCurrentScores();
    const overallCircle = container.querySelector('#overallCircle');
    const overallNumber = container.querySelector('#overallNumber');
    const overallLabel = container.querySelector('#overallLabel');
    const skillMatchNumber = container.querySelector('#skillMatchNumber');

    // Update Circle with animation
    animateCounter(overallNumber, scores.overall);
    overallCircle.style.background = `conic-gradient(#1e1b4b ${scores.overall}%, #e2e8f0 ${scores.overall}% 100%)`;

    // Update Label
    overallLabel.innerText = scores.isProjected ? 'Projected Fit' : 'Current Fit';
    overallLabel.classList.toggle('text-primary', scores.isProjected);

    // Update Skill Match
    skillMatchNumber.innerText = `${scores.skill_match}%`;
    if (scores.isProjected) {
        skillMatchNumber.classList.add('text-primary', 'animate-pulse');
    } else {
        skillMatchNumber.classList.remove('text-primary', 'animate-pulse');
    }
}

function triggerAnimations(container) {
    const scores = roadmapController.getCurrentScores();

    // 1. Animate scores
    setTimeout(() => {
        updateScoresUI(container);
    }, 100);

    // 2. Animate skill cards
    container.querySelectorAll('.skill-card').forEach((card, i) => {
        setTimeout(() => {
            card.classList.remove('opacity-0', 'translate-y-4');
            // Animate progress bars
            card.querySelectorAll('[data-width]').forEach(bar => {
                bar.style.width = bar.dataset.width;
            });
        }, 300 + (i * 100));
    });

    // 3. Animate roadmap phases
    container.querySelectorAll('.roadmap-step').forEach((step, i) => {
        setTimeout(() => {
            step.classList.remove('opacity-0');
            step.classList.add('animate-in', 'fade-in', 'slide-in-from-left', 'duration-500');
        }, 800 + (i * 200));
    });
}

function animateCounter(element, target) {
    const current = parseInt(element.innerText) || 0;
    const duration = 800;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic

        const value = Math.floor(current + (target - current) * ease);
        element.innerText = `${value}%`;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    requestAnimationFrame(update);
}
