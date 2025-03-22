import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en/translation.json";

i18n.use(initReactI18next).init({
  lng: "cimode",
  interpolation: {
    escapeValue: false,
  },
  resources: {
    en: { translation: en },
  },
});

export default i18n;
