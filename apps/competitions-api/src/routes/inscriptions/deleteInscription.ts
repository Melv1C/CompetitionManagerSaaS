// This file handles the deletion of inscriptions from competitions
// It provides a DELETE endpoint that allows both users and admins to delete inscriptions
// with appropriate authorization checks and validation

import { catchError, checkAdminRole, checkRole, CustomRequest, Key, parseRequest } from '@competition-manager/backend-utils';
import { prisma } from '@competition-manager/prisma';
import { Access, AdminQuery$, BaseAdmin$, Eid$, Inscription$, inscriptionsInclude, Role } from '@competition-manager/schemas';
import { isAuthorized } from '@competition-manager/utils';
import { Router } from 'express';
import { z } from 'zod';
import { logger } from '../../logger';

export const router = Router();

// Schema to validate URL parameters
// Requires both competition and inscription EIDs to be valid strings
const InscriptionParams$ = z.object({
    competitionEid: Eid$,
    inscriptionEid: Eid$
});

/**
 * DELETE /:competitionEid/inscriptions/:inscriptionEid
 * 
 * Endpoint to delete (soft-delete) an inscription from a competition
 * 
 * Authorization:
 * - Regular users can only delete their own inscriptions
 * - Admins can delete any inscription if they have INSCRIPTIONS access
 * - Superadmins can delete any inscription
 * 
 * URL Parameters:
 * @param competitionEid - External ID of the competition
 * @param inscriptionEid - External ID of the inscription to delete
 * 
 * Query Parameters:
 * @param isAdmin - Boolean flag to indicate if request is made as admin
 * 
 * Response:
 * - 200: Inscription deleted successfully
 * - 401: Unauthorized (missing/invalid admin credentials)
 * - 403: Forbidden (user trying to delete another user's inscription)
 * - 404: Competition or inscription not found
 * - 500: Internal server error
 */
router.delete(
    '/:competitionEid/inscriptions/:inscriptionEid',
    parseRequest(Key.Params, InscriptionParams$), // Validate URL parameters
    parseRequest(Key.Query, AdminQuery$), // Validate query parameters
    checkRole(Role.USER), // Ensure user is authenticated and set the user in the request
    async (req: CustomRequest, res) => {
        try {   
            // Extract and validate parameters
            const { competitionEid, inscriptionEid } = InscriptionParams$.parse(req.params);
            const { isAdmin } = AdminQuery$.parse(req.query);

            // Check admin authorization if request is made as admin
            if (isAdmin && (!req.user || !isAuthorized(req.user, Role.ADMIN))) {
                res.status(401).send('Unauthorized');
                return;
            }

            // Additional checks for non-superadmin admins
            if (isAdmin && !isAuthorized(req.user!, Role.SUPERADMIN)) {
                // Fetch competition to check admin permissions
                const competition = await prisma.competition.findUnique({
                    where: {
                        eid: competitionEid
                    },
                    include: {
                        admins: true
                    }
                });
                if (!competition) {
                    res.status(404).send('Competition not found');
                    return;
                }
                // Verify admin has INSCRIPTIONS access for this competition
                if (!checkAdminRole(Access.INSCRIPTIONS, req.user!.id, BaseAdmin$.array().parse(competition.admins), res, req.t)) return;
            }

            // Fetch inscription to verify it exists and check ownership
            const inscription = await prisma.inscription.findUnique({
                where: {
                    eid: inscriptionEid
                }
            });

            if (!inscription) {
                res.status(404).send(req.t('errors.inscriptionNotFound'));
                return;
            }

            // Regular users can only delete their own inscriptions
            if (!isAdmin && inscription.userId !== req.user?.id) {
                res.status(403).send(req.t('errors.inscriptionNotBelongsToUser'));
                return;
            }

            // Soft delete the inscription by setting isDeleted flag
            const deletedInscription = await prisma.inscription.update({
                where: {
                    eid: inscriptionEid
                },
                data: {
                    isDeleted: true
                },
                include: inscriptionsInclude
            });

            // Log successful deletion
            logger.info('Inscription deleted', {
                path: 'DELETE /:competitionEid/inscriptions/:inscriptionEid',
                status: 200,
                userId: req.user?.id,
                metadata: { competitionEid, inscriptionEid }
            });

            res.status(200).send(Inscription$.parse(deletedInscription));
        } catch (error) {
            // Log and handle any errors that occur
            catchError(logger)(error, {
                message: 'Error deleting inscription',
                path: 'DELETE /:competitionEid/inscriptions/:inscriptionEid',
                status: 500,
                userId: req.user?.id
            }); 
            res.status(500).send(req.t('errors.internalServerError'));
        }
    }
);