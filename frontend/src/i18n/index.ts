import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en.json";
import tl from "./locales/tl.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      tl: { translation: tl },
    },
    fallbackLng: "en",
    supportedLngs: ["en", "tl"],
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "pupquestc-lang",
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
