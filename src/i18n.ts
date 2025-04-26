import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './i18n/en.json';
import fr from './i18n/fr.json';

const resources = {
  en: { translation: en },
  fr: { translation: fr },
};

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: 'fr',
      fallbackLng: 'en',
      interpolation: { escapeValue: false },
    });
}

export default i18n;