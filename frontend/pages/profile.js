import store from '../js/store.js';
import { profileController } from '../js/profile.controller.js';
import { toast } from '../components/toast.js';
import { renderSidebar } from '../components/sidebar.js';
import { renderTopBar } from '../components/mobileNav.js';

export const renderProfile = async (container) => {
    // Show loader
    container.innerHTML = `
        <div class="flex items-center justify-center min-h-screen bg-background-light">
            <div class="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    `;

    await profileController.init();
    renderMainLayout(container);
};

function renderMainLayout(container) {
    const { user, profile } = store;

    // Local state for skills (managed differently because it's a list)
    let currentSkills = [...(profile?.skills || [])];

    const lastUpdate = profile?.last_updated ? new Date(profile.last_updated).toLocaleDateString(i18next.language) : i18next.t('common.never', 'Never');

    container.innerHTML = `
        <div class="flex flex-col lg:flex-row min-h-screen bg-background-light dark:bg-background-dark overflow-x-hidden">
            <!-- Mobile Top Bar -->
            ${renderTopBar(i18next.t('nav.profile'))}

            <!-- Left Sidebar -->
            ${renderSidebar('#/profile')}

            <!-- Main Content -->
            <main class="flex-1 p-4 md:p-8 max-w-5xl mx-auto lg:ml-72 ml-0 pb-24 lg:pb-8 w-full">
                <header class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 entrance-section">
                    <div>
                        <h2 class="text-3xl font-black text-slate-900 leading-tight" data-i18n="profile.welcome_user" data-i18n-options='{"name": "${profile?.full_name || user?.name || "User"}"}'>
                            ${i18next.t('profile.welcome_user', { name: profile?.full_name || user?.name || 'User' })}
                        </h2>
                        <p class="text-slate-500 mt-1 flex items-center gap-2">
                            <span class="material-symbols-outlined text-sm">schedule</span>
                            <span data-i18n="profile.last_update" data-i18n-options='{"date": "${lastUpdate}"}'>
                                ${i18next.t('profile.last_update', { date: lastUpdate })}
                            </span>
                        </p>
                    </div>
                    <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm min-w-[260px] relative overflow-hidden group">
                        <div class="absolute top-0 left-0 w-1 h-full bg-primary/20"></div>
                        <div class="flex justify-between items-center mb-2">
                            <span class="text-xs font-bold text-slate-400 uppercase tracking-widest" data-i18n="profile.strength_label">${i18next.t('profile.strength_label')}</span>
                            <span class="text-sm font-black text-primary" id="strengthValue">0%</span>
                        </div>
                        <div class="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                            <div id="strengthBar" class="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary-rgb),0.3)] transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]" style="width: 0%"></div>
                        </div>
                        <p class="text-[10px] text-slate-400 mt-2 font-medium" data-i18n="profile.complete_fields">${i18next.t('profile.complete_fields')}</p>
                    </div>
                </header>

                <div class="space-y-8">
                    <!-- Personal Information -->
                    <section class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm entrance-section">
                        <div class="flex items-center gap-3 mb-6">
                            <div class="size-8 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
                                <span class="material-symbols-outlined text-xl">person</span>
                            </div>
                            <h3 class="font-bold text-slate-900 text-lg" data-i18n="profile.personal_info">${i18next.t('profile.personal_info')}</h3>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2" data-i18n="profile.full_name">${i18next.t('profile.full_name')}</label>
                                <input type="text" id="fullNameInput" value="${profile?.full_name || ''}" placeholder="John Doe" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium">
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2" data-i18n="profile.education">${i18next.t('profile.education')}</label>
                                <input type="text" id="educationInput" value="${profile?.education || ''}" placeholder="Bachelor of Science" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium">
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2" data-i18n="profile.university">${i18next.t('profile.university')}</label>
                                <input type="text" id="universityInput" value="${profile?.university || ''}" placeholder="Stanford University" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium">
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2" data-i18n="profile.grad_year">${i18next.t('profile.grad_year')}</label>
                                <input type="number" id="graduationYearInput" value="${profile?.graduation_year || ''}" placeholder="2025" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium">
                            </div>
                            <div class="md:col-span-2">
                                <label class="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2" data-i18n="profile.bio">${i18next.t('profile.bio')}</label>
                                <textarea id="bioInput" rows="3" placeholder="Tell us about yourself..." class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium resize-none">${profile?.bio || ''}</textarea>
                            </div>
                        </div>
                    </section>

                    <!-- Skills Manager -->
                    <section class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm entrance-section">
                        <div class="flex items-center gap-3 mb-6">
                            <div class="size-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                                <span class="material-symbols-outlined text-xl">psychology</span>
                            </div>
                            <h3 class="font-bold text-slate-900 text-lg" data-i18n="profile.skills_manager">${i18next.t('profile.skills_manager')}</h3>
                        </div>
                        <div id="skillsContainer" class="flex flex-wrap gap-2 mb-6 min-h-[80px] p-4 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                            ${renderSkills(currentSkills)}
                        </div>
                        <div class="flex gap-2">
                            <input type="text" id="skillInput" placeholder="e.g. Python, Figma..." class="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium">
                            <button id="addSkillBtn" class="bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-900 transition-all active:scale-95 shadow-lg shadow-primary/10" data-i18n="profile.add_skill">${i18next.t('profile.add_skill')}</button>
                        </div>
                    </section>

                    <!-- Career Path & Work Preferences -->
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <section class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm entrance-section">
                            <div class="flex items-center gap-3 mb-6">
                                <div class="size-8 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center">
                                    <span class="material-symbols-outlined text-xl">explore</span>
                                </div>
                                <h3 class="font-bold text-slate-900 text-lg" data-i18n="profile.career_path">${i18next.t('profile.career_path')}</h3>
                            </div>
                            <div class="space-y-6">
                                <div>
                                    <label class="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2" data-i18n="profile.target_roles">${i18next.t('profile.target_roles')}</label>
                                    <input type="text" id="targetRolesInput" value="${profile?.target_roles?.join(', ') || ''}" placeholder="Frontend Engineer, UI Designer" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium">
                                    <p class="text-[10px] text-slate-400 mt-2 italic font-medium">Separate multiple roles with commas.</p>
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2" data-i18n="profile.sector_pref">${i18next.t('profile.sector_pref')}</label>
                                    <div class="relative">
                                        <select id="sectorSelect" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer font-medium">
                                            <option value="SaaS & Cloud Computing" ${profile?.sector_preference === 'SaaS & Cloud Computing' ? 'selected' : ''}>SaaS & Cloud Computing</option>
                                            <option value="Fintech" ${profile?.sector_preference === 'Fintech' ? 'selected' : ''}>Fintech</option>
                                            <option value="Artificial Intelligence" ${profile?.sector_preference === 'Artificial Intelligence' ? 'selected' : ''}>Artificial Intelligence</option>
                                            <option value="E-commerce" ${profile?.sector_preference === 'E-commerce' ? 'selected' : ''}>E-commerce</option>
                                            <option value="Cybersecurity" ${profile?.sector_preference === 'Cybersecurity' ? 'selected' : ''}>Cybersecurity</option>
                                        </select>
                                        <span class="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm entrance-section">
                            <div class="flex items-center gap-3 mb-6">
                                <div class="size-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                                    <span class="material-symbols-outlined text-xl">work_history</span>
                                </div>
                                <h3 class="font-bold text-slate-900 text-lg" data-i18n="profile.work_pref">${i18next.t('profile.work_pref')}</h3>
                            </div>
                            <div class="grid grid-cols-1 gap-3">
                                ${renderWorkPreference('remote', i18next.t('profile.remote'), i18next.t('profile.remote_desc'), profile?.location_preference, 'profile.remote', 'profile.remote_desc')}
                                ${renderWorkPreference('hybrid', i18next.t('profile.hybrid'), i18next.t('profile.hybrid_desc'), profile?.location_preference, 'profile.hybrid', 'profile.hybrid_desc')}
                                ${renderWorkPreference('onsite', i18next.t('profile.onsite'), i18next.t('profile.onsite_desc'), profile?.location_preference, 'profile.onsite', 'profile.onsite_desc')}
                            </div>
                        </section>
                    </div>

                    <!-- Professional Links -->
                    <section class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm entrance-section">
                        <div class="flex items-center gap-3 mb-6">
                            <div class="size-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                                <span class="material-symbols-outlined text-xl">link</span>
                            </div>
                            <h3 class="font-bold text-slate-900 text-lg" data-i18n="profile.professional_links">${i18next.t('profile.professional_links')}</h3>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label class="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">LinkedIn URL</label>
                                <input type="url" id="linkedinUrlInput" value="${profile?.linkedin_url || ''}" placeholder="https://linkedin.com/in/username" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium social-input">
                                <p class="error-msg text-[10px] text-red-500 mt-1 hidden font-medium">Please enter a valid URL.</p>
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">GitHub URL</label>
                                <input type="url" id="githubUrlInput" value="${profile?.github_url || ''}" placeholder="https://github.com/username" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium social-input">
                                <p class="error-msg text-[10px] text-red-500 mt-1 hidden font-medium">Please enter a valid URL.</p>
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Portfolio URL</label>
                                <input type="url" id="portfolioUrlInput" value="${profile?.portfolio_url || ''}" placeholder="https://yourname.dev" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium social-input">
                                <p class="error-msg text-[10px] text-red-500 mt-1 hidden font-medium">Please enter a valid URL.</p>
                            </div>
                        </div>
                    </section>
                </div>

                <!-- Action Footer -->
                <div class="mt-12 flex justify-end items-center gap-6 entrance-section">
                    <button id="discardBtn" class="px-6 py-3 text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest" data-i18n="profile.discard_changes">
                        ${i18next.t('profile.discard_changes')}
                    </button>
                    <button id="saveProfileBtn" class="bg-primary text-white px-10 py-3 rounded-xl font-bold text-sm shadow-xl shadow-primary/20 hover:bg-slate-900 hover:-translate-y-0.5 transition-all active:scale-95 flex items-center gap-2">
                        <span class="material-symbols-outlined text-sm">save</span>
                        <span data-i18n="profile.save_profile">${i18next.t('profile.save_profile')}</span>
                    </button>
                </div>
            </main>
        </div>
    `;

    // Local State Handlers
    const skillInput = container.querySelector('#skillInput');
    const addSkillBtn = container.querySelector('#addSkillBtn');
    const skillsContainer = container.querySelector('#skillsContainer');
    const saveProfileBtn = container.querySelector('#saveProfileBtn');
    const discardBtn = container.querySelector('#discardBtn');

    const updateSkillsUI = () => {
        skillsContainer.innerHTML = renderSkills(currentSkills);
        bindSkillRemovers();
    };

    const bindSkillRemovers = () => {
        container.querySelectorAll('.remove-skill').forEach(btn => {
            btn.onclick = () => {
                const skill = btn.dataset.skill;
                currentSkills = currentSkills.filter(s => s !== skill);
                updateSkillsUI();
            };
        });
    };

    addSkillBtn.onclick = () => {
        const val = skillInput.value.trim();
        if (val && !currentSkills.includes(val)) {
            currentSkills.push(val);
            skillInput.value = '';
            updateSkillsUI();
        }
    };

    saveProfileBtn.onclick = async () => {
        saveProfileBtn.disabled = true;
        const originalContent = saveProfileBtn.innerHTML;
        saveProfileBtn.innerHTML = `<div class="size-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Saving...`;

        // Gather all fields
        const payload = {
            full_name: container.querySelector('#fullNameInput').value.trim(),
            education: container.querySelector('#educationInput').value.trim(),
            university: container.querySelector('#universityInput').value.trim(),
            graduation_year: parseInt(container.querySelector('#graduationYearInput').value) || null,
            bio: container.querySelector('#bioInput').value.trim(),
            skills: currentSkills,
            target_roles: container.querySelector('#targetRolesInput').value.split(',').map(r => r.trim()).filter(r => r),
            preferred_sector: container.querySelector('#sectorSelect').value,
            preferred_location: container.querySelector('input[name="work_pref"]:checked').value,
            linkedin_url: container.querySelector('#linkedinUrlInput').value.trim(),
            github_url: container.querySelector('#githubUrlInput').value.trim(),
            portfolio_url: container.querySelector('#portfolioUrlInput').value.trim()
        };

        // Validation for URLs
        if (container.querySelectorAll('.error-msg:not(.hidden)').length > 0) {
            saveProfileBtn.disabled = false;
            saveProfileBtn.innerHTML = originalContent;
            toast.error("Please fix validation errors before saving.");
            return;
        }

        try {
            const success = await profileController.handleSave(payload);
            if (success) {
                toast.success("Profile updated successfully");
                saveProfileBtn.innerHTML = `<span class="material-symbols-outlined text-sm">check_circle</span> <span>Saved!</span>`;
                saveProfileBtn.classList.replace('bg-primary', 'bg-emerald-600');

                // Re-sync UI with new state
                setTimeout(() => {
                    renderProfile(container);
                }, 1000);
            } else {
                throw new Error("Action failed");
            }
        } catch (err) {
            saveProfileBtn.disabled = false;
            saveProfileBtn.innerHTML = originalContent;
            // Error handling is mostly covered in profileController/api
        }
    };

    discardBtn.onclick = () => {
        renderProfile(container);
    };

    // URL Validation (Optional - allows empty/null)
    const isValidUrl = (url) => {
        if (!url || url.trim() === "") return true;
        try {
            const parsed = new URL(url);
            return parsed.protocol === "http:" || parsed.protocol === "https:";
        } catch {
            return false;
        }
    };

    container.querySelectorAll('.social-input').forEach(input => {
        input.oninput = () => {
            const val = input.value.trim();
            const errorMsg = input.nextElementSibling;
            if (val && !isValidUrl(val)) {
                errorMsg.classList.remove('hidden');
                input.classList.add('border-red-300', 'focus:ring-red-100');
            } else {
                errorMsg.classList.add('hidden');
                input.classList.remove('border-red-300', 'focus:ring-red-100');
            }
        };
    });

    bindSkillRemovers();

    // Sidebar Logout
    const logoutBtn = container.querySelector('#logoutBtn');
    if (logoutBtn) {
        logoutBtn.onclick = () => {
            store.clearToken();
            window.location.hash = '#/login';
        };
    }

    // Entrance Animations
    container.querySelectorAll('.entrance-section').forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.4s ease';
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 100 * (i + 1));
    });

    // Profile Strength
    const strengthTarget = profile?.profile_strength || 0;
    const strengthEl = container.querySelector('#strengthValue');
    const strengthBar = container.querySelector('#strengthBar');
    let currentVal = 0;

    setTimeout(() => {
        if (strengthBar) strengthBar.style.width = `${strengthTarget}%`;
        const counterInterval = setInterval(() => {
            currentVal += 1;
            if (currentVal >= strengthTarget) {
                strengthEl.innerText = `${strengthTarget}%`;
                clearInterval(counterInterval);
            } else {
                strengthEl.innerText = `${currentVal}%`;
            }
        }, 15);
    }, 600);
}

