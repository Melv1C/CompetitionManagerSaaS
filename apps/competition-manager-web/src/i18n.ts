import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';

import { resources } from "./Translation";
import { Language } from "@competition-manager/schemas";

i18n
    .use(initReactI18next)
    .use(LanguageDetector)
    .init({
        resources,
        supportedLngs: [Language.FR, Language.EN, Language.NL],
        fallbackLng: Language.EN,
        interpolation: {
            escapeValue: false
        },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage']
        }
    });

export default i18n;


