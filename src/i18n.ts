
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Fix for TypeScript compatibility between React and i18next
declare module 'i18next' {
  interface CustomTypeOptions {
    returnNull: false;
  }
}

// This declaration extends React types to accept i18next children
declare module 'react' {
  interface ReactI18NextChildrenProps {
    children: React.ReactNode;
  }
}

i18n
  // Load translation using http -> see /public/locales
  .use(Backend)
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    fallbackLng: 'pl',
    supportedLngs: ['pl', 'en', 'de', 'uk'],
    
    // Have a common namespace used around the full app
    ns: ['translation'],
    defaultNS: 'translation',
    
    // Detection options
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
    },
    
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
    
    react: {
      useSuspense: true,
      transSupportBasicHtmlNodes: true, // Allow basic HTML elements in translations
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p', 'span'] // List of HTML elements to keep
    },
    
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },

    // This setting helps with TypeScript compatibility
    returnNull: false,
  });

export default i18n;
