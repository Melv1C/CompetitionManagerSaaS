import { router as getAllBasicInfoRouter} from './competitions/getAllBasicInfo';
import { router as createCompetitionRouter} from './competitions/createCompetition';
import { router as getCompetitionByEidRouter} from './competitions/getCompetitionByEid';
import { router as createEventRouter} from './events/createEvent';
import { router as createAdminRouter} from './admins/createAdmin';
import { router as deleteCompetitionRouter} from './competitions/deleteCompetition';

export default [
    getAllBasicInfoRouter,
    createCompetitionRouter,
    getCompetitionByEidRouter,
    createEventRouter,
    createAdminRouter,
    deleteCompetitionRouter
];