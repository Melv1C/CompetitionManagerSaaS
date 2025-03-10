import translation from './translation.json';
import buttons from './buttons.json';
import labels from './labels.json';
import glossary from './glossary.json';
import navigation from './navigation.json';
import auth from './auth.json';
import createCompetition from './createCompetition.json';
import adminCompetition from './adminCompetition.json';
import eventPopup from './eventPopup.json';
import competition from './competition.json';
import account from './account.json';
import home from './home.json';
import footer from './footer.json';
import news from './news.json';
import faq from './faq.json';
import errors from './errors.json';
import result from './result.json';

import { frontendTranslations } from '@competition-manager/translations';

export default {
    ...frontendTranslations.nl,
    translation,
    buttons,
    labels,
    glossary,
    navigation,
    auth,
    createCompetition,
    adminCompetition,
    eventPopup,
    competition,
    account,
    home,
    footer,
    news,
    faq,
    errors,
    result
}