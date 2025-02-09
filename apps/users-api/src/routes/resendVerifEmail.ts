import { Router } from 'express';
import { AuthentificatedRequest, catchError, checkRole, generateVerificationToken } from '@competition-manager/backend-utils';
import { sendVerificationEmail } from '../utils';
import { logger } from '../logger';
import { LEVEL, Role } from '@competition-manager/schemas';
import { isAuthorized } from '@competition-manager/utils';

export const router = Router();

router.post(
    '/resend-verification-email',
    checkRole(Role.UNCONFIRMED_USER),
    async (req : AuthentificatedRequest, res) => {
        try {
            if (isAuthorized(req.user!, Role.USER)) {
                res.status(403).send(req.t('errors.unauthorized'));
                return;
            }
            try {
                await sendVerificationEmail(req.user!.email, generateVerificationToken(req.user!), req.t)
            } catch (error) {
                catchError(logger, LEVEL.warn)(error, {
                    message: 'Failed to send email',
                    path: 'POST /resend-verification-email',
                    userId: req.user!.id,
                    metadata: {
                        user: req.user
                    }
                });
                res.status(500).send(req.t('errors.failedToSendEmail'));
                return;
            }
            res.send('Email sent');
        } catch (error) {
            catchError(logger)(error, {
                message: 'Internal server error',
                path: 'POST /resend-verification-email',
                status: 500,
                userId: req.user?.id
            });
            res.status(500).send(req.t('errors.internalServerError'));
        }
    }
);
