
export const renderTopBar = (title = 'AIRE') => `
    <div class="lg:hidden h-16 bg-white dark:bg-background-dark border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 sticky top-0 z-40 w-full">
        <div class="flex items-center gap-3">
            <button id="sidebarToggle" class="p-2 -ml-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                <span class="material-symbols-outlined">menu</span>
            </button>
            <h1 class="font-black text-primary tracking-tight text-lg italic">${title}</h1>
        </div>
        <div class="flex items-center gap-2">
            <div id="sidebarOverlay" class="hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"></div>
        </div>
    </div>
`;
