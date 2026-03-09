import store from '../js/store.js';
import { api } from '../services/api.js';
import { toast } from '../components/toast.js';
import { renderSidebar } from '../components/sidebar.js';
import { renderTopBar } from '../components/mobileNav.js';

// Components
import { renderProfileHeader } from '../components/profileHeader.js';
import { renderResumeDropzone } from '../components/resumeDropzone.js';
import { renderResumeModal } from '../components/resumeModal.js';
import { renderPersonalInfo } from '../components/personalInfo.js';
import { renderSkillsManager, renderSkillsList } from '../components/skillsManager.js';
import { renderPreferences } from '../components/preferences.js';
import { renderLinksSection } from '../components/linksSection.js';

export const renderProfile = async (container) => {
    // Skeleton / Loader
    container.innerHTML = `
        <div class="flex items-center justify-center min-vh-100 bg-background-light">
            <div class="flex flex-col items-center gap-10">
                <div class="size-20 relative">
                    <div class="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
                    <div class="size-20 bg-primary rounded-full flex items-center justify-center relative z-10 shadow-2xl shadow-primary/30">
                        <span class="material-symbols-outlined text-white text-5xl">bolt</span>
                    </div>
                </div>
                <div class="text-center space-y-2">
                    <h3 class="text-slate-900 font-black text-2xl tracking-tight uppercase tracking-[0.2em]">AIRE HUB</h3>
                    <p class="text-slate-500 text-sm font-bold animate-pulse uppercase tracking-widest">Synchronizing Intelligence Framework...</p>
                </div>
            </div>
        </div>
    `;

    try {
        const profileData = await api.get('/user/profile');
        store.profile = profileData;
        renderMainLayout(container, store.user, profileData);
    } catch (err) {
        toast.error("Failed to load profile data.");
        console.error(err);
    }
};

const renderMainLayout = (container, user, profile) => {
    let currentSkills = [...(profile?.skills || [])];

    container.innerHTML = `
        <div class="flex flex-col lg:flex-row min-h-screen relative overflow-hidden bg-background-light font-display">
            <!-- Sidebar Navigation -->
            ${renderSidebar('#/profile')}

            <!-- Main Content Area -->
            <main class="flex-1 flex flex-col min-w-0 lg:ml-72 ml-0 pb-24 lg:pb-8">
                <!-- Mobile Top Bar -->
                ${renderTopBar(i18next.t('nav.profile'))}

                <!-- Context Header -->
                <header class="h-24 lg:h-28 border-b border-slate-200 bg-white/40 backdrop-blur-xl flex items-center justify-between px-10 sticky top-0 z-[60]">
                    <div class="flex items-center gap-4">
                        <div class="size-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
                             <span class="material-symbols-outlined text-white text-2xl">grid_view</span>
                        </div>
                        <h2 class="text-2xl font-black text-slate-900 tracking-tight">Intelligence Workspace</h2>
                    </div>
                    <div class="flex items-center gap-6">
                        <button id="discardChangesBtn" class="px-6 py-3 text-xs font-black text-slate-400 hover:text-slate-600 transition-all uppercase tracking-[0.2em]">
                           Discard
                        </button>
                        <button id="saveAllChangesBtn" class="btn-primary px-10 py-5 text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/30">
                            <span class="material-symbols-outlined text-xl">save</span>
                            Save Intelligence
                        </button>
                    </div>
                </header>

                <!-- Scrollable Content -->
                <div class="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-12 scrollbar-hide">
                    <div class="max-w-[1400px] mx-auto">
                        <div class="grid grid-cols-1 xl:grid-cols-12 gap-12">
                            <!-- Left Column: Core Identity and AI Features (8 cols) -->
                            <div class="xl:col-span-8 space-y-12">
                                <div id="headerSection">
                                    ${renderProfileHeader(user, profile)}
                                </div>

                                <div id="resumeSection">
                                    ${renderResumeDropzone()}
                                </div>

                                <div id="personalSection">
                                    ${renderPersonalInfo(profile)}
                                </div>

                                <div id="skillsSection">
                                    ${renderSkillsManager(currentSkills)}
                                </div>
                            </div>

                            <!-- Right Column: Preferences and Integration (4 cols) -->
                            <div class="xl:col-span-4 space-y-12">
                                <div id="preferencesSection">
                                    ${renderPreferences(profile)}
                                </div>

                                <div id="linksSection">
                                    ${renderLinksSection(profile)}
                                </div>
                            </div>
                        </div>
                        
                        <!-- Bottom Spacer -->
                        <div class="h-20"></div>
                    </div>
                </div>
            </main>
        </div>
        
        <div id="modalContainer"></div>
    `;

    setupInteractions(container, profile, currentSkills);
    triggerEntranceAnimations(container);
};

