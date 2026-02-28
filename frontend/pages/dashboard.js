import store from '../js/store.js';
import { dashboardController } from '../js/dashboard.controller.js';
import { renderSidebar } from '../components/sidebar.js';
import { renderTopBar } from '../components/mobileNav.js';

export const renderDashboard = async (container) => {
    // Show initial skeleton or loader
    container.innerHTML = `
        <div class="flex items-center justify-center min-h-screen bg-background-light">
            <div class="flex flex-col items-center gap-6">
                <div class="relative flex items-center justify-center">
                    <div class="size-16 bg-primary rounded-xl flex items-center justify-center shadow-lg transform rotate-45 animate-pulse">
                        <span class="material-symbols-outlined text-white text-3xl -rotate-45">bolt</span>
                    </div>
                </div>

                <div class="text-center">
                    <h3 class="text-primary font-black text-xl tracking-tight uppercase">AIRE Engine</h3>
                    <p class="text-slate-400 text-sm font-medium animate-pulse mt-1">Calibrating recommendation parameters...</p>
                </div>
            </div>
        </div>
    `;

    // Fetch data via controller
    await dashboardController.init();

    // Render Main Layout
    renderMainLayout(container);
};

function renderMainLayout(container) {
    const { user, recommendations, behaviorProfile, profileStrength, semanticAlignment, gapAnalysis } = store;

    // Fallback for user name
    const userName = user?.full_name || user?.name || 'User';
    const lastUpdate = new Date().toLocaleDateString(i18next.language, { month: 'short', day: 'numeric', year: 'numeric' });

    container.innerHTML = `
        <div class="flex flex-col lg:flex-row min-h-screen relative overflow-hidden bg-background-light dark:bg-background-dark">
            <!-- Mobile Top Bar -->
            ${renderTopBar(i18next.t('nav.dashboard'))}

            <!-- Left Sidebar -->
            ${renderSidebar('#/dashboard')}

            <!-- Main Content Area -->
            <main class="flex-1 flex flex-col lg:flex-row gap-6 p-4 md:p-8 overflow-x-hidden lg:ml-72 ml-0 pb-24 lg:pb-8">
                <!-- Center Column -->
                <div class="flex-1 max-w-4xl">
                    <!-- Header Section -->
                    <header class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h2 class="text-3xl font-black tracking-tight text-slate-900" data-i18n="dashboard.welcome_user" data-i18n-options='{"name": "${userName}"}'>
                                ${i18next.t('dashboard.welcome_user', { name: userName })}
                            </h2>
                            <p class="text-slate-500 mt-1 flex items-center gap-2">
                                <span class="material-symbols-outlined text-sm">schedule</span>
                                <span data-i18n="dashboard.last_update" data-i18n-options='{"date": "${lastUpdate}"}'>
                                    ${i18next.t('dashboard.last_update', { date: lastUpdate })}
                                </span>
                            </p>
                        </div>
                        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm min-w-[240px]">
                            <div class="flex justify-between items-center mb-2">
                                <span class="text-sm font-semibold text-slate-700" data-i18n="dashboard.profile_strength">${i18next.t('dashboard.profile_strength')}</span>
                                <span class="text-sm font-bold text-primary">${profileStrength}%</span>
                            </div>
                            <div class="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div class="h-full bg-primary rounded-full transition-all duration-1000" style="width: 0%" data-target-width="${profileStrength}%"></div>
                            </div>
                            <p class="text-[10px] text-slate-400 mt-2 uppercase tracking-wide" data-i18n="dashboard.high_match_potential">${i18next.t('dashboard.high_match_potential')}</p>
                        </div>
                    </header>

                    <!-- Top 5 Recommendations -->
                    <section class="mb-10">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-lg font-bold flex items-center gap-2">
                                <span class="material-symbols-outlined text-primary">star</span>
                                <span data-i18n="dashboard.top_recommendations">${i18next.t('dashboard.top_recommendations')}</span>
                            </h3>
                            <span class="text-xs font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-full" data-i18n="dashboard.ai_ranked">${i18next.t('dashboard.ai_ranked')}</span>
                        </div>
                        <div id="recommendationsList" class="grid grid-cols-1 gap-4">
                            ${renderRecommendations(recommendations.slice(0, 5))}
                        </div>
                    </section>

                    <!-- All Matching Opportunities -->
                    <section>
                        <h3 class="text-lg font-bold mb-4 flex items-center gap-2">
                            <span class="material-symbols-outlined text-slate-400">list_alt</span>
                            <span data-i18n="dashboard.all_opportunities">${i18next.t('dashboard.all_opportunities')}</span>
                        </h3>
                        <div class="space-y-3">
                            ${renderOpportunityList(recommendations.slice(5))}
                        </div>
                    </section>
                </div>

                <!-- Right Column: Insight Panel -->
                <aside class="w-full lg:w-[320px] space-y-6">


                    <!-- Skill Gap Snapshot -->
                    <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                        <h4 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4" data-i18n="dashboard.skill_gap_snapshot">${i18next.t('dashboard.skill_gap_snapshot')}</h4>
                        <div class="space-y-4">
                            ${gapAnalysis?.missing_skills?.length > 0
            ? renderSkillGaps(gapAnalysis.missing_skills.map(s => ({ name: s, current: 1, required: 4 })))
            : renderSkillGaps([
                { name: 'React.js', current: 2, required: 4 },
                { name: 'TypeScript', current: 1, required: 4 },
                { name: 'Figma Auto-Layout', current: 3, required: 4 },
                { name: 'A/B Testing', current: 0, required: 4 }
            ])
        }
                        </div>

                        <button class="w-full mt-6 py-2 text-[10px] font-bold text-primary bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors uppercase tracking-wider" data-i18n="dashboard.unlock_roadmap">
                            ${i18next.t('dashboard.unlock_roadmap')}
                        </button>
                    </div>

                    <!-- Semantic Alignment Radar -->
                    <div class="bg-white border border-slate-200 rounded-xl p-6 shadow-sm overflow-hidden relative group hover:border-primary/30 transition-all duration-500">
                        <div class="flex items-center justify-between mb-6">
                            <h4 class="text-xs font-bold text-slate-400 uppercase tracking-widest" data-i18n="dashboard.semantic_alignment">${i18next.t('dashboard.semantic_alignment')}</h4>
                            <div class="bg-primary/10 text-primary text-[10px] font-black px-2 py-0.5 rounded-full border border-primary/20">LIVE_ANALYSIS</div>
                        </div>
                        
                        <div class="relative aspect-square flex items-center justify-center max-w-[200px] mx-auto">
                            <!-- Background Grid -->
                            <div class="absolute inset-0 border border-slate-100 rounded-full"></div>
                            <div class="absolute inset-[15%] border border-slate-100 rounded-full"></div>
                            <div class="absolute inset-[30%] border border-slate-100 rounded-full"></div>
                            <div class="absolute inset-[45%] border border-slate-50 rounded-full"></div>
                            
                            <!-- Cross Axes -->
                            <div class="absolute w-[0.5px] h-full bg-slate-100"></div>
                            <div class="absolute w-full h-[0.5px] bg-slate-100"></div>
                            
                            <!-- Pulsing Waves -->
                            <div class="absolute inset-0 bg-primary/5 rounded-full animate-ping opacity-20" style="animation-duration: 4s"></div>
                            <div class="absolute inset-0 bg-primary/5 rounded-full animate-ping opacity-10" style="animation-duration: 6s; animation-delay: 2s"></div>

                            <!-- REAL Radar Shape (Dynamic based on score) -->
                            <div class="absolute bg-primary/20 border-2 border-primary/40 backdrop-blur-[1px] shadow-sm transition-all duration-1000 ease-out opacity-0" 
                                id="radarShape" 
                                style="width: 0%; height: 0%; border-radius: 43% 57% 53% 47% / 46% 41% 59% 54%; transform: rotate(15deg);">
                                
                                <!-- Core Dot with Glow -->
                                <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                    <div class="size-3 bg-primary rounded-full shadow-[0_0_15px_rgba(30,27,75,0.5)] flex items-center justify-center relative z-10">
                                        <div class="size-1 bg-white rounded-full animate-pulse"></div>
                                    </div>
                                    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-8 bg-primary/20 rounded-full animate-pulse"></div>
                                </div>
                            </div>

                            <!-- Axis Labels -->
                            <div class="absolute -top-1 left-1/2 -translate-x-1/2 flex flex-col items-center">
                                <span class="text-[8px] font-black text-slate-400 p-1 bg-white/80 rounded uppercase tracking-tighter">Skill Density</span>
                            </div>
                            <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 flex flex-col items-center">
                                <span class="text-[8px] font-black text-slate-400 p-1 bg-white/80 rounded uppercase tracking-tighter">Role Clarity</span>
                            </div>
                            <div class="absolute top-1/2 -right-4 -translate-y-1/2 rotate-90">
                                <span class="text-[8px] font-black text-slate-400 p-1 bg-white/80 rounded uppercase tracking-tighter">Sector Fit</span>
                            </div>
                            <div class="absolute top-1/2 -left-4 -translate-y-1/2 -rotate-90">
                                <span class="text-[8px] font-black text-slate-400 p-1 bg-white/80 rounded uppercase tracking-tighter">Vocabulary</span>
                            </div>
                        </div>

                        <div class="mt-8 pt-6 border-t border-slate-50">
                            <p class="text-[10px] text-center text-slate-400 font-medium leading-relaxed" 
                                data-i18n="dashboard.vocabulary_match" 
                                data-i18n-options='{"percent": "${semanticAlignment}", "role": "${user?.target_role || "Target"}"}'>
                                ${i18next.t('dashboard.vocabulary_match', { percent: semanticAlignment, role: user?.target_role || 'Target' })}
                            </p>
                        </div>
                    </div>
                </aside>
            </main>

            <!-- Bottom Navigation: Mobile Only -->
            <nav class="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center z-50">
                <a class="flex flex-col items-center gap-1 text-primary" href="#/dashboard">
                    <span class="material-symbols-outlined">dashboard</span>
                    <span class="text-[10px] font-bold">Dash</span>
                </a>
                <a class="flex flex-col items-center gap-1 text-slate-400" href="#/recommendations">
                    <span class="material-symbols-outlined">auto_awesome</span>
                    <span class="text-[10px] font-bold">Match</span>
                </a>
                <div class="size-12 -mt-10 bg-primary text-white rounded-full flex items-center justify-center shadow-lg border-4 border-background-light">
                    <span class="material-symbols-outlined">add</span>
                </div>
                <a class="flex flex-col items-center gap-1 text-slate-400" href="#/analytics">
                    <span class="material-symbols-outlined">analytics</span>
                    <span class="text-[10px] font-bold">Insights</span>
                </a>
                <a class="flex flex-col items-center gap-1 text-slate-400" href="#/profile">
                    <span class="material-symbols-outlined">person</span>
                    <span class="text-[10px] font-bold">Profile</span>
                </a>
            </nav>
        </div>
    `;

    // Trigger Animations and Listeners
    setupInteractions(container);
    triggerEntranceAnimations(container);
}

