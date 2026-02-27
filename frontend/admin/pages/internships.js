import { api } from '../js/api.js';

export const renderInternships = async (container) => {
    container.innerHTML = `
        <div class="flex items-center justify-between mb-8">
            <div>
                <h3 class="text-lg font-black text-text-main uppercase tracking-tight">Internship Management</h3>
                <p class="text-[10px] text-text-muted font-bold uppercase tracking-widest">Configure and deploy platform placements</p>
            </div>
            <button id="add-internship-btn" class="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-primary/20">
                <span class="material-symbols-outlined text-sm">add_circle</span>
                Deploy New Internship
            </button>
        </div>

        <div class="glass-panel overflow-hidden">
            <div id="internships-table-container">
                <div class="p-20 flex justify-center">
                    <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            </div>
        </div>
    `;

    const fetchInternships = async () => {
        try {
            const internships = await api.get('/admin/internships');
            renderTable(internships);
        } catch (error) {
            document.getElementById('internships-table-container').innerHTML = `<div class="p-8 text-danger font-bold">SYSTEM ERROR: ${error.message}</div>`;
        }
    };

    const renderTable = (internships) => {
        const tableContainer = document.getElementById('internships-table-container');
        if (internships.length === 0) {
            tableContainer.innerHTML = `<div class="p-20 text-center text-text-muted font-bold uppercase tracking-widest">No active deployments found</div>`;
            return;
        }

        tableContainer.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Role & Company</th>
                        <th>Domain</th>
                        <th>Capacity</th>
                        <th>Status</th>
                        <th class="text-right">Operations</th>
                    </tr>
                </thead>
                <tbody>
                    ${internships.map(internship => `
                        <tr>
                            <td>
                                <p class="font-black text-text-main">${internship.role}</p>
                                <p class="text-[10px] text-text-muted font-bold uppercase tracking-tighter">${internship.company}</p>
                            </td>
                            <td>
                                <span class="bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter">
                                    ${internship.role.split(' ')[0]}
                                </span>
                            </td>
                            <td>
                                <div class="flex items-center gap-4">
                                    <span class="text-xs font-bold text-text-main w-8 text-right">${internship.filled || 0}/${internship.capacity || 10}</span>
                                    <div class="w-24 bg-bg-light h-1.5 rounded-full overflow-hidden">
                                        <div class="bg-primary h-full transition-all duration-500" style="width: ${(internship.filled / internship.capacity) * 100 || 0}%"></div>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${internship.is_active ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'} text-[10px] font-black uppercase">
                                    <div class="size-1.5 rounded-full ${internship.is_active ? 'bg-success' : 'bg-danger'}"></div>
                                    ${internship.is_active ? 'Deployed' : 'Closed'}
                                </span>
                            </td>
                            <td class="text-right">
                                <div class="flex items-center justify-end gap-1">
                                    <button class="p-2 hover:bg-bg-light rounded-lg text-text-muted hover:text-primary transition-all">
                                        <span class="material-symbols-outlined text-sm">edit_square</span>
                                    </button>
                                    <button class="p-2 hover:bg-danger/5 rounded-lg text-danger transition-all">
                                        <span class="material-symbols-outlined text-sm">delete</span>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    };

    fetchInternships();
};