function renderSkills(skills) {
    if (skills.length === 0) return `<p class="text-xs text-slate-400 italic" data-i18n="profile.no_skills">${i18next.t('profile.no_skills', 'No skills added yet.')}</p>`;
    return skills.map(skill => `
        <div class="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 animate-in fade-in zoom-in duration-300">
            ${skill}
            <button class="remove-skill text-slate-400 hover:text-red-500 transition-colors" data-skill="${skill}">
                <span class="material-symbols-outlined text-sm">close</span>
            </button>
        </div>
    `).join('');
}

function renderWorkPreference(value, label, subtext, current, labelKey, subtextKey) {
    const isChecked = current === value;
    return `
        <label class="flex flex-col p-4 border ${isChecked ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-slate-200 bg-slate-50'} rounded-xl cursor-pointer transition-all hover:border-primary/50 group">
            <div class="flex items-start justify-between mb-2">
                <span class="font-bold text-sm text-slate-900" data-i18n="${labelKey}">${label}</span>
                <input type="radio" name="work_pref" value="${value}" ${isChecked ? 'checked' : ''} class="accent-primary size-4 cursor-pointer">
            </div>
            <p class="text-[10px] text-slate-500 leading-relaxed" data-i18n="${subtextKey}">${subtext}</p>
        </label>
    `;
}
