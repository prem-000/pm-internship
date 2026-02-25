import store from '../js/store.js';
import { settingsController } from '../js/settings.controller.js';
import { toast } from '../components/toast.js';
import { showConfirmModal } from '../components/modal.js';

export const renderSettings = async (container) => {
    // Show skeleton loader initial
    container.innerHTML = `
        <div class="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark">
            <div class="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    `;

    try {
        const user = await settingsController.init();
        renderMainLayout(container, user);
    } catch (error) {
        toast.error('Failed to load settings. Please try again.');
        window.location.hash = '#/dashboard';
    }
};

function renderMainLayout(container, user) {
    container.innerHTML = `
<div class="flex min-h-screen relative overflow-hidden bg-background-light dark:bg-background-dark font-display">
    <!-- Sidebar Navigation -->
    <aside class="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hidden md:flex flex-col sticky top-0 h-screen shrink-0">
        <div class="p-6 flex flex-col gap-1">
            <h1 class="text-primary dark:text-indigo-400 text-xl font-bold tracking-tight">AIRE</h1>
            <p class="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">Adaptive Engine</p>
        </div>
        <nav class="flex-1 px-3 space-y-1">
            <a class="flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors group" href="#/dashboard">
                <span class="material-symbols-outlined text-slate-400 group-hover:text-primary">dashboard</span>
                <span class="text-sm font-medium">Dashboard</span>
            </a>
            <a class="flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors group" href="#/profile">
                <span class="material-symbols-outlined text-slate-400 group-hover:text-primary">person</span>
                <span class="text-sm font-medium">Profile</span>
            </a>
            <a class="flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors group" href="#/recommendations">
                <span class="material-symbols-outlined text-slate-400 group-hover:text-primary">auto_awesome</span>
                <span class="text-sm font-medium">Recommendations</span>
            </a>
            <a class="flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors group" href="#/analytics">
                <span class="material-symbols-outlined text-slate-400 group-hover:text-primary">bar_chart</span>
                <span class="text-sm font-medium">Analytics</span>
            </a>
            <a class="flex items-center gap-3 px-3 py-2.5 text-primary bg-primary/5 rounded-lg transition-colors active-nav border-l-4 border-primary" href="#/settings">
                <span class="material-symbols-outlined text-primary">settings</span>
                <span class="text-sm font-semibold">Settings</span>
            </a>
        </nav>
        <div class="p-4 border-t border-slate-200 dark:border-slate-800">
            <div class="flex items-center gap-3 px-2 py-2">
                <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">${user.full_name?.split(' ').map(n => n[0]).join('') || 'U'}</div>
                <div class="flex flex-col">
                    <p class="text-xs font-semibold text-slate-900 dark:text-white">${user.full_name}</p>
                    <p class="text-[10px] text-slate-500">${user.plan} Plan</p>
                </div>
            </div>
            <button id="logoutBtn" class="w-full mt-2 flex items-center gap-2 px-2 py-1.5 text-xs text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 rounded-lg transition-colors">
                <span class="material-symbols-outlined text-sm">logout</span> Logout
            </button>
        </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col min-w-0 overflow-hidden">
        <!-- Header -->
        <header class="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10">
            <div class="flex items-center gap-4">
                <h2 class="text-lg font-bold text-slate-900 dark:text-white">Settings</h2>
            </div>
            <div class="flex items-center gap-4 md:hidden">
                <button class="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                    <span class="material-symbols-outlined">menu</span>
                </button>
            </div>
        </header>

        <!-- Scrollable Content -->
        <div class="flex-1 overflow-y-auto p-4 md:p-8 entrance-animation">
            <div class="max-w-[960px] mx-auto space-y-6">
                
                <!-- Account Information Card -->
                <section class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden opacity-0 translate-y-4 transition-all duration-500" id="accountCard">
                    <div class="p-6 border-b border-slate-100 dark:border-slate-800">
                        <h3 class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <span class="material-symbols-outlined text-primary">account_circle</span>
                            Account Information
                        </h3>
                        <p class="text-sm text-slate-500 mt-1">Manage your personal details and account status.</p>
                    </div>
                    <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-1">
                            <label class="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Full Name</label>
                            <p class="text-sm font-medium text-slate-900 dark:text-slate-100">${user.full_name}</p>
                        </div>
                        <div class="space-y-1">
                            <label class="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Email Address</label>
                            <p class="text-sm font-medium text-slate-900 dark:text-slate-100">${user.email}</p>
                        </div>
                        <div class="space-y-1">
                            <label class="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Current Role</label>
                            <div class="flex items-center gap-2">
                                <p class="text-sm font-medium text-slate-900 dark:text-slate-100">${user.department}</p>
                                <span class="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-semibold rounded-full">${user.role}</span>
                            </div>
                        </div>
                        <div class="space-y-1">
                            <label class="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Member Since</label>
                            <p class="text-sm font-medium text-slate-900 dark:text-slate-100">${new Date(user.member_since).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                        </div>
                    </div>
                    <div class="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 flex justify-end">
                        <button onclick="window.location.hash = '#/profile'" class="text-xs font-bold text-primary dark:text-indigo-400 hover:underline">Edit Profile</button>
                    </div>
                </section>

                <!-- Adaptive Engine Controls Card -->
                <section class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden opacity-0 translate-y-4 transition-all duration-500" id="engineCard">
                    <div class="p-6 border-b border-slate-100 dark:border-slate-800">
                        <div class="flex items-start justify-between gap-4">
                            <div>
                                <h3 class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <span class="material-symbols-outlined text-primary">psychology</span>
                                    Adaptive Engine Controls
                                </h3>
                                <p class="text-sm text-slate-500 mt-1">Reset learned behavioral weights and interaction history.</p>
                            </div>
                            <div class="hidden sm:block">
                                <div class="w-12 h-12 rounded-lg bg-primary/5 flex items-center justify-center">
                                    <span class="material-symbols-outlined text-primary">analytics</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="p-6 space-y-8">
                        <!-- Action 1: Reset Behavior -->
                        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                            <div class="space-y-1">
                                <p class="text-sm font-bold text-slate-900 dark:text-white">Reset Behavioral Boost</p>
                                <p class="text-xs text-slate-500">Resets sector-specific and skill-based preference weighting to default values.</p>
                            </div>
                            <button id="resetBehaviorBtn" class="px-4 py-2 border-2 border-primary text-primary dark:border-indigo-400 dark:text-indigo-400 text-xs font-bold rounded-lg hover:bg-primary hover:text-white dark:hover:bg-indigo-400 dark:hover:text-slate-900 transition-all active:scale-[0.98] whitespace-nowrap flex items-center gap-2">
                                <span class="btn-text">Reset Behavioral Boost</span>
                            </button>
                        </div>

                        <!-- Action 2: Clear Feedback -->
                        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-lg bg-red-50/30 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20">
                            <div class="space-y-1">
                                <p class="text-sm font-bold text-slate-900 dark:text-white">Clear Feedback History</p>
                                <p class="text-xs text-slate-500">Irreversibly removes all saved, applied, and viewed interactions from the engine's memory.</p>
                            </div>
                            <button id="clearFeedbackBtn" class="px-4 py-2 border-2 border-red-500 text-red-500 text-xs font-bold rounded-lg hover:bg-red-500 hover:text-white transition-all active:scale-[0.98] whitespace-nowrap flex items-center gap-2">
                                <span class="btn-text">Clear Feedback History</span>
                            </button>
                        </div>
                    </div>
                    <div class="p-6 pt-0">
                        <div class="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-lg">
                            <span class="material-symbols-outlined text-amber-600 dark:text-amber-500">warning</span>
                            <p class="text-xs text-amber-800 dark:text-amber-400 leading-relaxed">
                                <strong>Caution:</strong> These actions are permanent and will immediately affect the relevance of your internship recommendations.
                            </p>
                        </div>
                    </div>
                </section>

                <!-- Illustration/Pattern Footer -->
                <div class="relative h-32 rounded-xl overflow-hidden group opacity-0 translate-y-4 transition-all duration-500" id="footerPanel">
                    <div class="absolute inset-0 bg-gradient-to-r from-primary to-indigo-600 opacity-90"></div>
                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_nPpm5K4MKj_0MYuiKB5zIksH_DiJpyEpM9mQV5WYOi63qDbiO-wjoQRwSXJpG9oDHRPGvVFIKZyM9zuMqDvQ9rMoM3Q_nUfT_2kYiVSN21jx9K5JEUWjMs7qkVoasB8GIt-Af-pwKqKiIlGyqjRzokuuRc_ynO3qPGvsPMapNEiB5GyIa6gApgzGxa2yjh2kyExDpYUNa1zdA7I7mKCer3ILu499cxj2kpQYb7hKJRHtxYTF1y5yfU5mi2_K2odoUAIDMumqrC57" 
                         alt="Abstract tech pattern" class="absolute inset-0 w-full h-full object-cover mix-blend-overlay">
                    <div class="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                        <h4 class="text-white font-bold text-sm">Need Help?</h4>
                        <p class="text-white/70 text-xs mt-1 max-w-xs">Our support team can help you with engine fine-tuning and profile optimization.</p>
                        <button class="mt-3 px-4 py-1.5 bg-white text-primary text-[10px] font-bold rounded-full hover:bg-slate-100 transition-colors">
                            Contact Support
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </main>
</div>
    `;

    setupEventListeners(container);
    triggerEntranceAnimations(container);
}

