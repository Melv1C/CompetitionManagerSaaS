import { router as getAllBasicInfoRouter} from './competitions/getAllBasicInfo';
import { router as createCompetitionRouter} from './competitions/createCompetition';
import { router as getCompetitionByEidRouter} from './competitions/getCompetitionByEid';
import { router as createEventRouter} from './events/createEvent';

export default [
    getAllBasicInfoRouter,
    createCompetitionRouter,
    getCompetitionByEidRouter,
    createEventRouter,
];