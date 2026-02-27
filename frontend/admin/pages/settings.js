import { api } from '../js/api.js';

export const renderSettings = async (container) => {
    container.innerHTML = `
        <div class="mb-8">
            <h3 class="text-lg font-black text-text-main uppercase tracking-tight">Core Configuration</h3>
            <p class="text-[10px] text-text-muted font-bold uppercase tracking-widest">Global system parameters and linguistic oversight</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Section 1: Language Configuration -->
            <div class="glass-panel p-6 space-y-6">
                <div class="flex items-center gap-3 border-b border-border-color pb-4">
                    <div class="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <span class="material-symbols-outlined text-sm">language</span>
                    </div>
                    <h4 class="text-sm font-black text-text-main uppercase tracking-tight">Language Configuration</h4>
                </div>

                <div class="space-y-4">
                    <p class="text-[10px] font-black text-text-muted uppercase tracking-widest">Supported Languages</p>
                    <div id="supported-languages-list" class="space-y-2">
                        <!-- Toggles will be injected here -->
                    </div>

                    <div class="grid grid-cols-2 gap-4 pt-4">
                        <div class="space-y-2">
                            <label class="text-[10px] font-black text-text-muted uppercase tracking-widest">Default Language</label>
                            <select id="default-language" class="bg-bg-light border-border-color text-xs font-bold rounded-xl w-full p-2.5 text-text-main focus:ring-primary focus:border-primary">
                                <option value="en">English (en)</option>
                                <option value="hi">Hindi (hi)</option>
                                <option value="ta">Tamil (ta)</option>
                            </select>
                        </div>
                        <div class="space-y-2">
                            <label class="text-[10px] font-black text-text-muted uppercase tracking-widest">Fallback Language</label>
                            <select id="fallback-language" class="bg-bg-light border-border-color text-xs font-bold rounded-xl w-full p-2.5 text-text-main focus:ring-primary focus:border-primary">
                                <option value="en">English (en)</option>
                                <option value="hi">Hindi (hi)</option>
                                <option value="ta">Tamil (ta)</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Section 2: Gemini AI Language Behavior -->
            <div class="glass-panel p-6 space-y-6">
                <div class="flex items-center gap-3 border-b border-border-color pb-4">
                    <div class="size-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                        <span class="material-symbols-outlined text-sm">psychology</span>
                    </div>
                    <h4 class="text-sm font-black text-text-main uppercase tracking-tight">Gemini AI Behavior</h4>
                </div>

                <div class="space-y-4">
                    <p class="text-[10px] font-black text-text-muted uppercase tracking-widest">Roadmap Output Mode</p>
                    <div class="space-y-3">
                        <label class="flex items-center gap-3 cursor-pointer group">
                            <input type="radio" name="roadmap-mode" value="match_user" class="text-primary focus:ring-primary bg-bg-light border-border-color">
                            <span class="text-xs font-bold text-text-main group-hover:text-primary transition-colors">Match User Preferred Language</span>
                        </label>
                        <label class="flex items-center gap-3 cursor-pointer group">
                            <input type="radio" name="roadmap-mode" value="always_english" class="text-primary focus:ring-primary bg-bg-light border-border-color">
                            <span class="text-xs font-bold text-text-main group-hover:text-primary transition-colors">Always English</span>
                        </label>
                        <label class="flex items-center gap-3 cursor-pointer group">
                            <input type="radio" name="roadmap-mode" value="admin_selected" class="text-primary focus:ring-primary bg-bg-light border-border-color">
                            <span class="text-xs font-bold text-text-main group-hover:text-primary transition-colors">Admin Selected Language</span>
                        </label>
                    </div>

                    <div id="admin-lang-select-container" class="space-y-2 pt-2 hidden">
                        <label class="text-[10px] font-black text-text-muted uppercase tracking-widest">Admin Selected Language</label>
                        <select id="admin-selected-language" class="bg-bg-light border-border-color text-xs font-bold rounded-xl w-full p-2.5 text-text-main">
                            <option value="en">English (en)</option>
                            <option value="hi">Hindi (hi)</option>
                            <option value="ta">Tamil (ta)</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Section 3: Internship Content Mode -->
            <div class="glass-panel p-6 space-y-6">
                <div class="flex items-center gap-3 border-b border-border-color pb-4">
                    <div class="size-8 rounded-lg bg-success/10 flex items-center justify-center text-success">
                        <span class="material-symbols-outlined text-sm">description</span>
                    </div>
                    <h4 class="text-sm font-black text-text-main uppercase tracking-tight">Deployment Asset Content</h4>
                </div>

                <div class="space-y-4">
                    <p class="text-[10px] font-black text-text-muted uppercase tracking-widest">Internship Content Mode</p>
                    <div class="space-y-3">
                        <label class="flex items-center gap-3 cursor-pointer group">
                            <input type="radio" name="content-mode" value="english_only" class="text-primary focus:ring-primary bg-bg-light border-border-color">
                            <span class="text-xs font-bold text-text-main group-hover:text-primary transition-colors">English Only</span>
                        </label>
                        <label class="flex items-center gap-3 cursor-pointer group">
                            <input type="radio" name="content-mode" value="multilingual" class="text-primary focus:ring-primary bg-bg-light border-border-color">
                            <span class="text-xs font-bold text-text-main group-hover:text-primary transition-colors">Multilingual Enabled (Phase 2)</span>
                        </label>
                    </div>
                </div>
            </div>

            <!-- Section 4: Language Analytics -->
            <div class="glass-panel p-6 space-y-6">
                <div class="flex items-center gap-3 border-b border-border-color pb-4">
                    <div class="size-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
                        <span class="material-symbols-outlined text-sm">analytics</span>
                    </div>
                    <h4 class="text-sm font-black text-text-main uppercase tracking-tight">Linguistic Intelligence</h4>
                </div>

                <div id="language-analytics-container" class="space-y-4">
                    <div class="p-8 text-center bg-bg-light rounded-2xl border border-dashed border-border-color">
                        <div class="animate-spin size-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p class="text-[10px] font-black text-text-muted uppercase tracking-widest">Fetching Demographics...</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="mt-8 flex justify-end">
            <button id="save-settings-btn" class="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-all shadow-lg shadow-primary/20 flex items-center gap-2 group active:scale-95">
                <span class="material-symbols-outlined text-sm group-hover:rotate-12 transition-transform">save</span>
                Commit Changes
            </button>
        </div>
    `;

    const fetchSettings = async () => {
        try {
            const config = await api.get('/admin/settings/language');
            const analytics = await api.get('/admin/analytics/languages');
            renderUI(config, analytics);
        } catch (error) {
            console.error('Settings load error:', error);
        }
    };

    const renderUI = (config, analytics) => {
        // Render Toggles
        const langList = document.getElementById('supported-languages-list');
        const languages = [
            { code: 'en', name: 'English' },
            { code: 'hi', name: 'Hindi' },
            { code: 'ta', name: 'Tamil' },
            { code: 'te', name: 'Telugu' }
        ];

        langList.innerHTML = languages.map(lang => `
            <label class="flex items-center justify-between p-3 rounded-xl bg-bg-light border border-border-color group cursor-pointer hover:border-primary/20 transition-all">
                <div class="flex items-center gap-3">
                    <div class="size-8 rounded-lg bg-white border border-border-color flex items-center justify-center text-[10px] font-black group-hover:text-primary">
                        ${lang.code.toUpperCase()}
                    </div>
                    <span class="text-xs font-bold text-text-main">${lang.name}</span>
                </div>
                <input type="checkbox" name="supported-langs" value="${lang.code}" 
                    ${config.supported_languages.includes(lang.code) ? 'checked' : ''}
                    class="ml-auto rounded border-border-color text-primary focus:ring-primary">
            </label>
        `).join('');

        // Set form values
        document.getElementById('default-language').value = config.default_language;
        document.getElementById('fallback-language').value = config.fallback_language;

        const roadmapRadio = document.querySelector(`input[name="roadmap-mode"][value="${config.roadmap_language_mode}"]`);
        if (roadmapRadio) roadmapRadio.checked = true;

        if (config.roadmap_language_mode === 'admin_selected') {
            document.getElementById('admin-lang-select-container').classList.remove('hidden');
        }
        document.getElementById('admin-selected-language').value = config.admin_selected_language || 'en';

        const contentRadio = document.querySelector(`input[name="content-mode"][value="${config.internship_content_mode}"]`);
        if (contentRadio) contentRadio.checked = true;

        // Render Analytics
        const analyticsContainer = document.getElementById('language-analytics-container');
        const totalUsers = analytics.reduce((acc, curr) => acc + curr.count, 0) || 1;

        analyticsContainer.innerHTML = analytics.map(stat => {
            const percentage = Math.round((stat.count / totalUsers) * 100);
            return `
                <div class="space-y-2">
                    <div class="flex items-center justify-between">
                        <span class="text-xs font-bold text-text-main">${stat.language === 'en' ? 'English' : stat.language === 'hi' ? 'Hindi' : stat.language === 'ta' ? 'Tamil' : stat.language}</span>
                        <span class="text-[10px] font-black text-text-muted">${percentage}%</span>
                    </div>
                    <div class="h-2 w-full bg-border-color rounded-full overflow-hidden">
                        <div class="h-full bg-primary" style="width: ${percentage}%"></div>
                    </div>
                </div>
            `;
        }).join('');

        setupListeners();
    };

    const setupListeners = () => {
        const roadmapRadios = document.querySelectorAll('input[name="roadmap-mode"]');
        const adminLangSelect = document.getElementById('admin-lang-select-container');

        roadmapRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.value === 'admin_selected') {
                    adminLangSelect.classList.remove('hidden');
                } else {
                    adminLangSelect.classList.add('hidden');
                }
            });
        });

        document.getElementById('save-settings-btn').onclick = async () => {
            const saveBtn = document.getElementById('save-settings-btn');
            const originalContent = saveBtn.innerHTML;

            saveBtn.disabled = true;
            saveBtn.innerHTML = `<span class="size-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span> Processing...`;

            const supportedLangs = Array.from(document.querySelectorAll('input[name="supported-langs"]:checked')).map(cb => cb.value);

            const payload = {
                supported_languages: supportedLangs,
                default_language: document.getElementById('default-language').value,
                fallback_language: document.getElementById('fallback-language').value,
                roadmap_language_mode: document.querySelector('input[name="roadmap-mode"]:checked').value,
                admin_selected_language: document.getElementById('admin-selected-language').value,
                internship_content_mode: document.querySelector('input[name="content-mode"]:checked').value
            };

            try {
                await api.put('/admin/settings/language', payload);
                saveBtn.innerHTML = `<span class="material-symbols-outlined text-sm">check_circle</span> Config Synchronized`;
                saveBtn.classList.replace('bg-primary', 'bg-success');

                setTimeout(() => {
                    saveBtn.innerHTML = originalContent;
                    saveBtn.classList.replace('bg-success', 'bg-primary');
                    saveBtn.disabled = false;
                }, 2000);
            } catch (error) {
                alert('Commit Failed: ' + error.message);
                saveBtn.innerHTML = originalContent;
                saveBtn.disabled = false;
            }
        };
    };

    fetchSettings();
};
