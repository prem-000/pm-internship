export const renderLinksSection = (profile) => {
  return `
    <section class="card section-entrance p-10 space-y-10" id="linksSection">
      <div class="flex items-center gap-4 border-b border-slate-100 pb-8">
        <div class="size-12 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
          <span class="material-symbols-outlined text-primary text-3xl">link</span>
        </div>
        <div class="space-y-1">
          <h3 class="text-2xl font-black text-slate-900 tracking-tight">Professional Links</h3>
          <p class="text-[10px] text-slate-500 font-bold uppercase tracking-[0.15em]">Connect Your Professional Presence</p>
        </div>
      </div>
      
      <div class="space-y-6">
        <div class="group">
          <label class="label">LinkedIn Profile</label>
          <div class="relative flex items-center">
            <div class="absolute left-0 w-14 h-full flex items-center justify-center border-r border-slate-200 text-slate-400 group-hover:text-primary transition-colors pointer-events-none">
                <span class="material-symbols-outlined text-xl">public</span>
            </div>
            <input type="url" id="linkedinUrl" class="input-field pl-16 w-full" placeholder="linkedin.com/in/username" value="${profile.linkedin_url || ''}">
          </div>
        </div>
        
        <div class="group">
          <label class="label">GitHub Portfolio</label>
          <div class="relative flex items-center">
            <div class="absolute left-0 w-14 h-full flex items-center justify-center border-r border-slate-200 text-slate-400 group-hover:text-primary transition-colors pointer-events-none">
                <span class="material-symbols-outlined text-xl">code</span>
            </div>
            <input type="url" id="githubUrl" class="input-field pl-16 w-full" placeholder="github.com/username" value="${profile.github_url || ''}">
          </div>
        </div>
        
        <div class="group">
          <label class="label">Personal Portfolio</label>
          <div class="relative flex items-center">
            <div class="absolute left-0 w-14 h-full flex items-center justify-center border-r border-slate-200 text-slate-400 group-hover:text-primary transition-colors pointer-events-none">
                <span class="material-symbols-outlined text-xl">language</span>
            </div>
            <input type="url" id="portfolioUrl" class="input-field pl-16 w-full" placeholder="yourportfolio.com" value="${profile.portfolio_url || ''}">
          </div>
        </div>
      </div>
      <p class="text-center text-xs text-slate-400 font-medium">Digital presence used for AI-based semantic validation.</p>
    </section>
  `;
};
