export const renderProfileHeader = (userData, profileData) => {
  const strength = profileData?.profile_strength || 0;
  const lastUpdate = profileData?.last_updated
    ? new Date(profileData.last_updated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Never';

  return `
    <header class="section-entrance flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10" id="profileHeader">
      <div class="flex items-center gap-6">
        <div class="size-20 bg-white rounded-2xl flex items-center justify-center border border-slate-200 shadow-sm relative overflow-hidden group shrink-0">
          <div class="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors"></div>
          <span class="material-symbols-outlined text-primary text-5xl relative z-10">person</span>
        </div>
        <div class="space-y-1">
          <h2 class="text-4xl font-black text-slate-900 tracking-tight leading-none">
            ${profileData?.full_name || userData?.full_name || 'Alumni'}
          </h2>
          <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <p class="text-slate-500 font-medium flex items-center gap-1.5 text-sm">
                <span class="material-symbols-outlined text-base">mail</span>
                ${userData?.email || 'user@aire.dev'}
            </p>
            <span class="hidden sm:block text-slate-300">•</span>
            <p class="text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
                <span class="material-symbols-outlined text-base">history</span>
                Sync: ${lastUpdate}
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm min-w-[320px] hover:shadow-md transition-all duration-300">
        <div class="flex justify-between items-center mb-3">
          <span class="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">System Maturity</span>
          <span class="text-lg font-black text-primary">${strength}%</span>
        </div>
        <div class="h-3 w-full bg-slate-100 rounded-full overflow-hidden p-0.5">
          <div id="strengthBar" 
            class="h-full bg-primary rounded-full transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_0_12px_rgba(59,130,246,0.4)]" 
            style="width: 0%" data-target-width="${strength}%">
          </div>
        </div>
        <div class="flex items-center gap-2 mt-3">
            <span class="size-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <p class="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
               Elite Candidate Profile Verified
            </p>
        </div>
      </div>
    </header>
  `;
};
