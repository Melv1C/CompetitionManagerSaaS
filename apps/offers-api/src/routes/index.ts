import { router as getOptionsRouter} from './getOptions';
import { router as getPlansRouter} from './getPlans';
import { router as createOptionRouter} from './createOption';
import { router as createPlanRouter} from './createPlan';
import { router as updateOptionRouter} from './updateOption';
import { router as updatePlanRouter} from './updatePlan';
import { router as deleteOptionRouter} from './deleteOption';
import { router as deletePlanRouter} from './deletePlan';

export default [
    getOptionsRouter,
    getPlansRouter,
    createOptionRouter,
    createPlanRouter,
    updateOptionRouter,
    updatePlanRouter,
    deleteOptionRouter,
    deletePlanRouter
];