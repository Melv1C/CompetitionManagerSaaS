import { router as getAllBasicInfoRouter } from './competitions/getCompetitions';
import { router as getCompetitionByEidRouter } from './competitions/getCompetitionByEid';
import { router as createCompetitionRouter } from './competitions/createCompetition';
import { router as deleteCompetitionRouter } from './competitions/deleteCompetition';
import { router as updateCompetitionRouter } from './competitions/updateCompetition';
import { router as createEventRouter } from './events/createEvent';
import { router as updateEventRouter } from './events/updateEvent';
import { router as createAdminRouter } from './admins/createAdmin';
import { router as updateAdminRouter } from './admins/updateAdmin';
import { router as createInscriptionRouter } from './inscriptions/createInscription';
import { router as createOneDayAthRouter } from './createOneDayAth';
import { router as restoreCompetitionRouter } from './competitions/restoreCompetition';
import { router as getInscriptionsRouter } from './inscriptions/getInscriptions';
import { router as updateInscriptionRouter } from './inscriptions/updateInscription';

export default [
    getAllBasicInfoRouter,
    createCompetitionRouter,
    getCompetitionByEidRouter,
    createEventRouter,
    createAdminRouter,
    deleteCompetitionRouter,
    updateCompetitionRouter,
    updateAdminRouter,
    updateEventRouter,
    createInscriptionRouter,
    createOneDayAthRouter,
    restoreCompetitionRouter,
    getInscriptionsRouter,
    updateInscriptionRouter
];