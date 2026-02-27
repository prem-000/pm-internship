export const renderSidebar = (currentPath) => {
    const menuItems = [
        { name: 'Dashboard', icon: 'grid_view', path: '#/dashboard' },
        { name: 'Analytics', icon: 'monitoring', path: '#/analytics' },
        { name: 'User Management', icon: 'shield_person', path: '#/users' },
        { name: 'Internships', icon: 'business_center', path: '#/internships' },
        { name: 'System Logs', icon: 'terminal', path: '#/logs' },
    ];

    return `
        <div class="h-full flex flex-col py-8">
            <div class="flex items-center gap-3 mb-10 px-8">
                <div class="size-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                    <span class="material-symbols-outlined text-white font-black">school</span>
                </div>
                <div>
                    <h1 class="text-lg font-black tracking-tight text-primary">AIRE <span class="text-accent">ADMIN</span></h1>
                    <p class="text-[9px] text-text-muted font-bold uppercase tracking-[0.2em] leading-none">Command Center v2.1</p>
                </div>
            </div>

            <nav class="flex-1 space-y-1">
                ${menuItems.map(item => `
                    <a href="${item.path}" class="sidebar-item ${currentPath === item.path ? 'active' : ''}">
                        <span class="material-symbols-outlined size-5 flex items-center justify-center">${item.icon}</span>
                        <span>${item.name}</span>
                    </a>
                `).join('')}
            </nav>

            <div class="mt-auto px-6 space-y-4">
                <div class="space-y-1">
                    <a href="#/settings" class="sidebar-item ${currentPath === '#/settings' ? 'active' : ''}">
                        <span class="material-symbols-outlined size-5 flex items-center justify-center">settings_suggest</span>
                        <span>Settings</span>
                    </a>
                </div>

                <button id="logout-btn" class="w-full group flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold text-danger hover:bg-danger/5 transition-all border border-transparent hover:border-danger/10">
                    <span class="material-symbols-outlined text-xl">power_settings_new</span>
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    `;
};
