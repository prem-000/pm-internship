export const renderLogs = async (container) => {
    container.innerHTML = `
        <div class="flex items-center justify-between mb-8">
            <div>
                <h3 class="text-lg font-black text-text-main uppercase tracking-tight">System Terminal</h3>
                <p class="text-[10px] text-text-muted font-bold uppercase tracking-widest">Real-time log stream from AIRE core services</p>
            </div>
            <div class="flex gap-4">
                <button id="pause-logs" class="bg-white hover:bg-bg-light text-text-main px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all border border-border-color shadow-sm">
                    <span class="material-symbols-outlined text-sm">pause</span>
                    Pause Stream
                </button>
                <button id="clear-logs" class="bg-white hover:bg-bg-light text-text-main px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all border border-border-color shadow-sm">
                    <span class="material-symbols-outlined text-sm">delete_sweep</span>
                    Clear View
                </button>
                <button class="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-primary/20">
                    <span class="material-symbols-outlined text-sm">download</span>
                    Export Audit Trail
                </button>
            </div>
        </div>

        <div class="glass-panel overflow-hidden flex flex-col h-[calc(100vh-250px)]">
            <div class="bg-bg-light border-b border-border-color p-4 flex items-center justify-between">
                <div class="flex items-center gap-4">
                    <div class="flex items-center gap-2">
                        <div class="size-2 rounded-full bg-success animate-pulse"></div>
                        <span class="text-[10px] font-black text-text-main uppercase tracking-tighter">Connection: <span class="text-success">VIRTUAL_V_2.1</span></span>
                    </div>
                </div>
                <div class="flex gap-4">
                    <span class="text-[10px] font-black text-text-muted uppercase tracking-widest">Protocol Filters: </span>
                    <label class="flex items-center gap-2 cursor-pointer group">
                        <input type="checkbox" checked class="accent-primary size-3">
                        <span class="text-[9px] font-black text-primary uppercase group-hover:opacity-100 opacity-70">Info</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer group">
                        <input type="checkbox" checked class="accent-warning size-3">
                        <span class="text-[9px] font-black text-warning uppercase group-hover:opacity-100 opacity-70">Warn</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer group">
                        <input type="checkbox" checked class="accent-danger size-3">
                        <span class="text-[9px] font-black text-danger uppercase group-hover:opacity-100 opacity-70">Error</span>
                    </label>
                </div>
            </div>
            
            <div id="log-terminal" class="flex-1 overflow-y-auto p-6 log-stream bg-white scroll-smooth cursor-text">
                <div class="text-text-muted italic opacity-50 text-[10px] mb-4">Initializing AIRE Operational Log Stream [Kernel: 5.15.0-AIRE]...</div>
            </div>
        </div>
    `;

    const terminal = document.getElementById('log-terminal');
    let isPaused = false;
    let ws = null;

    const connectWS = () => {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.hostname === 'localhost' ? 'localhost:8000' : 'pm-internship-u7yf.onrender.com';
        ws = new WebSocket(`${protocol}//${host}/api/admin/ws/logs`);

        ws.onmessage = (event) => {
            if (isPaused) return;

            const data = JSON.parse(event.data);
            if (data.stream !== 'logs') return;

            const entry = document.createElement('div');
            entry.className = `log-entry log-${data.level}`;
            entry.innerHTML = `
                <span class="opacity-40 font-bold mr-3">[${new Date(data.timestamp).toLocaleTimeString()}]</span>
                <span class="font-black mr-3 ${data.level === 'ERROR' ? 'text-danger' : data.level === 'WARN' ? 'text-warning' : 'text-primary'} uppercase">[${data.level}]</span>
                <span>${data.message}</span>
            `;

            terminal.appendChild(entry);
            terminal.scrollTop = terminal.scrollHeight;

            if (terminal.childNodes.length > 500) {
                terminal.removeChild(terminal.firstChild);
            }
        };

        ws.onclose = () => {
            if (window.location.hash === '#/logs') {
                setTimeout(connectWS, 2000);
            }
        };
    };

    connectWS();

    document.getElementById('pause-logs').addEventListener('click', (e) => {
        isPaused = !isPaused;
        e.currentTarget.innerHTML = isPaused ?
            '<span class="material-symbols-outlined text-sm">play_arrow</span> Resume Stream' :
            '<span class="material-symbols-outlined text-sm">pause</span> Pause Stream';
        e.currentTarget.classList.toggle('text-accent', isPaused);
        e.currentTarget.classList.toggle('bg-accent/5', isPaused);
        e.currentTarget.classList.toggle('border-accent/40', isPaused);
    });

    document.getElementById('clear-logs').addEventListener('click', () => {
        terminal.innerHTML = '<div class="text-text-muted italic opacity-50 text-[10px] mb-4">Buffer cleared by operator. Resetting monitoring sequence...</div>';
    });

    window.addEventListener('hashchange', () => {
        if (ws) ws.close();
    }, { once: true });
};
