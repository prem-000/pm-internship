/**
 * validators.js - Client-side validation logic
 */

export const validators = {
    isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    isValidPassword(password) {
        // Must be at least 8 characters as per PRD Step 7.1
        return password && password.length >= 8;
    },

    getPasswordStrength(password) {
        if (!password) return 0;
        let strength = 0;
        if (password.length >= 8) strength += 25;
        if (/[A-Z]/.test(password)) strength += 25;
        if (/[0-9]/.test(password)) strength += 25;
        if (/[^A-Za-z0-9]/.test(password)) strength += 25;
        return strength;
    }
};
