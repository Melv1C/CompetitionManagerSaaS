import { checkRole, Key, parseRequest } from '@competition-manager/backend-utils';
import { prisma } from '@competition-manager/prisma';
import { Date$, Log$, Role } from '@competition-manager/schemas';
import { Router } from 'express';
import { z } from 'zod';

export const router = Router();

const Query$ = z.object({
    services: z.string().transform((value, ctx) => {
        try {
            const { success, error, data } = Log$.shape.service.array().nonempty().safeParse(JSON.parse(value));
            if (!success) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: error.errors[0].message,
                });
                return z.NEVER;
            }
            return data;
        } catch (e) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Services should be an array in JSON format",
            });
            return z.NEVER;
        }
    }),
    levels: z.string().transform((value, ctx) => {
        try {
            const { success, error, data } = Log$.shape.level.array().nonempty().safeParse(JSON.parse(value));
            if (!success) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: error.errors[0].message,
                });
                return z.NEVER;
            }
            return data;
        } catch (e) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Levels should be an array in JSON format",
            });
            return z.NEVER;
        }
    }),
    from: Date$.optional(),
    to: Date$.optional(),
    limit: z.coerce.number().int().positive().default(100),
});

router.get(
    '/',
    parseRequest(Key.Query, Query$),
    checkRole(Role.SUPERADMIN),
    async (req, res) => {
        const services = Log$.shape.service.array().nonempty().parse(req.query.services);
        const levels = Log$.shape.level.array().nonempty().parse(req.query.levels);
        const { from, to, limit } = Query$.omit({ services: true, levels: true }).parse(req.query);

        const logs = await prisma.log.findMany({
            where: {
                service: {
                    in: services
                },
                level: {
                    in: levels
                },
                date: {
                    gte: from,
                    lte: to
                }
            },
            orderBy: {
                date: 'desc'
            },
            take: limit
        });

        res.send(Log$.array().parse(logs));
    }
)
