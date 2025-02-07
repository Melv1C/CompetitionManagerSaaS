import { router as registerUserRouter} from './registerUser';
import { router as loginUserRouter } from './loginUser';
import { router as refreshTokenRouter } from './refreshToken';
import { router as logoutUserRouter } from './logoutUser';
import { router as verifyEmailRouter } from './verifyEmail';
import { router as forgotPasswordRouter } from './forgotPassword';
import { router as resetPasswordRouter } from './resetPassword';
import { router as updateUserRouter } from './updateUser';
import { router as getUserInscriptionsRouter } from './getUserInscriptions';
import { router as resendVerifEmailRouter } from './resendVerifEmail';
import { router as changePasswordRouter } from './changePassword';

export default [
    registerUserRouter,
    loginUserRouter,
    refreshTokenRouter,
    logoutUserRouter,
    verifyEmailRouter,
    forgotPasswordRouter,
    resetPasswordRouter,
    getUserInscriptionsRouter,
    resendVerifEmailRouter,
    changePasswordRouter,
    updateUserRouter
];