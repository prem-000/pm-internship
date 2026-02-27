/**
 * login.js - Login Page View
 */

import authService from '../js/auth.service.js';
import { showToast } from '../components/toast.js';
import { getLoader } from '../components/loader.js';
import { validators } from '../js/validators.js';

export const renderLogin = (container) => {
    container.innerHTML = `
        <div class="flex items-center justify-center min-h-screen p-4 bg-slate-50">
            <div class="w-full max-w-md clean-card overflow-hidden transition-all duration-500 transform">

            <div class="h-48 bg-cover bg-center relative" style="background-image: url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800');">
                <div class="absolute inset-0 bg-indigo-900 bg-opacity-40 flex items-center p-8">
                    <div class="flex items-center space-x-3 bg-white bg-opacity-95 px-4 py-2 rounded-xl shadow-lg">
                        <svg class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                        <span class="text-xl font-bold tracking-tight text-gray-900" data-i18n="app_name">AIRE</span>
                    </div>
                </div>
            </div>
            
            <div class="p-8">
                <h2 class="text-3xl font-bold text-gray-900 mb-1" data-i18n="auth.login_title">${i18next.t('auth.login_title')}</h2>
                <p class="text-gray-500 mb-8 text-sm" data-i18n="landing.hero_subtitle_tagline">${i18next.t('landing.hero_subtitle_tagline')}</p>
                
                <form id="loginForm" class="space-y-6">
                    <div>
                        <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2" for="email">
                            <svg class="inline h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span data-i18n="auth.email_label">${i18next.t('auth.email_label')}</span>
                        </label>
                        <input 
                            type="email" 
                            id="email" 
                            placeholder="alex@gmail.com" 
                            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder-gray-300"
                            required
                        >
                    </div>
                    
                    <div>
                        <div class="flex justify-between mb-2">
                            <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wider" for="password">
                                <svg class="inline h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <span data-i18n="auth.password_label">${i18next.t('auth.password_label')}</span>
                            </label>
                            <a href="#" class="text-xs font-medium text-indigo-600 hover:text-indigo-500 transition-colors">Forgot password?</a>
                        </div>
                        <div class="relative">
                            <input 
                                type="password" 
                                id="password" 
                                placeholder="••••••••" 
                                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder-gray-300"
                                required
                            >
                            <button type="button" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    
                    <button 
                        type="submit" 
                        class="w-full bg-slate-900 text-white font-semibold py-4 rounded-xl hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center space-x-2 active:scale-95"
                    >
                        <span data-i18n="auth.login_button">${i18next.t('auth.login_button')}</span>
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                </form>
            </div>
            
            <div class="bg-gray-50 p-6 text-center border-t border-gray-100">
                <p class="text-sm text-gray-600">
                    <span data-i18n="auth.no_account">${i18next.t('auth.no_account')}</span>
                    <a href="#/register" class="font-bold text-gray-900 hover:text-indigo-600 transition-colors" data-i18n="auth.register_link">${i18next.t('auth.register_link')}</a>
                </p>
            </div>
    </div>
    `;


    // Event Listeners
    const form = container.querySelector('#loginForm');
    const togglePasswordBtn = container.querySelector('.relative button');
    const passwordInput = container.querySelector('#password');

    togglePasswordBtn.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);

        // Update icon based on state
        togglePasswordBtn.innerHTML = type === 'password'
            ? `<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
               </svg>`
            : `<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
               </svg>`;
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = container.querySelector('#email').value;
        const password = container.querySelector('#password').value;
        const submitBtn = container.querySelector('button[type="submit"]');

        // Client-side validation
        if (!validators.isValidEmail(email)) {
            showToast('Please enter a valid email address', 'error');
            return;
        }

        // Disable button & show loader
        const originalContent = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `${getLoader()} <span>Signing In...</span>`;
        submitBtn.classList.add('opacity-75', 'cursor-not-allowed');

        try {
            await authService.login(email, password);
            showToast('Login successful! Redirecting...', 'success');
            setTimeout(() => {
                window.location.hash = '#/dashboard';
            }, 1000);
        } catch (error) {
            showToast(error.message || 'Login failed', 'error');
            // Re-enable button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalContent;
            submitBtn.classList.remove('opacity-75', 'cursor-not-allowed');
        }
    });
};
