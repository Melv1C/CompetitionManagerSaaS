import { router as getUserRouter } from './getUser';
import { router as registerUserRouter} from './registerUser';
import { router as loginUserRouter } from './loginUser';
import { router as refreshTokenRouter } from './refreshToken';
import { router as logoutUserRouter } from './logoutUser';

export default [
    registerUserRouter,
    loginUserRouter,
    refreshTokenRouter,
    logoutUserRouter,
    getUserRouter  // Need to be last because of the param route
];