export const renderResumeDropzone = () => {
  return `
    <section class="card section-entrance border-2 border-dashed border-slate-200 p-8 hover:border-primary/50 hover:bg-blue-50/50 transition-all duration-300 group relative overflow-hidden" id="resumeZone">
      <div id="dropzoneContent" class="flex flex-col md:flex-row items-center gap-8 relative z-10 text-center md:text-left">
        <div class="size-24 bg-white rounded-2xl flex items-center justify-center shrink-0 border border-slate-100 shadow-md group-hover:scale-105 group-hover:shadow-primary/10 transition-all duration-500">
           <div class="size-16 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <span class="material-symbols-outlined text-primary text-4xl">cloud_upload</span>
           </div>
        </div>
        <div class="flex-1 space-y-3">
          <div class="space-y-1">
            <h3 class="text-2xl font-black text-slate-900 tracking-tight">AI Resume Suite</h3>
            <p class="text-slate-500 text-sm font-medium leading-relaxed max-w-lg">
                Instantly synchronize your professional intelligence. Our AI engine parses skills and experience directly into your profile core.
            </p>
          </div>
          <div class="flex flex-wrap gap-3 justify-center md:justify-start">
            <span class="px-2.5 py-1 rounded-full border border-slate-200 bg-white text-[10px] font-black text-slate-500 uppercase tracking-widest shadow-sm">PDF / DOCX Max 5MB</span>
            <span class="px-2.5 py-1 rounded-full border border-emerald-100 bg-emerald-50 text-[10px] font-black text-emerald-600 uppercase tracking-widest shadow-sm">AI POWERED SYNC</span>
          </div>
        </div>
        <div class="shrink-0 w-full md:w-auto self-center">
          <input type="file" id="resumeUploadInput" class="hidden" accept=".pdf,.docx">
          <button id="triggerUploadBtn" class="btn-primary w-full shadow-2xl shadow-primary/30 min-w-[200px] transition-all hover:scale-105 py-3.5">
            <span class="material-symbols-outlined text-xl">rocket_launch</span>
            <span class="btn-text">Upload Resume</span>
          </button>
        </div>
      </div>

      <!-- AI Processing State (Hidden by default) -->
      <div id="aiProcessingState" class="hidden flex flex-col items-center justify-center min-h-[220px] text-center space-y-6 animate-fade-in relative z-20">
          <div class="relative">
              <div class="size-20 bg-primary/20 rounded-full animate-ping absolute inset-0"></div>
              <div class="size-20 bg-primary rounded-full flex items-center justify-center relative z-10 shadow-2xl shadow-primary/40 pulse-logo">
                  <span class="material-symbols-outlined text-white text-4xl">bolt</span>
              </div>
          </div>
          <div class="space-y-3">
              <p id="processingStep" class="text-xl font-black text-slate-900 tracking-tight">Initializing Intelligence Engine...</p>
              <div class="flex gap-2 justify-center">
                  <span class="size-1.5 bg-primary rounded-full animate-bounce delay-75"></span>
                  <span class="size-1.5 bg-primary rounded-full animate-bounce delay-150"></span>
                  <span class="size-1.5 bg-primary rounded-full animate-bounce delay-300"></span>
              </div>
          </div>
      </div>

      <!-- Drop Zone Overlay -->
      <div id="dropZoneOverlay" class="absolute inset-0 bg-primary/95 flex flex-col items-center justify-center text-white p-8 opacity-0 pointer-events-none scale-105 transition-all duration-300 z-50 rounded-2xl backdrop-blur-md">
         <span class="material-symbols-outlined text-9xl mb-6 animate-bounce">upload_file</span>
         <p class="text-4xl font-black tracking-tight">Drop Resume Here</p>
         <p class="text-slate-200 mt-3 font-medium text-lg uppercase tracking-widest">Processing Starts Automatically</p>
      </div>
    </section>
  `;
};
