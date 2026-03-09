export const renderPersonalInfo = (profile) => {
  return `
    <section class="card section-entrance p-10 space-y-10" id="personalInfoSection">
      <div class="flex items-center gap-4 border-b border-slate-100 pb-8">
        <div class="size-12 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
          <span class="material-symbols-outlined text-primary text-3xl">badge</span>
        </div>
        <div class="space-y-1">
          <h3 class="text-2xl font-black text-slate-900 tracking-tight">Personal Intelligence</h3>
          <p class="text-xs text-slate-500 font-bold uppercase tracking-widest">Base Identity and Educational Records</p>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
        <div class="space-y-2">
          <label class="label">Full Name</label>
          <input type="text" id="fullNameInput" class="input-field" value="${profile.full_name || ''}" placeholder="Enter your full name">
          <p class="helper-text">Official name for AI certification.</p>
        </div>
        <div class="space-y-2">
          <label class="label">University / College</label>
          <input type="text" id="universityInput" class="input-field" value="${profile.university || ''}" placeholder="e.g. Amity University">
          <p class="helper-text">Primary institution of study.</p>
        </div>
        <div class="space-y-2">
          <label class="label">Education Level</label>
          <input type="text" id="educationInput" class="input-field" value="${profile.education || ''}" placeholder="e.g. B.Tech Computer Science">
          <p class="helper-text">Degree or specialization.</p>
        </div>
        <div class="space-y-2">
          <label class="label">Graduation Year</label>
          <input type="number" id="graduationYearInput" class="input-field" value="${profile.graduation_year || ''}" placeholder="2024">
          <p class="helper-text">Year of graduation.</p>
        </div>
        <div class="md:col-span-2 mt-8 pt-8 border-t border-slate-100/60 space-y-4">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
               <span class="material-symbols-outlined text-primary text-xl">auto_awesome</span>
               <label class="label mb-0 text-sm">Executive Bio</label>
            </div>
            <p class="helper-text">Refine your summary for the AI matching engine.</p>
          </div>
          <textarea id="bioInput" 
            class="w-full h-[124px] rounded-xl border border-slate-200 p-[14px] text-sm bg-white resize-none overflow-hidden focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200 leading-relaxed"
            placeholder="E.g. Passionate software engineer with expertise in AI-driven systems and scalable architectures..."
          >${profile.bio || ''}</textarea>
        </div>
      </div>
    </section>
  `;
};