const setupInteractions = (container, profile, currentSkills) => {
    // --- Skills Management ---
    const updateSkillsUI = () => {
        const skillsList = container.querySelector('#skillsList');
        if (skillsList) {
            skillsList.innerHTML = renderSkillsList(currentSkills);
            bindSkillRemovers();
        }
    };

    const bindSkillRemovers = () => {
        container.querySelectorAll('.remove-skill-btn').forEach(btn => {
            btn.onclick = () => {
                const skill = btn.dataset.skill;
                currentSkills = currentSkills.filter(s => s !== skill);
                updateSkillsUI();
            };
        });
    };

    const addSkillBtn = container.querySelector('#addSkillBtn');
    const skillInput = container.querySelector('#skillInput');

    if (addSkillBtn && skillInput) {
        addSkillBtn.onclick = () => {
            const val = skillInput.value.trim();
            if (val && !currentSkills.includes(val)) {
                currentSkills.push(val);
                skillInput.value = '';
                updateSkillsUI();
                toast.success(`Skill "${val}" added`);
            }
        };
        skillInput.onkeypress = (e) => {
            if (e.key === 'Enter') addSkillBtn.click();
        };
    }
    bindSkillRemovers();

    // --- Save All Changes ---
    const saveBtn = container.querySelector('#saveAllChangesBtn');
    if (saveBtn) {
        saveBtn.onclick = async () => {
            const originalContent = saveBtn.innerHTML;
            saveBtn.disabled = true;
            saveBtn.innerHTML = `<span class="size-5 border-3 border-white border-t-transparent rounded-full animate-spin"></span> Syncing...`;

            try {
                const getVal = (id) => container.querySelector(id)?.value?.trim() || "";
                const getRadio = (name) => container.querySelector(`input[name="${name}"]:checked`)?.value || "remote";

                const payload = {
                    full_name: getVal('#fullNameInput'),
                    university: getVal('#universityInput'),
                    education: getVal('#educationInput'),
                    graduation_year: parseInt(getVal('#graduationYearInput')) || null,
                    bio: getVal('#bioInput'),
                    skills: currentSkills,
                    target_roles: [getVal('#targetRoleInput')],
                    preferred_sector: container.querySelector('#sectorSelect')?.value || "Tech",
                    preferred_location: getRadio('workMode'),
                    linkedin_url: getVal('#linkedinUrl'),
                    github_url: getVal('#githubUrl'),
                    portfolio_url: getVal('#portfolioUrl'),
                };

                await api.put('/user/profile/update', payload);
                toast.success("Intelligence successfully synchronized with AIRE Hub.");
                setTimeout(() => renderProfile(container), 800);
            } catch (err) {
                toast.error(err.message || "Failed to synchronize profile core.");
                saveBtn.disabled = false;
                saveBtn.innerHTML = originalContent;
            }
        };
    }

    const discardBtn = container.querySelector('#discardChangesBtn');
    if (discardBtn) {
        discardBtn.onclick = () => renderProfile(container);
    }

    // --- Resume Upload Workflow ---
    const resumeInput = container.querySelector('#resumeUploadInput');
    const triggerBtn = container.querySelector('#triggerUploadBtn');
    const resumeZone = container.querySelector('#resumeZone');
    const overlay = container.querySelector('#dropZoneOverlay');

    if (triggerBtn && resumeInput) {
        triggerBtn.onclick = () => resumeInput.click();
        resumeInput.onchange = (e) => {
            if (e.target.files.length > 0) handleResumeUpload(container, e.target.files[0]);
        };
    }

    if (resumeZone && overlay) {
        resumeZone.ondragover = (e) => {
            e.preventDefault();
            overlay.classList.remove('opacity-0', 'pointer-events-none');
            overlay.classList.add('opacity-100');
        };
        overlay.ondragleave = () => {
            overlay.classList.add('opacity-0', 'pointer-events-none');
            overlay.classList.remove('opacity-100');
        };
        overlay.ondrop = (e) => {
            e.preventDefault();
            overlay.classList.add('opacity-0', 'pointer-events-none');
            if (e.dataTransfer.files.length > 0) handleResumeUpload(container, e.dataTransfer.files[0]);
        };
    }
};

