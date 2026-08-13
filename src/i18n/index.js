// KhamarCare — i18n Setup
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import bn from './bn.json';
import en from './en.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      bn: { translation: bn },
      en: { translation: en },
    },
    fallbackLng: 'bn',
    lng: localStorage.getItem('khamarcare-lang') || 'bn',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage'],
      lookupLocalStorage: 'khamarcare-lang',
      caches: ['localStorage'],
    },
  });

// Update body lang attribute for font switching
const updateLangAttr = (lng) => {
  document.body.setAttribute('data-lang', lng);
  document.documentElement.setAttribute('lang', lng);
  localStorage.setItem('khamarcare-lang', lng);
};

updateLangAttr(i18n.language);
i18n.on('languageChanged', updateLangAttr);

export default i18n;
