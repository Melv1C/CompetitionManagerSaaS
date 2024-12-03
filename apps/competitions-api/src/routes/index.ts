import { router as getAllBasicInfoRouter} from './competitions/getAllBasicInfo';
import { router as createCompetitionRouter} from './competitions/createCompetition';
import { router as getCompetitionByEidRouter} from './competitions/getCompetitionByEid';

export default [
    getAllBasicInfoRouter,
    createCompetitionRouter,
    getCompetitionByEidRouter
];