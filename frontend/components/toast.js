/**
 * toast.js - Toast Notification Component
 */

export const showToast = (message, type = 'success') => {
    const toast = document.createElement('div');
    // Top-centered, light red for error, 4s duration
    const bgClass = type === 'success' ? 'bg-indigo-600 text-white' : 'bg-rose-50 border border-rose-200 text-rose-800';

    toast.className = `fixed top-6 left-1/2 -translate-x-1/2 px-8 py-4 rounded-2xl shadow-2xl transform transition-all duration-500 -translate-y-20 opacity-0 z-[100] font-medium text-sm flex items-center space-x-3 ${bgClass}`;

    const icon = type === 'success'
        ? '<svg class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>'
        : '<svg class="h-5 w-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>';

    toast.innerHTML = `
        ${icon}
        <span>${message}</span>
    `;

    document.body.appendChild(toast);

    // Fade in
    setTimeout(() => {
        toast.classList.remove('-translate-y-20', 'opacity-0');
    }, 50);

    // Fade out and remove after 4 seconds
    setTimeout(() => {
        toast.classList.add('-translate-y-20', 'opacity-0');
        setTimeout(() => toast.remove(), 500);
    }, 4000);
};

export const toast = {
    success: (msg) => showToast(msg, 'success'),
    error: (msg) => showToast(msg, 'error'),
    info: (msg) => showToast(msg, 'info')
};
