import { Router } from 'express';
import { env } from '../env';

export const router = Router();

router.post(
    '/logout',
    (req, res) => {
        res.clearCookie(`refreshToken_${env.NODE_ENV}`).send(req.t('success.logout'));
    }
);