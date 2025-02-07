import { Router } from 'express';
import { z } from 'zod';
import { isBestResult } from '@competition-manager/utils';
import { Key, parseRequest } from '@competition-manager/backend-utils';
import { getResults } from '../utils/getResult';
import { Date$, Event$, License$, Records, Records$ } from '@competition-manager/schemas';
import { prisma } from '@competition-manager/prisma';

export const router = Router();

const Param$ = z.object({
    license: License$
});

const Query$ = z.object({
    events: z.string().transform((value, ctx) => {
        try {
            const { success, error, data } = Event$.shape.name.array().nonempty().safeParse(JSON.parse(value));
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
                message: "Events should be an array in JSON format",
            });
            return z.NEVER;
        }
    }),
    from: Date$.optional(),
    to: Date$.optional(),
});

router.get(
    '/:license/records',
    parseRequest(Key.Params, Param$), 
    parseRequest(Key.Query, Query$),
    async (req, res) => {
        const { license } = Param$.parse(req.params);
        const { from, to } = Query$.omit({ events: true }).parse(req.query);
        const eventsName = Event$.shape.name.array().nonempty().parse(req.query.events);

        const events= Event$.array().nonempty().parse(
            await prisma.event.findMany({
                where: {
                    name: {
                        in: eventsName
                    }
                }
            }) 
        );

        if (eventsName.some(eventName => !events.map(e => e.name).includes(eventName))) {
            res.status(404).send("Unknown event");
            return;
        }

        try {
            const results = await getResults(license, eventsName, from, to);

            const records: Records = {};

            for (let event of events) {
                if (results[event.name]) {
                    records[event.name] = results[event.name].reduce((acc, curr) => {
                        if (isBestResult(curr.perf, acc.perf, event.type)) {
                            return curr;
                        }
                        return acc;
                    });
                } else {
                    records[event.name] = null;
                }
            }

            res.json(Records$.parse(records));
        } catch (e) {
            console.error(e);
            res.status(500).send('internalServerError');
        }
    }
);