function setupEventListeners(container) {
    const logoutBtn = container.querySelector('#logoutBtn');
    const resetBehaviorBtn = container.querySelector('#resetBehaviorBtn');
    const clearFeedbackBtn = container.querySelector('#clearFeedbackBtn');

    logoutBtn.onclick = () => {
        store.clearToken();
        window.location.hash = '#/login';
    };

    resetBehaviorBtn.onclick = () => {
        showConfirmModal({
            title: 'Reset Behavioral Boost?',
            message: 'This will reset all your sector-specific and skill-based preferences to zero. Your recommendations will lose their personalization temporarly.',
            confirmText: 'Yes, Reset Engine',
            onConfirm: async () => {
                const originalContent = resetBehaviorBtn.innerHTML;
                resetBehaviorBtn.disabled = true;
                resetBehaviorBtn.innerHTML = `<span class="size-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span> Resetting...`;

                try {
                    await settingsController.handleResetBehavior();
                    toast.success('Behavioral engine reset successfully!');
                } catch (error) {
                    toast.error('Failed to reset engine. Try again.');
                } finally {
                    resetBehaviorBtn.disabled = false;
                    resetBehaviorBtn.innerHTML = originalContent;
                }
            }
        });
    };

    clearFeedbackBtn.onclick = () => {
        showConfirmModal({
            title: 'Clear Feedback History?',
            message: 'WARNING: This will permanently delete your saved internships, applied history, and viewed tracking. This action cannot be undone.',
            confirmText: 'Confirm Deletion',
            isDestructive: true,
            onConfirm: async () => {
                const originalContent = clearFeedbackBtn.innerHTML;
                clearFeedbackBtn.disabled = true;
                clearFeedbackBtn.innerHTML = `<span class="size-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span> Clearing...`;

                try {
                    await settingsController.handleClearFeedback();
                    container.querySelector('#engineCard').classList.add('animate-shake');
                    setTimeout(() => container.querySelector('#engineCard').classList.remove('animate-shake'), 400);
                    toast.success('Interaction mapping cleared permanently.');
                } catch (error) {
                    toast.error('Deletion failed. System locked.');
                } finally {
                    clearFeedbackBtn.disabled = false;
                    clearFeedbackBtn.innerHTML = originalContent;
                }
            }
        });
    };
}

function triggerEntranceAnimations(container) {
    const cards = [
        container.querySelector('#accountCard'),
        container.querySelector('#engineCard'),
        container.querySelector('#footerPanel')
    ];

    cards.forEach((card, i) => {
        setTimeout(() => {
            if (card) {
                card.classList.remove('opacity-0', 'translate-y-4');
            }
        }, 100 + (i * 150));
    });
}
