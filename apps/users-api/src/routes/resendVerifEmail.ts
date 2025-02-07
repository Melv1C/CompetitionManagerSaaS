import { Router } from 'express';
import { AuthenticatedRequest, catchError, checkRole, generateVerificationToken } from '@competition-manager/backend-utils';
import { sendVerificationEmail } from '../utils';
import { logger } from '../logger';
import { Role } from '@competition-manager/schemas';

export const router = Router();

router.post(
    '/me/resend-verification-email',
    checkRole(Role.USER),
    async (req : AuthenticatedRequest, res) => {
        try {
            if (!await sendVerificationEmail(req.user!.email, generateVerificationToken(req.user!))) {
                logger.warn('Failed to send email', {
                    path: 'POST /register',
                    status: 500,
                    userId: req.user!.id
                });
                res.status(500).send('Failed to send email');
                return;
            }
            res.send('Email sent');
        } catch (error) {
            catchError(logger)(error, {
                message: 'Internal server error',
                path: 'POST /login',
                status: 500
            });
            res.status(500).send('Internal server error');
        }
    }
);
