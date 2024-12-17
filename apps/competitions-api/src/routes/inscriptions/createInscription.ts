import { Router } from 'express';
import { parseRequest, AuthenticatedRequest } from '@competition-manager/utils';
import { Competition$, BaseInscriptionWithRelationId$ } from '@competition-manager/schemas';

export const router = Router();

const Params$ = Competition$.pick({
    eid: true
});



router.post(
    '/:competitionEid/inscriptions',
    parseRequest('params', Params$),
    parseRequest('body', BaseInscriptionWithRelationId$),
    async (req: AuthenticatedRequest, res) => {
        try {
            try {

            } catch(e: any) {
                if (e.code === 'P2025') {
                    res.status(404).send('i');
                    return;
                }else{
                    console.error(e);
                    res.status(500).send('Internal server error');
                    return;
                }
            }
        } catch (e) {
            console.error(e);
            res.status(500).send('Internal server error');
        }
    }
);
