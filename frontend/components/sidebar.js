
import store from '../js/store.js';

export const renderSidebar = (currentPath) => {
    const { user, profile } = store;
    const userName = profile?.full_name || user?.name || 'User';
    const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

    const menuItems = [
        { path: '#/dashboard', label: i18next.t('nav.dashboard'), key: 'nav.dashboard', icon: 'dashboard' },
        { path: '#/profile', label: i18next.t('nav.profile'), key: 'nav.profile', icon: 'person' },
        { path: '#/recommendations', label: i18next.t('nav.internships'), key: 'nav.internships', icon: 'auto_awesome' },
        { path: '#/roadmap', label: i18next.t('nav.roadmap'), key: 'nav.roadmap', icon: 'route' },
        { path: '#/settings', label: i18next.t('nav.settings'), key: 'nav.settings', icon: 'settings' }
    ];

    return `
        <aside id="mainSidebar" class="w-72 bg-[#1e1b4b] text-white flex flex-col fixed h-full z-[60] transition-all duration-300 transform -translate-x-full lg:translate-x-0">
            <div class="p-8 flex items-center gap-3 shrink-0">
                <div class="size-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <span class="material-symbols-outlined text-white">school</span>
                </div>
                <div>
                    <h1 class="text-white font-black tracking-tight leading-none text-xl" data-i18n="app_name">AIRE</h1>
                    <p class="text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-1" data-i18n="landing.hero_subtitle_tagline">${i18next.t('landing.hero_subtitle_tagline')}</p>
                </div>
            </div>
            
            <nav class="flex-1 px-4 space-y-1 mt-4 overflow-y-auto scrollbar-hide">
                ${menuItems.map(item => {
        const isActive = currentPath === item.path || (item.path === '#/roadmap' && currentPath.startsWith('#/roadmap/'));
        return `
                        <a class="flex items-center gap-4 px-8 py-4 transition-all duration-200 group ${isActive ? 'bg-white/10 text-white border-r-4 border-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}" href="${item.path}">
                            <span class="material-symbols-outlined text-[24px] group-hover:scale-110 transition-transform">${item.icon}</span>
                            <span class="font-semibold" data-i18n="${item.key}">${item.label}</span>
                        </a>
                        `;
    }).join('')}
            </nav>

            <div class="px-8 py-4 bg-white/5 mx-4 rounded-xl space-y-2 mb-4">
                <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1" data-i18n="nav.language">${i18next.t('nav.language')}</p>
                <div class="flex items-center gap-3">
                    <button onclick="changeLanguage('en')" class="text-[10px] font-black hover:text-govSaffron transition-colors ${i18next.language === 'en' ? 'text-white' : 'text-slate-400'}">EN</button>
                    <div class="w-px h-3 bg-white/20"></div>
                    <button onclick="changeLanguage('hi')" class="text-[10px] font-black hover:text-govSaffron transition-colors ${i18next.language === 'hi' ? 'text-white' : 'text-slate-400'}">हिंदी</button>
                    <div class="w-px h-3 bg-white/20"></div>
                    <button onclick="changeLanguage('ta')" class="text-[10px] font-black hover:text-govSaffron transition-colors ${i18next.language === 'ta' ? 'text-white' : 'text-slate-400'}">தமிழ்</button>
                </div>
            </div>

            <div class="p-4 border-t border-white/5 shrink-0">
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
                    <span class="font-semibold" data-i18n="nav.logout">${i18next.t('nav.logout')}</span>
                </button>
            </div>
        </aside>
    `;
};
