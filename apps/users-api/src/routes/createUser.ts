
import { Router } from 'express';

import { prisma } from '@competition-manager/prisma';
import { User$ } from '@competition-manager/schemas';
import { parseRequest } from '@competition-manager/utils';

export const router = Router();

const Body$ = User$.pick({ firebaseId: true, email: true });

router.post(
    '', 
    parseRequest('body', Body$), 
    async (req, res) => {
        const userBody = Body$.parse(req.body);
        try {
            const user = await prisma.user.create({
                data: {
                    ...userBody,
                    preferences: {
                        create: {
                            theme: 'light',
                            language: 'fr'
                        }
                    },
                    role: 'user'
                }
            });
            res.send(user);
        } catch (error) {
            console.error(error);
            res.status(500).send('An error occurred while creating the user');
        }
    }
);