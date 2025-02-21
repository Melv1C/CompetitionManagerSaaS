import en from './en';
import fr from './fr';
import nl from './nl';

export const backendTranslations = {
    en,
    fr,
    nl,
};

export const frontendTranslations = {
    en: {
        zod: en.zod,
        enums: en.enums,
    },
    fr: {
        zod: fr.zod,
        enums: fr.enums,
    },
    nl: {
        zod: nl.zod,
        enums: nl.enums,
    },
};