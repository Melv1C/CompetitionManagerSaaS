import translation from './translation.json';
import buttons from './buttons.json';
import labels from './labels.json';
import glossary from './glossary.json';
import navigation from './navigation.json';
import auth from './auth.json';
import createCompetition from './createCompetition.json';
import adminCompetition from './adminCompetition.json';
import eventPopup from './eventPopup.json';
import inscription from './inscription.json';
import account from './account.json';
import home from './home.json';
import footer from './footer.json';
import errors from './errors.json';

import { zodTranslations } from '@competition-manager/schemas';

export default {
    zod: zodTranslations.en,
    translation,
    buttons,
    labels,
    glossary,
    navigation,
    auth,
    createCompetition,
    adminCompetition,
    eventPopup,
    inscription,
    account,
    home,
    footer,
    errors
}