import { Router } from 'express';

export const router = Router();

router.post(
    '/logout',
    (req, res) => {
        res.clearCookie('refreshToken').send("Logged out");
    }
);