export const renderResumeModal = (data) => {
  return `
    <div id="resumeVerificationModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-scale-up border border-slate-200">
            <!-- Header -->
            <div class="px-8 py-6 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
                <div>
                    <h3 class="text-2xl font-black text-slate-900 tracking-tight">Verify AI Extraction</h3>
                    <p class="text-slate-500 text-sm font-medium mt-1">Review and refine the information extracted from your resume.</p>
                </div>
                <div class="size-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <span class="material-symbols-outlined text-primary">data_object</span>
                </div>
            </div>

            <!-- Content -->
            <div class="p-8 overflow-y-auto space-y-8 scrollbar-hide">
                <!-- Personal Info Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-2">
                        <label class="label">Full Name</label>
                        <input type="text" id="modalName" class="input-field" value="${data.full_name || ''}">
                    </div>
                    <div class="space-y-2">
                        <label class="label">Education</label>
                        <input type="text" id="modalEducation" class="input-field" value="${data.education || ''}" placeholder="e.g. B.Tech Computer Science">
                    </div>
                </div>

                <!-- Skills Section -->
                <div class="space-y-4">
                    <div class="flex items-center justify-between">
                        <label class="label mb-0">Extracted Skills</label>
                        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">${data.skills?.length || 0} identified</span>
                    </div>
                    <div class="flex flex-wrap gap-2" id="modalSkillsContainer">
                        ${data.skills?.map(skill => `
                            <span class="group flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold border border-blue-100 hover:scale-105 transition-transform duration-200">
                                ${skill}
                                <button onclick="this.parentElement.remove()" class="material-symbols-outlined text-sm opacity-50 group-hover:opacity-100 hover:text-red-500 transition-all">close</button>
                            </span>
                        `).join('')}
                    </div>
                </div>

                <!-- Experience/Projects -->
                <div class="space-y-4">
                    <label class="label">Project Highlights</label>
                    <div class="space-y-3" id="modalProjectsContainer">
                        ${data.projects?.map(project => `
                            <div class="group relative bg-slate-50 rounded-xl p-4 border border-slate-100 hover:border-primary/20 hover:bg-white transition-all duration-300">
                                <button onclick="this.parentElement.remove()" class="absolute -top-2 -right-2 size-6 bg-white border border-slate-200 text-slate-400 rounded-full flex items-center justify-center hover:text-red-500 hover:border-red-200 opacity-0 group-hover:opacity-100 transition-all shadow-sm">
                                    <span class="material-symbols-outlined text-sm">close</span>
                                </button>
                                <p class="text-sm font-bold text-slate-800">${project}</p>
                            </div>
                        `).join('') || '<p class="text-slate-400 text-sm italic">No projects extracted</p>'}
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="px-8 py-5 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row gap-3 justify-end shrink-0">
                <button id="closeModalBtn" class="btn-secondary">
                    Cancel
                </button>
                <button id="confirmMergeBtn" class="btn-primary">
                    <span class="material-symbols-outlined text-lg">verified_user</span>
                    Confirm & Sync Profile
                </button>
            </div>
        </div>
    </div>
  `;
};
