import { router as getAllBasicInfoRouter} from './competitions/getAllBasicInfo';
import { router as getCompetitionByEidRouter} from './competitions/getCompetitionByEid';
import { router as createCompetitionRouter} from './competitions/createCompetition';
import { router as deleteCompetitionRouter} from './competitions/deleteCompetition';
import { router as updateCompetitionRouter} from './competitions/updateCompetition';
import { router as createEventRouter} from './events/createEvent';
import { router as updateEventRouter} from './events/updateEvent';
import { router as createAdminRouter} from './admins/createAdmin';
import { router as updateAdminRouter} from './admins/updateAdmin';
import { router as createInscriptionRouter} from './inscriptions/createInscription';
import { router as createOneDayAthRouter} from './oneDayAth/createOneDayAth';

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
    createOneDayAthRouter
];