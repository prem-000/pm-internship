export const renderPreferences = (profile) => {
  const mode = (profile.location_preference || 'hybrid').toLowerCase();

  return `
    <section class="card section-entrance p-10 space-y-10" id="preferencesSection">
      <div class="flex items-center gap-4 border-b border-slate-100 pb-8">
        <div class="size-12 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
          <span class="material-symbols-outlined text-primary text-3xl">explore</span>
        </div>
        <div class="space-y-1">
          <h3 class="text-2xl font-black text-slate-900 tracking-tight">Career Preferences</h3>
          <p class="text-[10px] text-slate-500 font-bold uppercase tracking-[0.15em]">System Matching Parameters</p>
        </div>
      </div>
      
      <div class="space-y-10">
        <div class="grid grid-cols-1 gap-8">
          <div class="space-y-2">
            <label class="label">Target Role</label>
            <input type="text" id="targetRoleInput" value="${profile.target_role || ''}" placeholder="e.g. Product Manager, Frontend Engineer" class="input-field">
            <p class="helper-text">Primary role for matching algorithm.</p>
          </div>
          <div class="space-y-2">
            <label class="label">Preferred Sector</label>
            <div class="relative group">
                <select id="sectorSelect" class="input-field appearance-none cursor-pointer pr-12">
                   <option value="Tech" ${profile.preferred_sector === 'Tech' ? 'selected' : ''}>Technology</option>
                   <option value="Finance" ${profile.preferred_sector === 'Finance' ? 'selected' : ''}>Finance</option>
                   <option value="Healthcare" ${profile.preferred_sector === 'Healthcare' ? 'selected' : ''}>Healthcare</option>
                   <option value="Consumer" ${profile.preferred_sector === 'Consumer' ? 'selected' : ''}>Consumer Goods</option>
                   <option value="Manufacturing" ${profile.preferred_sector === 'Manufacturing' ? 'selected' : ''}>Manufacturing</option>
                </select>
                <span class="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-primary transition-colors">expand_more</span>
            </div>
          </div>
        </div>

        <div class="space-y-4 pt-4">
          <label class="label">Work Mode Integration</label>
          <div class="grid grid-cols-1 gap-4">
            <label class="relative group cursor-pointer">
              <input type="radio" name="workMode" value="remote" class="peer hidden" ${mode === 'remote' ? 'checked' : ''}>
              <div class="flex items-center gap-5 p-6 rounded-2xl border border-slate-100 bg-slate-50 text-slate-500 transition-all duration-300 peer-checked:bg-white peer-checked:border-primary peer-checked:shadow-xl peer-checked:shadow-primary/10 peer-checked:-translate-y-1 hover:border-slate-200">
                <div class="size-16 bg-white border border-slate-100 rounded-2xl flex items-center justify-center shrink-0 peer-checked:bg-primary/10 transition-colors">
                    <span class="material-symbols-outlined text-4xl group-hover:scale-110 transition-transform">home_work</span>
                </div>
                <div class="space-y-0.5 flex-1">
                    <p class="text-lg font-black text-slate-800 peer-checked:text-primary transition-colors">Remote</p>
                    <p class="text-sm font-medium text-slate-400">Collaborate digitally from anywhere.</p>
                </div>
                <span class="material-symbols-outlined text-emerald-500 text-3xl opacity-0 peer-checked:opacity-100 transition-all -translate-x-4 peer-checked:translate-x-0">check_circle</span>
              </div>
            </label>
            
            <label class="relative group cursor-pointer">
              <input type="radio" name="workMode" value="hybrid" class="peer hidden" ${mode === 'hybrid' ? 'checked' : ''}>
              <div class="flex items-center gap-5 p-6 rounded-2xl border border-slate-100 bg-slate-50 text-slate-500 transition-all duration-300 peer-checked:bg-white peer-checked:border-primary peer-checked:shadow-xl peer-checked:shadow-primary/10 peer-checked:-translate-y-1 hover:border-slate-200">
                <div class="size-16 bg-white border border-slate-100 rounded-2xl flex items-center justify-center shrink-0 peer-checked:bg-primary/10 transition-colors">
                    <span class="material-symbols-outlined text-4xl group-hover:scale-110 transition-transform">corporate_fare</span>
                </div>
                <div class="space-y-0.5 flex-1">
                    <p class="text-lg font-black text-slate-800 peer-checked:text-primary transition-colors">Hybrid</p>
                    <p class="text-sm font-medium text-slate-400">Mix of on-site and remote work.</p>
                </div>
                 <span class="material-symbols-outlined text-emerald-500 text-3xl opacity-0 peer-checked:opacity-100 transition-all -translate-x-4 peer-checked:translate-x-0">check_circle</span>
              </div>
            </label>
            
            <label class="relative group cursor-pointer">
              <input type="radio" name="workMode" value="onsite" class="peer hidden" ${mode === 'onsite' ? 'checked' : ''}>
              <div class="flex items-center gap-5 p-6 rounded-2xl border border-slate-100 bg-slate-50 text-slate-500 transition-all duration-300 peer-checked:bg-white peer-checked:border-primary peer-checked:shadow-xl peer-checked:shadow-primary/10 peer-checked:-translate-y-1 hover:border-slate-200">
                <div class="size-16 bg-white border border-slate-100 rounded-2xl flex items-center justify-center shrink-0 peer-checked:bg-primary/10 transition-colors">
                    <span class="material-symbols-outlined text-4xl group-hover:scale-110 transition-transform">apartment</span>
                </div>
                <div class="space-y-0.5 flex-1">
                    <p class="text-lg font-black text-slate-800 peer-checked:text-primary transition-colors">Onsite</p>
                    <p class="text-sm font-medium text-slate-400">Regular on-site office requirements.</p>
                </div>
                 <span class="material-symbols-outlined text-emerald-500 text-3xl opacity-0 peer-checked:opacity-100 transition-all -translate-x-4 peer-checked:translate-x-0">check_circle</span>
              </div>
            </label>
          </div>
        </div>
      </div>
    </section>
  `;
};
