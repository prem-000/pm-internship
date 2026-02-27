import store from '../js/store.js';

const i18nConfig = {
    loadTranslations: async (lang) => {
        try {
            const response = await fetch(`./i18n/${lang}.json`);
            return await response.json();
        } catch (error) {
            console.error(`Failed to load translations for ${lang}`, error);
            const fallback = await fetch(`./i18n/en.json`);
            return await fallback.json();
        }
    },

    init: async () => {
        const savedLang = store.getPreferredLanguage() || 'en';

        // Use global i18next (loaded via script tag in index.html)
        await i18next
            .use(i18nextBrowserLanguageDetector)
            .init({
                lng: savedLang,
                fallbackLng: 'en',
                debug: false,
                resources: {
                    en: { translation: await i18nConfig.loadTranslations('en') },
                    hi: { translation: await i18nConfig.loadTranslations('hi') },
                    ta: { translation: await i18nConfig.loadTranslations('ta') }
                }
            });

        i18nConfig.applyTranslations();
    },

    applyTranslations: () => {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            el.innerHTML = i18next.t(key);
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            el.placeholder = i18next.t(key);
        });
    },

    changeLanguage: async (lang) => {
        await i18next.changeLanguage(lang);
        store.setPreferredLanguage(lang);
        i18nConfig.applyTranslations();

        // If user is logged in, sync with backend
        if (store.isAuthenticated) {
            try {
                await fetch(`${store.apiBase}/user/update-language`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${store.token}`
                    },
                    body: JSON.stringify({ preferred_language: lang })
                });
            } catch (err) {
                console.error("Failed to sync language preference with server", err);
            }
        }

        // Trigger a re-render of the current page if needed
        window.dispatchEvent(new HashChangeEvent('hashchange'));
    }
};

export default i18nConfig;
