/**
 * register.js - Register Page View
 */

import authService from '../js/auth.service.js';
import { showToast } from '../components/toast.js';
import { getLoader } from '../components/loader.js';
import { validators } from '../js/validators.js';

export const renderRegister = (container) => {
    container.innerHTML = `
        <div class="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-50">
            <div class="w-full max-w-md">
                <div class="flex flex-col items-center mb-8">

            <div class="h-14 w-14 bg-indigo-900 rounded-2xl flex items-center justify-center shadow-indigo-200 shadow-xl mb-4">
                <svg class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
            </div>
            <h1 class="text-3xl font-extrabold text-gray-900">Join AIRE</h1>
            <p class="text-gray-500 text-sm mt-1">Adaptive Internship Recommendation Engine</p>
        </div>

        <div class="clean-card p-8 relative">
            <h2 class="text-2xl font-bold text-gray-900 mb-2">Create an account</h2>
            <p class="text-gray-400 text-sm mb-8">Enter your details below to get started</p>
            
            <form id="registerForm" class="space-y-6">
                <div>
                    <label class="block text-xs font-semibold text-gray-500 mb-2" for="email">Email Address</label>
                    <input 
                        type="email" 
                        id="email" 
                        placeholder="user@gmail.com" 
                        class="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder-gray-300"
                        required
                    >
                </div>
                
                <div class="space-y-4">
                    <div>
                        <label class="block text-xs font-semibold text-gray-500 mb-2" for="password">Password</label>
                        <div class="relative">
                            <input 
                                type="password" 
                                id="password" 
                                placeholder="••••••••" 
                                class="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder-gray-300"
                                required
                            >
                            <button type="button" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 toggle-password">
                                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </button>
                        </div>
                        <!-- Strength Indicator -->
                        <div class="mt-3 space-y-2">
                            <div class="flex justify-between items-center">
                                <span class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Strength</span>
                                <span id="strengthText" class="text-[10px] font-bold uppercase tracking-widest text-gray-300 transition-colors duration-300">Weak</span>
                            </div>
                            <div class="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div id="strengthBar" class="h-full w-0 bg-red-400 transition-all duration-700 ease-out"></div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-gray-500 mb-2" for="confirmPassword">Confirm Password</label>
                        <div class="relative">
                            <input 
                                type="password" 
                                id="confirmPassword" 
                                placeholder="••••••••" 
                                class="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder-gray-300"
                                required
                            >
                            <button type="button" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 toggle-password">
                                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                
                <button 
                    type="submit" 
                    class="w-full bg-indigo-950 text-white font-bold py-4 rounded-xl hover:bg-slate-900 transition-all shadow-lg active:scale-95 flex items-center justify-center"
                >
                    Create Account
                </button>
            </form>

            <div class="mt-8 pt-6 border-t border-gray-100 text-center">
                <p class="text-sm text-gray-500">
                    Already have an account? 
                    <a href="#/login" class="font-bold text-gray-900 hover:text-indigo-600 transition-colors">Back to Login</a>
                </p>
            </div>
        </div>

        <div class="mt-8 flex justify-center space-x-6">
            <a href="#" class="text-xs text-gray-400 hover:text-gray-600">Privacy Policy</a>
            <span class="text-gray-200">•</span>
            <a href="#" class="text-xs text-gray-400 hover:text-gray-600">Terms of Service</a>
            <span class="text-gray-200">•</span>
            <a href="#" class="text-xs text-gray-400 hover:text-gray-600">Help Center</a>
        </div>
    </div>
</div>
    `;


    // Event Listeners
    const form = container.querySelector('#registerForm');
    const passwordInput = container.querySelector('#password');
    const confirmPasswordInput = container.querySelector('#confirmPassword');
    const strengthBar = container.querySelector('#strengthBar');
    const strengthText = container.querySelector('#strengthText');

    // Password Visibility Toggle
    container.querySelectorAll('.toggle-password').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            const input = btn.previousElementSibling;
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);

            btn.innerHTML = type === 'password'
                ? `<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                   </svg>`
                : `<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                   </svg>`;
        });
    });

    // Strength Indicator Logic
    passwordInput.addEventListener('input', (e) => {
        const password = e.target.value;
        const strength = validators.getPasswordStrength(password);

        // Update Bar
        strengthBar.style.width = `${strength}%`;

        // Update Colors & Text
        if (strength <= 25) {
            strengthBar.className = 'h-full bg-red-400 transition-all duration-700 ease-out';
            strengthText.innerText = 'Weak';
            strengthText.className = 'text-[10px] font-bold uppercase tracking-widest text-red-400 transition-colors duration-300';
        } else if (strength <= 75) {
            strengthBar.className = 'h-full bg-yellow-400 transition-all duration-700 ease-out';
            strengthText.innerText = 'Moderate';
            strengthText.className = 'text-[10px] font-bold uppercase tracking-widest text-yellow-500 transition-colors duration-300';
        } else {
            strengthBar.className = 'h-full bg-green-400 transition-all duration-700 ease-out';
            strengthText.innerText = 'Strong';
            strengthText.className = 'text-[10px] font-bold uppercase tracking-widest text-green-500 transition-colors duration-300';
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = container.querySelector('#email').value;
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const submitBtn = container.querySelector('button[type="submit"]');

        // Client-side validation
        if (!validators.isValidEmail(email)) {
            showToast('Please enter a valid email address', 'error');
            return;
        }
        if (password !== confirmPassword) {
            showToast('Passwords do not match', 'error');
            return;
        }
        if (!validators.isValidPassword(password)) {
            showToast('Password must be at least 8 characters', 'error');
            return;
        }

        // Disable button & show loader
        const originalContent = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `${getLoader()} <span>Creating Account...</span>`;
        submitBtn.classList.add('opacity-75', 'cursor-not-allowed');

        try {
            await authService.register(email, password);
            showToast('Account created! Welcome aboard.', 'success');
            setTimeout(() => {
                window.location.hash = '#/dashboard';
            }, 1000);
        } catch (error) {
            showToast(error.message || 'Registration failed', 'error');
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalContent;
            submitBtn.classList.remove('opacity-75', 'cursor-not-allowed');
        }
    });
};
