export const renderAnalytics = (container) => {
    container.innerHTML = `
        <div class="flex min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
            <aside class="w-64 bg-primary text-white flex flex-col shrink-0">
                <div class="p-6 flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                        <span class="material-symbols-outlined text-white">school</span>
                    </div>
                    <div class="flex flex-col">
                        <h1 class="text-lg font-bold tracking-tight">AIRE</h1>
                        <p class="text-[10px] text-indigo-300">Adaptive Engine</p>
                    </div>
                </div>
                <nav class="flex-1 px-4 space-y-2 mt-4">
                    <a class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors" href="#/dashboard"><span class="material-symbols-outlined">dashboard</span> <span class="text-sm font-medium">Dashboard</span></a>
                    <a class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors" href="#/profile"><span class="material-symbols-outlined">person</span> <span class="text-sm font-medium">Profile</span></a>
                    <a class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors" href="#/roadmap"><span class="material-symbols-outlined">map</span> <span class="text-sm font-medium">Roadmap</span></a>
                    <a class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors" href="#/recommendations"><span class="material-symbols-outlined">auto_awesome</span> <span class="text-sm font-medium">Recommendations</span></a>
                    <a class="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/20" href="#/analytics"><span class="material-symbols-outlined">analytics</span> <span class="text-sm font-medium">Analytics</span></a>
                </nav>
            </aside>
            <main class="flex-1 p-12 flex flex-col items-center justify-center text-center">
                <div class="size-24 bg-primary/5 rounded-full flex items-center justify-center mb-6">
                    <span class="material-symbols-outlined text-5xl text-primary animate-pulse">analytics</span>
                </div>
                <h2 class="text-3xl font-black mb-2">Advanced Analytics</h2>
                <p class="text-slate-500 max-w-md mx-auto">This module is currently being calibrated to provide deep insights into your career trajectory and skill alignment trends. Check back soon!</p>
                <div class="mt-8 flex gap-4">
                    <button onclick="window.location.hash = '#/dashboard'" class="px-6 py-2 bg-primary text-white rounded-lg font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all">Go to Dashboard</button>
                </div>
            </main>
        </div>
    `;
};
