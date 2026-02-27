import { api } from '../js/api.js';

export const renderUsers = async (container) => {
    container.innerHTML = `
        <div class="flex items-center justify-between mb-8">
            <div>
                <h3 class="text-lg font-black text-text-main uppercase tracking-tight">Personnel Intelligence</h3>
                <p class="text-[10px] text-text-muted font-bold uppercase tracking-widest">Global user database and security oversight</p>
            </div>
            <div class="flex gap-4">
                <div class="flex items-center gap-3 bg-white border border-border-color px-4 py-2.5 rounded-xl group focus-within:border-primary/40 transition-all shadow-sm">
                    <span class="material-symbols-outlined text-sm text-text-muted group-focus-within:text-primary">search</span>
                    <input type="text" id="user-search" placeholder="Filter agents..." 
                        class="bg-transparent border-none text-xs focus:ring-0 w-48 text-text-main placeholder:text-text-muted font-medium">
                </div>
                <button class="bg-white border border-border-color px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-bg-light text-text-main transition-all flex items-center gap-2 shadow-sm">
                    <span class="material-symbols-outlined text-sm">filter_alt</span>
                    Operations
                </button>
            </div>
        </div>

        <div class="glass-panel overflow-hidden">
            <div id="users-table-container">
                <div class="p-20 flex justify-center">
                    <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            </div>
        </div>
    `;

    const fetchUsers = async (search = '') => {
        try {
            const users = await api.get(`/admin/users?search=${search}`);
            renderTable(users);
        } catch (error) {
            document.getElementById('users-table-container').innerHTML = `<div class="p-8 text-danger font-bold uppercase tracking-widest text-center">Data Retrieval Failure: ${error.message}</div>`;
        }
    };

    const renderTable = (users) => {
        const tableContainer = document.getElementById('users-table-container');
        if (users.length === 0) {
            tableContainer.innerHTML = `<div class="p-20 text-center text-text-muted font-bold uppercase tracking-widest">No matching personnel records found</div>`;
            return;
        }

        tableContainer.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Operator</th>
                        <th>Classification</th>
                        <th>Deployment Status</th>
                        <th>Risk Assessment</th>
                        <th class="text-right">Overrides</th>
                    </tr>
                </thead>
                <tbody>
                    ${users.map(user => `
                        <tr>
                            <td>
                                <div class="flex items-center gap-3">
                                    <div class="size-10 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center text-xs font-black text-primary">
                                        ${user.full_name?.charAt(0) || 'U'}
                                    </div>
                                    <div>
                                        <p class="text-sm font-black text-text-main">${user.full_name || 'Anonymous'}</p>
                                        <p class="text-[10px] text-text-muted font-bold tracking-tight uppercase">${user.email}</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="bg-bg-light px-2 py-1 rounded text-[10px] font-black uppercase text-text-muted tracking-widest border border-border-color">${user.role || 'Personnel'}</span>
                            </td>
                            <td>
                                ${user.is_blocked
                ? `<span class="flex items-center gap-1.5 px-3 py-1 rounded-full bg-danger/10 text-danger text-[10px] font-black uppercase"><div class="size-1.5 bg-danger rounded-full"></div> Flagged</span>`
                : `<span class="flex items-center gap-1.5 px-3 py-1 rounded-full bg-success/10 text-success text-[10px] font-black uppercase"><div class="size-1.5 bg-success rounded-full"></div> Operational</span>`
            }
                            </td>
                            <td>
                                <div class="flex items-center gap-3">
                                    <div class="h-1.5 w-16 bg-bg-light rounded-full overflow-hidden">
                                        <div class="h-full bg-accent" style="width: 25%"></div>
                                    </div>
                                    <span class="text-[10px] font-bold text-text-muted uppercase">Safe</span>
                                </div>
                            </td>
                            <td class="text-right">
                                <div class="flex items-center justify-end gap-1">
                                    <button class="p-2 hover:bg-bg-light rounded-lg text-text-muted hover:text-primary transition-all">
                                        <span class="material-symbols-outlined text-sm">monitoring</span>
                                    </button>
                                    ${user.is_blocked
                ? `<button data-id="${user._id}" data-action="unblock" class="user-action p-2 hover:bg-success/10 rounded-lg text-success transition-all">
                                                <span class="material-symbols-outlined text-sm">lock_open</span>
                                           </button>`
                : `<button data-id="${user._id}" data-action="block" class="user-action p-2 hover:bg-danger/10 rounded-lg text-danger transition-all">
                                                <span class="material-symbols-outlined text-sm">security_update_warning</span>
                                           </button>`
            }
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        tableContainer.querySelectorAll('.user-action').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.dataset.id;
                const action = btn.dataset.action;
                try {
                    await api.patch(`/admin/users/${id}/${action}`);
                    await fetchUsers(document.getElementById('user-search').value);
                } catch (error) {
                    alert('System Override Failed: ' + error.message);
                }
            });
        });
    };

    fetchUsers();

    let searchTimeout;
    document.getElementById('user-search').addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => fetchUsers(e.target.value), 500);
    });
};
