import { api } from '../js/api.js';

export const renderUsers = async (container) => {
    // 1. Module State
    const filterState = {
        search: '',
        status: 'all', // all, flagged, operational
        loading: false
    };

    // 2. Main Layout Template
    container.innerHTML = `
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <div>
                <div class="flex items-center gap-2 mb-1">
                    <h3 class="text-xl font-black text-text-main uppercase tracking-tight">Personnel Intelligence</h3>
                    <div id="filter-indicator" class="hidden px-2 py-0.5 bg-primary/10 text-primary text-[8px] font-black uppercase rounded-full border border-primary/20 animate-pulse">
                        Filtering Active
                    </div>
                </div>
                <p class="text-[10px] text-text-muted font-bold uppercase tracking-widest flex items-center gap-2">
                    <span class="size-1.5 bg-success rounded-full"></span> 
                    Global user database and security oversight
                    <span id="results-count" class="ml-2 text-primary/60 lowercase italic font-medium"></span>
                </p>
            </div>
            
            <div class="flex items-center gap-3 w-full md:w-auto">
                <!-- Search Bar -->
                <div class="relative flex-1 md:flex-none">
                    <div class="flex items-center gap-3 bg-white border border-border-color pl-4 pr-2 py-2 rounded-xl group focus-within:border-primary/40 focus-within:shadow-lg focus-within:shadow-primary/5 transition-all w-full md:w-64">
                        <span id="search-icon" class="material-symbols-outlined text-sm text-text-muted group-focus-within:text-primary transition-colors">search</span>
                        <input type="text" id="user-search" placeholder="Search by name or email..." 
                            class="bg-transparent border-none text-xs focus:ring-0 flex-1 text-text-main placeholder:text-text-muted font-semibold h-6">
                        <button id="clear-search" class="hidden p-1 hover:bg-bg-light rounded-md text-text-muted transition-all">
                            <span class="material-symbols-outlined text-sm">close</span>
                        </button>
                    </div>
                    <div id="search-loader" class="absolute -bottom-1 left-4 right-4 h-0.5 bg-primary/20 rounded-full overflow-hidden opacity-0 transition-opacity">
                        <div class="h-full bg-primary w-1/2 animate-shimmer"></div>
                    </div>
                </div>

                <!-- Operations Dropdown -->
                <div class="relative" id="ops-dropdown-container">
                    <button id="ops-dropdown-btn" class="bg-white border border-border-color px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-bg-light text-text-main transition-all flex items-center gap-2 shadow-sm whitespace-nowrap group">
                        <span class="material-symbols-outlined text-sm text-text-muted group-hover:text-primary transition-colors">tune</span>
                        Operations
                        <span class="material-symbols-outlined text-xs text-text-muted group-hover:translate-y-0.5 transition-transform">expand_more</span>
                    </button>
                    
                    <div id="ops-dropdown-menu" class="absolute right-0 mt-2 w-56 bg-white border border-border-color rounded-2xl shadow-2xl shadow-primary/10 py-2 z-50 transform scale-95 opacity-0 pointer-events-none transition-all origin-top-right">
                        <div class="px-4 py-2 mb-1 border-b border-border-color/50">
                            <span class="text-[9px] font-black text-text-muted uppercase tracking-wider">Deployment Filters</span>
                        </div>
                        
                        <button data-status="all" class="w-full flex items-center justify-between px-4 py-2.5 hover:bg-bg-light text-xs font-bold text-text-main transition-all group">
                            <div class="flex items-center gap-3">
                                <span class="material-symbols-outlined text-sm text-text-muted group-hover:text-primary">group</span>
                                All Personnel
                            </div>
                            <span id="count-all" class="text-[9px] bg-slate-100 px-1.5 py-0.5 rounded-md text-slate-400">0</span>
                        </button>
                        
                        <button data-status="operational" class="w-full flex items-center justify-between px-4 py-2.5 hover:bg-success/5 text-xs font-bold text-success transition-all group">
                            <div class="flex items-center gap-3">
                                <span class="material-symbols-outlined text-sm">check_circle</span>
                                Operational
                            </div>
                            <span id="count-operational" class="text-[9px] bg-success/10 px-1.5 py-0.5 rounded-md text-success/60">0</span>
                        </button>
                        
                        <button data-status="flagged" class="w-full flex items-center justify-between px-4 py-2.5 hover:bg-danger/5 text-xs font-bold text-danger transition-all group">
                            <div class="flex items-center gap-3">
                                <span class="material-symbols-outlined text-sm">security_update_warning</span>
                                Flagged Users
                            </div>
                            <span id="count-flagged" class="text-[9px] bg-danger/10 px-1.5 py-0.5 rounded-md text-danger/60">0</span>
                        </button>
                        
                        <div class="h-px bg-border-color/50 my-1 mx-2"></div>
                        
                        <button id="reset-filters" class="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-bg-light text-[10px] font-black text-text-muted uppercase tracking-widest transition-all">
                            <span class="material-symbols-outlined text-sm">restart_alt</span>
                            Reset Controls
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="glass-panel overflow-hidden relative min-h-[400px]">
            <div id="users-table-container">
                <!-- Loader -->
                <div class="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-[1px] z-10 transition-opacity" id="table-loader">
                    <div class="flex flex-col items-center gap-4">
                        <div class="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                        <p class="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Synchronizing Records</p>
                    </div>
                </div>
                <div id="table-content" class="transition-all duration-500 opacity-0 translate-y-4"></div>
            </div>
        </div>
    `;

    // 3. Logic: Fetch & Render
    const fetchUsers = async () => {
        filterState.loading = true;
        const loader = document.getElementById('table-loader');
        const content = document.getElementById('table-content');
        const searchLoader = document.getElementById('search-loader');
        const resultsCountEl = document.getElementById('results-count');
        const searchIcon = document.getElementById('search-icon');

        loader.classList.remove('opacity-0', 'pointer-events-none');
        searchLoader.classList.add('opacity-100');
        searchIcon.innerText = 'hourglass_empty';
        searchIcon.classList.add('animate-spin');

        try {
            const url = `/admin/users?search=${encodeURIComponent(filterState.search)}&status=${filterState.status}`;
            const users = await api.get(url);

            // Artificial delay for premium feel
            await new Promise(r => setTimeout(r, 400));

            renderTable(users);

            // Update counts in dropdown (Mock counts for UI feel)
            document.getElementById('count-all').innerText = users.length;
            document.getElementById('count-flagged').innerText = users.filter(u => u.is_blocked).length;
            document.getElementById('count-operational').innerText = users.filter(u => !u.is_blocked).length;

            resultsCountEl.innerText = `(${users.length} records found)`;

            // Toggle Filter Indicator
            const indicator = document.getElementById('filter-indicator');
            if (filterState.status !== 'all' || filterState.search !== '') {
                indicator.classList.remove('hidden');
            } else {
                indicator.classList.add('hidden');
            }

        } catch (error) {
            console.error('Fetch error:', error);
            content.innerHTML = `
                <div class="p-20 text-center">
                    <span class="material-symbols-outlined text-5xl text-danger mb-4">gpp_maybe</span>
                    <h4 class="text-danger font-black uppercase tracking-widest text-sm mb-2">Protocol Violation: Data Sync Failure</h4>
                    <p class="text-xs text-text-muted font-medium">${error.message}</p>
                </div>
            `;
            content.classList.remove('opacity-0', 'translate-y-4');
        } finally {
            filterState.loading = false;
            loader.classList.add('opacity-0', 'pointer-events-none');
            searchLoader.classList.remove('opacity-100');
            searchIcon.innerText = 'search';
            searchIcon.classList.remove('animate-spin');
        }
    };

    const renderTable = (users) => {
        const content = document.getElementById('table-content');

        if (users.length === 0) {
            content.innerHTML = `
                <div class="p-32 flex flex-col items-center text-center">
                    <div class="size-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
                        <span class="material-symbols-outlined text-4xl text-slate-200">person_off</span>
                    </div>
                    <h3 class="text-sm font-black text-text-main uppercase tracking-widest mb-1">Null Database Response</h3>
                    <p class="text-[10px] text-text-muted font-bold uppercase tracking-widest">No matching personnel records found in this vector</p>
                    <button id="retry-search" class="mt-8 text-[10px] font-black text-primary uppercase border-b-2 border-primary/20 hover:border-primary transition-all pb-1">Reset All System Filters</button>
                </div>
            `;
            const retryBtn = content.querySelector('#retry-search');
            if (retryBtn) retryBtn.onclick = resetAll;

            content.classList.remove('opacity-0', 'translate-y-4');
            return;
        }

        content.innerHTML = `
            <table class="w-full text-left">
                <thead>
                    <tr class="border-b border-border-color bg-slate-50/50">
                        <th class="pl-8 py-4 text-[10px] font-black text-text-muted uppercase tracking-[0.15em] w-[35%]">Operator Identity</th>
                        <th class="px-4 py-4 text-[10px] font-black text-text-muted uppercase tracking-[0.15em] w-[15%]">Classification</th>
                        <th class="px-4 py-4 text-[10px] font-black text-text-muted uppercase tracking-[0.15em] w-[20%]">Deployment Status</th>
                        <th class="px-4 py-4 text-[10px] font-black text-text-muted uppercase tracking-[0.15em] w-[15%]">Risk Assessment</th>
                        <th class="pr-8 py-4 text-[10px] font-black text-text-muted uppercase tracking-[0.15em] text-right w-[15%]">Overrides</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-border-color/50">
                    ${users.map((user, i) => `
                        <tr class="hover:bg-slate-50/80 transition-all group table-row-animated" style="--row-delay: ${i * 50}ms">
                            <td class="pl-8 py-4">
                                <div class="flex items-center gap-4">
                                    <div class="size-11 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center text-sm font-black text-primary shadow-sm group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                        ${user.full_name?.charAt(0) || 'U'}
                                    </div>
                                    <div>
                                        <p class="text-sm font-black text-text-main group-hover:text-primary transition-colors">${user.full_name || 'Anonymous Agent'}</p>
                                        <p class="text-[10px] text-text-muted font-bold tracking-tight uppercase flex items-center gap-1.5 mt-0.5">
                                            <span class="material-symbols-outlined text-[10px]">alternate_email</span>
                                            ${user.email}
                                        </p>
                                    </div>
                                </div>
                            </td>
                            <td class="px-4 py-4">
                                <span class="bg-white px-2.5 py-1 rounded-lg text-[9px] font-black uppercase text-text-muted tracking-widest border border-border-color shadow-sm">
                                    ${user.role || 'GUEST_USER'}
                                </span>
                            </td>
                            <td class="px-4 py-4">
                                ${user.is_blocked
                ? `<div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-danger/5 border border-danger/10 text-danger text-[9px] font-black uppercase tracking-wider">
                                        <span class="flex size-1.5 rounded-full bg-danger animate-pulse"></span>
                                        FLAGGED_CORE
                                       </div>`
                : `<div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-success/5 border border-success/10 text-success text-[9px] font-black uppercase tracking-wider">
                                        <span class="flex size-1.5 rounded-full bg-success"></span>
                                        OPERATIONAL
                                       </div>`
            }
                            </td>
                            <td class="px-4 py-4">
                                <div class="flex flex-col gap-1.5">
                                    <div class="flex justify-between items-center text-[8px] font-black text-text-muted uppercase translate-y-0.5">
                                        <span>Confidence</span>
                                        <span class="${user.is_blocked ? 'text-danger' : 'text-success'}">${user.is_blocked ? 'Low' : 'Secure'}</span>
                                    </div>
                                    <div class="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                                        <div class="h-full ${user.is_blocked ? 'bg-danger' : 'bg-success'} rounded-full transition-all duration-1000 delay-300" style="width: 0%" data-width="${user.is_blocked ? '25' : '92'}%"></div>
                                    </div>
                                </div>
                            </td>
                            <td class="pr-8 py-4 text-right">
                                <div class="flex items-center justify-end gap-1.5">
                                    <button title="Inspect Analytics" class="size-8 flex items-center justify-center hover:bg-primary/10 rounded-xl text-text-muted hover:text-primary transition-all">
                                        <span class="material-symbols-outlined text-lg">insights</span>
                                    </button>
                                    ${user.is_blocked
                ? `<button data-id="${user._id}" data-action="unblock" title="Restore Credentials" class="user-action size-8 flex items-center justify-center hover:bg-success/10 rounded-xl text-success transition-all">
                                                <span class="material-symbols-outlined text-lg">lock_open</span>
                                           </button>`
                : `<button data-id="${user._id}" data-action="block" title="Isolate Personnel" class="user-action size-8 flex items-center justify-center hover:bg-danger/10 rounded-xl text-danger transition-all">
                                                <span class="material-symbols-outlined text-lg">shield_person</span>
                                           </button>`
            }
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        // 4. Action Handlers
        content.querySelectorAll('.user-action').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const id = btn.dataset.id;
                const action = btn.dataset.action;
                const originalIcon = btn.innerHTML;

                try {
                    btn.innerHTML = `<span class="material-symbols-outlined text-lg animate-spin">sync</span>`;
                    btn.disabled = true;

                    await api.patch(`/admin/users/${id}/${action}`);
                    await fetchUsers(); // Refresh with current state
                } catch (error) {
                    btn.innerHTML = originalIcon;
                    btn.disabled = false;
                    alert('Command Authorization Failed: ' + error.message);
                }
            });
        });

        // Trigger animations
        setTimeout(() => {
            content.classList.remove('opacity-0', 'translate-y-4');
            content.querySelectorAll('[data-width]').forEach(bar => {
                bar.style.width = bar.dataset.width;
            });
        }, 50);
    };

    const resetAll = () => {
        filterState.search = '';
        filterState.status = 'all';
        document.getElementById('user-search').value = '';
        updateDropdownUI();
        fetchUsers();
    };

    const updateDropdownUI = () => {
        const btnText = document.getElementById('ops-dropdown-btn');
        const items = document.querySelectorAll('#ops-dropdown-menu button[data-status]');

        items.forEach(item => {
            if (item.dataset.status === filterState.status) {
                item.classList.add('bg-primary/5', 'ring-1', 'ring-primary/20');
            } else {
                item.classList.remove('bg-primary/5', 'ring-1', 'ring-primary/20');
            }
        });

        if (filterState.status !== 'all') {
            btnText.querySelector('span.material-symbols-outlined').classList.add('text-primary');
            btnText.classList.add('border-primary/40', 'shadow-primary/5');
        } else {
            btnText.querySelector('span.material-symbols-outlined').classList.remove('text-primary');
            btnText.classList.remove('border-primary/40', 'shadow-primary/5');
        }
    };

    // 5. Event Listeners
    setTimeout(() => {
        const searchInput = document.getElementById('user-search');
        const clearBtn = document.getElementById('clear-search');
        const dropdownBtn = document.getElementById('ops-dropdown-btn');
        const dropdownMenu = document.getElementById('ops-dropdown-menu');
        const dropdownItems = dropdownMenu.querySelectorAll('button[data-status]');
        const resetBtn = document.getElementById('reset-filters');

        // Search Input
        let searchTimeout;
        searchInput.oninput = (e) => {
            filterState.search = e.target.value;
            clearBtn.classList.toggle('hidden', e.target.value === '');

            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(fetchUsers, 600);
        };

        searchInput.onkeydown = (e) => {
            if (e.key === 'Escape') {
                searchInput.value = '';
                filterState.search = '';
                clearBtn.classList.add('hidden');
                fetchUsers();
            }
        };

        clearBtn.onclick = () => {
            searchInput.value = '';
            filterState.search = '';
            clearBtn.classList.add('hidden');
            fetchUsers();
        };

        // Dropdown Toggle
        dropdownBtn.onclick = (e) => {
            e.stopPropagation();
            const isOpen = !dropdownMenu.classList.contains('pointer-events-none');

            if (!isOpen) {
                dropdownMenu.classList.replace('scale-95', 'scale-100');
                dropdownMenu.classList.replace('opacity-0', 'opacity-100');
                dropdownMenu.classList.remove('pointer-events-none');
            } else {
                dropdownMenu.classList.replace('scale-100', 'scale-95');
                dropdownMenu.classList.replace('opacity-100', 'opacity-0');
                dropdownMenu.classList.add('pointer-events-none');
            }
        };

        // Status Click
        dropdownItems.forEach(item => {
            item.onclick = (e) => {
                e.stopPropagation();
                const status = item.dataset.status;
                if (filterState.status === status) return;

                filterState.status = status;
                updateDropdownUI();

                // Close dropdown
                dropdownMenu.classList.replace('scale-100', 'scale-95');
                dropdownMenu.classList.replace('opacity-100', 'opacity-0');
                dropdownMenu.classList.add('pointer-events-none');

                fetchUsers();
            };
        });

        // Global Click to Close Dropdown
        document.addEventListener('click', () => {
            dropdownMenu.classList.replace('scale-100', 'scale-95');
            dropdownMenu.classList.replace('opacity-100', 'opacity-0');
            dropdownMenu.classList.add('pointer-events-none');
        });

        resetBtn.onclick = (e) => {
            e.stopPropagation();
            resetAll();
            dropdownMenu.classList.replace('scale-100', 'scale-95');
            dropdownMenu.classList.replace('opacity-100', 'opacity-0');
            dropdownMenu.classList.add('pointer-events-none');
        }

        // Initial Fetch
        fetchUsers();
        updateDropdownUI();
    }, 0);
};
