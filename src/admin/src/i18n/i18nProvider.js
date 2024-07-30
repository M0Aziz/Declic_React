// src/i18n/i18nProvider.js
import polyglotI18nProvider from 'ra-i18n-polyglot';
import translations from './translations';

const i18nProvider = polyglotI18nProvider(
    (locale) => translations[locale],
    'fr' // Locale par défaut
);

export default i18nProvider;
