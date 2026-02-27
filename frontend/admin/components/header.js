export const renderHeader = (title) => {
    return `
        <div class="flex-1">
            <h2 class="text-xl font-black tracking-tight text-text-main uppercase">${title}</h2>
            <div class="flex items-center gap-2 mt-1">
                <div class="size-1.5 rounded-full bg-success"></div>
                <p class="text-[10px] text-text-muted font-bold uppercase tracking-widest">System Synchronized</p>
            </div>
        </div>

        <div class="flex items-center gap-6">
            <div class="flex items-center gap-4">
                <!-- Profile -->
                <div class="flex items-center gap-3 cursor-pointer group">
                    <div class="text-right hidden sm:block">
                        <p class="text-xs font-black text-text-main leading-none">ROOT_ADMIN</p>
                        <p class="text-[9px] text-accent font-black uppercase tracking-tighter mt-1 opacity-80">Security Level 5</p>
                    </div>
                    <div class="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:border-primary/40 transition-all overflow-hidden">
                        <img src="https://ui-avatars.com/api/?name=Admin&background=1E3A8A&color=fff" alt="Admin" class="size-full">
                    </div>
                </div>
            </div>
        </div>
    `;
};
