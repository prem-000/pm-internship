
import store from '../js/store.js';

export const renderSidebar = (currentPath) => {
    const { user, profile } = store;
    const userName = profile?.full_name || user?.name || 'User';
    const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

    const menuItems = [
        { path: '#/dashboard', label: 'Dashboard', icon: 'dashboard' },
        { path: '#/profile', label: 'Profile', icon: 'person' },
        { path: '#/recommendations', label: 'Recommendations', icon: 'auto_awesome' },
        { path: '#/analytics', label: 'Analytics', icon: 'analytics' },
        { path: '#/roadmap', label: 'Roadmap', icon: 'route' },
        { path: '#/settings', label: 'Settings', icon: 'settings' }
    ];

    return `
        <aside id="mainSidebar" class="w-72 bg-[#1e1b4b] text-white flex flex-col fixed h-full z-[60] transition-all duration-300 transform -translate-x-full lg:translate-x-0">
            <div class="p-8 flex items-center gap-3 shrink-0">
                <div class="size-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <span class="material-symbols-outlined text-white">auto_awesome</span>
                </div>
                <div>
                    <h1 class="text-white font-black tracking-tight leading-none text-xl">AIRE</h1>
                    <p class="text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-1">Adaptive Engine</p>
                </div>
            </div>
            
            <nav class="flex-1 px-4 space-y-1 mt-4 overflow-y-auto scrollbar-hide">
                ${menuItems.map(item => {
        const isActive = currentPath === item.path || (item.path === '#/roadmap' && currentPath.startsWith('#/roadmap/'));
        return `
                    <a class="flex items-center gap-4 px-8 py-4 transition-all duration-200 group ${isActive ? 'bg-white/10 text-white border-r-4 border-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}" href="${item.path}">
                        <span class="material-symbols-outlined text-[24px] group-hover:scale-110 transition-transform">${item.icon}</span>
                        <span class="font-semibold">${item.label}</span>
                    </a>
                    `;
    }).join('')}
            </nav>

            <div class="p-4 mt-auto border-t border-white/5 shrink-0">
                <div class="bg-white/5 rounded-xl p-4 mb-6">
                    <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">System Status</p>
                    <div class="flex items-center gap-2">
                        <div class="size-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span class="text-xs font-medium text-slate-300">Engine Synchronized</span>
                    </div>
                </div>
                
                <div class="flex items-center gap-3 px-4 py-3 mb-2 bg-white/5 rounded-xl border border-white/5">
                    <div class="size-8 rounded-full bg-primary flex items-center justify-center text-[10px] font-black border border-white/20">
                        ${userInitials}
                    </div>
                    <div class="overflow-hidden">
                        <p class="text-xs font-bold truncate">${userName}</p>
                        <p class="text-[10px] text-slate-500 truncate">${user?.email || ''}</p>
                    </div>
                </div>

                <button id="logoutBtn" class="flex items-center gap-4 px-4 py-3 text-slate-400 hover:text-white hover:bg-red-500/10 rounded-xl transition-all w-full group">
                    <span class="material-symbols-outlined text-[24px] group-hover:rotate-12 transition-transform">logout</span>
                    <span class="font-semibold">Logout</span>
                </button>
            </div>
        </aside>
    `;
};
