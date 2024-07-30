import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationFr from './Assets/Languages/fr.json';
import translationEn from './Assets/Languages/en.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      fr: {
        translation: translationFr
      },
      en: {
        translation: translationEn
      }
    },
    lng: 'fr', // Langue par défaut
    fallbackLng: 'fr', // Langue de secours si la traduction n'est pas disponible
    interpolation: {
      escapeValue: false
    },
    react: {
      bindI18n: 'languageChanged', // Mettre à jour la vue lorsque la langue est changée
      bindI18nStore: 'added removed', // Mettre à jour la vue lorsqu'il y a des modifications dans les traductions
      nsMode: 'default' // Mode de gestion des espaces de noms (optionnel, par défaut: default)
    }
  });


export default i18n;
