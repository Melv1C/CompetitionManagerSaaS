import { router as registerUserRouter} from './registerUser';
import { router as loginUserRouter } from './loginUser';
import { router as refreshTokenRouter } from './refreshToken';
import { router as logoutUserRouter } from './logoutUser';

export default [
    registerUserRouter,
    loginUserRouter,
    refreshTokenRouter,
    logoutUserRouter
];