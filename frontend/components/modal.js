/**
 * modal.js - Confirmation Modal Component
 */

export const showConfirmModal = ({ title, message, confirmText, cancelText, onConfirm, isDestructive = false }) => {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-[110] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm animate-fade-in';

    const confirmBtnClass = isDestructive
        ? 'bg-red-500 hover:bg-red-600 text-white'
        : 'bg-primary hover:bg-primary/90 text-white';

    modal.innerHTML = `
        <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-up">
            <div class="p-6">
                <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2">${title}</h3>
                <p class="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">${message}</p>
            </div>
            <div class="p-4 bg-slate-50 dark:bg-slate-800/50 flex flex-col sm:flex-row gap-3 justify-end">
                <button id="modalCancel" class="px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                    ${cancelText || 'Cancel'}
                </button>
                <button id="modalConfirm" class="px-5 py-2.5 text-sm font-bold rounded-xl transition-all active:scale-95 ${confirmBtnClass}">
                    ${confirmText || 'Confirm'}
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const close = () => {
        modal.classList.replace('animate-fade-in', 'animate-fade-out');
        setTimeout(() => modal.remove(), 200);
    };

    modal.querySelector('#modalCancel').onclick = close;
    modal.querySelector('#modalConfirm').onclick = () => {
        onConfirm();
        close();
    };

    // Close on click outside
    modal.onclick = (e) => {
        if (e.target === modal) close();
    };
};