function renderRecommendations(recs) {
    if (recs.length === 0) return '<p class="text-slate-400 italic text-center py-8">No recommendations found yet. Update your profile!</p>';

    return recs.map((rec, index) => {
        const score = Math.min(100, Math.max(0, Math.round(rec.score)));
        const colorClass = score >= 80 ? 'text-emerald-500' : score >= 60 ? 'text-blue-500' : 'text-amber-500';

        const ringColor = score >= 80 ? 'border-emerald-100' : score >= 60 ? 'border-blue-100' : 'border-amber-100';

        // Match details
        const skillMatch = Math.round(rec.score_breakdown?.skill_match || rec.match_details?.skill_match_percentage || 0);
        const semanticFit = Math.round(rec.score_breakdown?.semantic_similarity || 0);
        const behaviorBoost = Math.round(rec.score_breakdown?.feedback_boost || 0);

        return `
            <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-500 transform opacity-0 translate-y-8 recommendation-card" data-index="${index}">
                <div class="flex flex-col lg:flex-row gap-6">
                    <div class="flex-shrink-0 flex flex-col items-center justify-center">
                        <div class="size-20 rounded-2xl bg-primary/5 border-2 ${ringColor} flex flex-col items-center justify-center">
                            <span class="text-2xl font-black text-slate-900 leading-none count-up" data-target="${score}">0</span>
                            <span class="text-[10px] font-bold text-slate-400 uppercase mt-1" data-i18n="dashboard.match_label">${i18next.t('dashboard.match_label')}</span>
                        </div>
                    </div>

                    <div class="flex-1">
                        <div class="flex flex-col md:flex-row justify-between md:items-start gap-2 mb-3">
                            <div>
                                <h4 class="text-xl font-bold text-slate-900 leading-tight">${rec.title}</h4>
                                <p class="text-slate-500 font-medium text-sm">${rec.company} • ${rec.location}</p>
                            </div>
                            <div class="flex gap-1 flex-wrap">
                                <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100">${rec.sector || 'Tech'}</span>
                                <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-600 border border-purple-100">Hybrid</span>
                            </div>
                        </div>
                        <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-5">
                            <div class="bg-slate-50 p-2 rounded-lg">
                                <p class="text-[10px] text-slate-400 font-bold uppercase mb-1" data-i18n="dashboard.skill_match">${i18next.t('dashboard.skill_match')}</p>
                                <p class="text-sm font-bold text-slate-800">${skillMatch}%</p>
                            </div>
                            <div class="bg-slate-50 p-2 rounded-lg">
                                <p class="text-[10px] text-slate-400 font-bold uppercase mb-1" data-i18n="dashboard.semantic_fit">${i18next.t('dashboard.semantic_fit')}</p>
                                <p class="text-sm font-bold text-slate-800">${semanticFit}%</p>
                            </div>
                            <div class="bg-slate-50 p-2 rounded-lg">
                                <p class="text-[10px] text-slate-400 font-bold uppercase mb-1" data-i18n="dashboard.behavioral">${i18next.t('dashboard.behavioral')}</p>
                                <p class="text-sm font-bold ${behaviorBoost >= 0 ? 'text-emerald-600' : 'text-rose-600'}" data-i18n="dashboard.boost" data-i18n-options='{"percent": "${behaviorBoost}"}'>
                                    ${i18next.t('dashboard.boost', { percent: (behaviorBoost >= 0 ? '+' : '') + behaviorBoost })}
                                </p>
                            </div>
                        </div>
                        <div class="flex flex-wrap gap-2">
                            <button data-action="applied" data-id="${rec.internship_id}" data-url="${rec.apply_url}" class="action-btn flex-1 bg-primary text-white text-xs font-bold py-2.5 rounded-lg hover:bg-primary/90 transition-colors" data-i18n="dashboard.apply_now">${i18next.t('dashboard.apply_now')}</button>
                            <button data-id="${rec.internship_id}" class="roadmap-btn flex-1 bg-slate-100 text-slate-700 text-xs font-bold py-2.5 rounded-lg hover:bg-slate-200 transition-colors" data-i18n="dashboard.view_roadmap">${i18next.t('dashboard.view_roadmap')}</button>
                            <button data-action="saved" data-id="${rec.internship_id}" class="action-btn px-3 bg-white border border-slate-200 text-slate-400 rounded-lg hover:text-red-500 hover:border-red-200 transition-colors">
                                <span class="material-symbols-outlined text-base">favorite</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function renderOpportunityList(recs) {
    if (recs.length === 0) return '';
    return recs.map(rec => {
        const score = Math.min(100, Math.max(0, Math.round(rec.score)));
        return `
            <div data-id="${rec.internship_id}" class="opportunity-row bg-white border border-slate-200 rounded-lg p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors group">
                <div class="flex items-center gap-4">
                    <div class="size-10 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-slate-600">${score}%</div>
                    <div>
                        <h5 class="font-bold text-slate-900 text-sm">${rec.title}</h5>
                        <p class="text-xs text-slate-500">${rec.company} • ${rec.location}</p>
                    </div>
                </div>
                <div class="flex items-center gap-4">
                    <span class="hidden md:inline px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">${rec.sector || 'General'}</span>
                    <span class="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">chevron_right</span>
                </div>
            </div>
        `;
    }).join('');
}


function renderSkillGaps(skills) {
    return skills.map(skill => `
        <div>
            <div class="flex justify-between text-xs mb-1.5">
                <span class="font-medium text-slate-700">${skill.name}</span>
                <span class="text-slate-400">Level ${skill.current}/${skill.required}</span>
            </div>
            <div class="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div class="h-full bg-blue-500 rounded-full transition-all duration-1000" style="width: 0%" data-target-width="${(skill.current / skill.required) * 100}%"></div>
            </div>
        </div>
    `).join('');
}

function setupInteractions(container) {
    // Logout
    const logoutBtn = container.querySelector('#logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            store.clearToken();
            window.location.hash = '#/login';
        });
    }

    // Roadmap buttons
    container.querySelectorAll('.roadmap-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            window.location.hash = `#/roadmap/${id}`;
        });
    });

    // Opportunity rows
    container.querySelectorAll('.opportunity-row').forEach(row => {
        row.addEventListener('click', () => {
            const id = row.getAttribute('data-id');
            window.location.hash = `#/roadmap/${id}`;
        });
    });

    // Action buttons
    container.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = btn.getAttribute('data-id');
            const action = btn.getAttribute('data-action');
            const url = btn.getAttribute('data-url');

            // Disable and show loading
            const originalText = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = '<span class="animate-pulse">Processing...</span>';

            const success = await dashboardController.handleAction(id, action);

            if (success) {
                if (action === 'applied') {
                    btn.innerHTML = 'Applied ✓';
                    btn.classList.replace('bg-primary', 'bg-slate-800');
                    btn.classList.add('cursor-default');
                    if (url && url !== '#') {
                        setTimeout(() => window.open(url, '_blank'), 500);
                    }
                } else if (action === 'saved') {


                    btn.classList.add('text-red-500', 'border-red-200');
                    btn.innerHTML = '<span class="material-symbols-outlined text-base fill-1">favorite</span>';
                }
            } else {
                btn.disabled = false;
                btn.innerHTML = originalText;
            }
        });
    });
}

function triggerEntranceAnimations(container) {
    // Progress Bars
    setTimeout(() => {
        container.querySelectorAll('[data-target-width]').forEach(bar => {
            bar.style.width = bar.getAttribute('data-target-width');
        });
    }, 100);

    // Cards staggered
    container.querySelectorAll('.recommendation-card').forEach((card, i) => {
        setTimeout(() => {
            card.classList.remove('opacity-0', 'translate-y-8');
        }, 300 + (i * 150));
    });


    // Count up numbers
    container.querySelectorAll('.count-up').forEach(el => {
        const target = parseInt(el.getAttribute('data-target'));
        let current = 0;
        const duration = 1500;
        const step = target / (duration / 16);

        const update = () => {
            current += step;
            if (current < target) {
                el.innerText = Math.floor(current);
                requestAnimationFrame(update);
            } else {
                el.innerText = target;
            }
        };
        update();
    });


    // Semantic Alignment Animation
    setTimeout(() => {
        const radar = container.querySelector('#radarShape');
        if (radar) {
            const score = store.semanticAlignment || 88;
            radar.style.width = `${score}%`;
            radar.style.height = `${score}%`;
            radar.style.opacity = '1';
        }
    }, 1200);
}

