export const renderSkillsManager = (skills = []) => {
  return `
    <section class="card section-entrance p-10 space-y-10" id="skillsManagerSection">
      <div class="flex items-center gap-4 border-b border-slate-100 pb-8">
        <div class="size-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0 border border-indigo-100/50">
          <span class="material-symbols-outlined text-3xl">psychology</span>
        </div>
        <div class="space-y-1">
          <h3 class="text-2xl font-black text-slate-900 tracking-tight">Skills Matrix</h3>
          <p class="text-xs text-slate-500 font-bold uppercase tracking-widest">Map your technical competencies.</p>
        </div>
      </div>
      
      <div class="space-y-10">
        <div class="flex flex-col sm:flex-row items-center gap-4">
           <div class="flex-1 w-full relative">
              <input type="text" id="skillInput" class="input-field rounded-full pl-12 h-14 w-full shadow-inner" placeholder="Type a skill and press Enter">
              <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
           </div>
           <button id="addSkillBtn" class="size-14 bg-primary text-white rounded-full flex items-center justify-center shrink-0 hover:bg-primary/90 transition-all active:scale-95 shadow-xl shadow-primary/20">
             <span class="material-symbols-outlined text-2xl">add</span>
           </button>
        </div>
        
        <div id="skillsList" class="flex flex-wrap gap-4 min-h-[140px] p-10 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
          ${renderSkillsList(skills)}
        </div>
      </div>
    </section>
  `;
};

export const renderSkillsList = (skills) => {
  if (!skills || skills.length === 0) {
    return `<p class="text-slate-400 text-sm italic font-medium p-4 text-center w-full">No intelligence detected. Populating with AI or manual input recommended.</p>`;
  }

  return skills.map(skill => `
    <div class="group flex items-center gap-3 px-6 py-2.5 bg-white border border-slate-200 rounded-full text-sm font-bold text-slate-700 shadow-sm hover:border-primary/50 hover:scale-105 hover:shadow-md transition-all duration-300 animate-scale-up">
      ${skill}
      <button class="remove-skill-btn size-5 rounded-full bg-slate-100 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 transition-all" data-skill="${skill}">
        <span class="material-symbols-outlined text-[14px]">close</span>
      </button>
    </div>
  `).join('');
};