const handleResumeUpload = async (container, file) => {
    const dropzoneContent = container.querySelector('#dropzoneContent');
    const aiProcessingState = container.querySelector('#aiProcessingState');
    const processingStep = container.querySelector('#processingStep');
    const resumeZone = container.querySelector('#resumeZone');

    if (!dropzoneContent || !aiProcessingState || !processingStep) return;

    // Enter AI Processing Mode
    dropzoneContent.classList.add('hidden');
    aiProcessingState.classList.remove('hidden');
    resumeZone.classList.add('bg-primary/5', 'border-primary/20', 'animate-pulse');

    const steps = [
        "Initializing Intelligence Engine...",
        "Analyzing Resume Topology...",
        "Extracting Skill Identity...",
        "Mapping Experience Network...",
        "Finalizing Profile Sync..."
    ];

    let currentStep = 0;
    const stepInterval = setInterval(() => {
        if (currentStep < steps.length - 1) {
            currentStep++;
            processingStep.innerText = steps[currentStep];
        }
    }, 1200);

    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post('/profile/parse-resume', formData, true);
        if (response.status === 'success') {
            renderVerificationModal(container, response.data);
        }
    } catch (err) {
        toast.error("Resume analysis failed.");
        dropzoneContent.classList.remove('hidden');
        aiProcessingState.classList.add('hidden');
        resumeZone.classList.remove('bg-primary/5', 'border-primary/20', 'animate-pulse');
    } finally {
        clearInterval(stepInterval);
    }
};

const renderVerificationModal = (container, data) => {
    const modalContainer = container.querySelector('#modalContainer');
    modalContainer.innerHTML = renderResumeModal(data);

    const modal = container.querySelector('#resumeVerificationModal');
    const closeBtn = modal.querySelector('#closeModalBtn');
    const confirmBtn = modal.querySelector('#confirmMergeBtn');

    closeBtn.onclick = () => {
        modal.remove();
        // Reset dropzone
        const dropzoneContent = container.querySelector('#dropzoneContent');
        const aiProcessingState = container.querySelector('#aiProcessingState');
        const resumeZone = container.querySelector('#resumeZone');
        if (dropzoneContent && aiProcessingState && resumeZone) {
            dropzoneContent.classList.remove('hidden');
            aiProcessingState.classList.add('hidden');
            resumeZone.classList.remove('bg-primary/5', 'border-primary/20', 'animate-pulse');
        }
    };

    confirmBtn.onclick = async () => {
        confirmBtn.disabled = true;
        confirmBtn.innerHTML = `<span class="size-5 border-3 border-white border-t-transparent rounded-full animate-spin"></span> Syncing...`;

        try {
            const refinedData = {
                full_name: modal.querySelector('#modalName').value.trim(),
                education: modal.querySelector('#modalEducation').value.trim(),
                skills: Array.from(modal.querySelectorAll('#modalSkillsContainer > span')).map(s => s.innerText.replace('close', '').trim()),
                projects: Array.from(modal.querySelectorAll('#modalProjectsContainer p')).map(p => p.innerText.trim())
            };

            const response = await api.post('/profile/confirm-resume-data', refinedData);
            if (response.status === 'success') {
                toast.success("Intelligence merged successfully!");
                modal.remove();
                renderProfile(container);
            }
        } catch (err) {
            toast.error("Merge failed.");
            confirmBtn.disabled = false;
            confirmBtn.innerHTML = `<span class="material-symbols-outlined text-xl">verified_user</span> Confirm & Sync Profile`;
        }
    };
};

const triggerEntranceAnimations = (container) => {
    // 1. Progress Bar Animation
    setTimeout(() => {
        const bar = container.querySelector('#strengthBar');
        if (bar) {
            bar.style.width = bar.getAttribute('data-target-width');
        }
    }, 400);

    // 2. Section Staggered Entrance
    const sections = container.querySelectorAll('.section-entrance');
    sections.forEach((section, i) => {
        setTimeout(() => {
            section.classList.add('show');
        }, 100 + (i * 120));
    });
};
