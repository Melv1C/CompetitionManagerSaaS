import { Router } from 'express';

export const router = Router();

router.post(
    '/logout',
    async (req, res) => {
        res.clearCookie('refreshToken').send("Logged out");
    }
);