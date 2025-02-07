import { Router } from 'express';
import { AuthentificatedRequest, catchError, checkRole, generateVerificationToken } from '@competition-manager/backend-utils';
import { sendVerificationEmail } from '../utils';
import { logger } from '../logger';
import { Role } from '@competition-manager/schemas';
import { isAuthorized } from '@competition-manager/utils';

export const router = Router();

router.post(
    '/resend-verification-email',
    checkRole(Role.UNCONFIRMED_USER),
    async (req : AuthentificatedRequest, res) => {
        try {
            if (isAuthorized(req.user!, Role.USER)) {
                res.status(403).send('forbidden');
                return;
            }

            if (!await sendVerificationEmail(req.user!.email, generateVerificationToken(req.user!))) {
                logger.warn('Failed to send email', {
                    path: 'POST /resent-verification-email',
                    status: 500,
                    userId: req.user!.id
                });
                res.status(500).send('failedToSendEmail');
                return;
            }
            res.send('Email sent');
        } catch (error) {
            catchError(logger)(error, {
                message: 'Internal server error',
                path: 'POST /resend-verification-email',
                status: 500
            });
            res.status(500).send('internalServerError');
        }
    }
);
