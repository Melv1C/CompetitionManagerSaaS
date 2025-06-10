import { Result, EventType, ResultDetail } from '@competition-manager/schemas';
import { LocalResult, LocalResult$ } from '@/types';

export async function getResultsLocal(result: Result) {
    try {
        // Extract the license number from the athlete
        const licenseNumber = result.athlete.license;

        // Extract the event name from the competitionEvent
        const eventName = result.competitionEvent.name;

        const result_query = `
            select r.id, e."name", l.licensenumber, r.value, r.wind, r.seqno
            from results r
            left join participations p 
            on r.participation = p.id
            left join rounds r2 
            on p.round = r2.id
            left join events e
            on r2.event = e.id
            left join participants p2 
            on p2.participation = p.id
            left join competitors c 
            on p2.competitor = c.id
            left join athletes a 
            on c.athlete = a.id
            left join licenses l 
            on l.athlete = a.id
            where l.licensenumber = '${licenseNumber}' and e."name" = '${eventName}'
        `;
        console.log(await window.localDb.executeQuery(result_query))
        const existingResult = LocalResult$.array().parse(await window.localDb.executeQuery(result_query));
        return existingResult;
    } catch (error) {
        console.error('Error checking if result exists in local DB:', error);
        return [];
    }
}

export async function getParticipationId(result: Result) {
    const query = `
        SELECT p.id
        FROM participations p
        LEFT JOIN participants p2 ON p2.participation = p.id
        LEFT JOIN competitors c ON p2.competitor = c.id
        LEFT JOIN athletes a ON c.athlete = a.id
        LEFT JOIN rounds r ON p.round = r.id
        LEFT JOIN events e ON r.event = e.id
        LEFT JOIN licenses l ON l.athlete = a.id
        WHERE l.licensenumber = '${result.athlete.license}'
        AND (
            (r.name = '*' AND e.name = '${result.competitionEvent.name}') 
            OR (r.name = '${result.competitionEvent.name}')
        );
    `;
    return await window.localDb.executeQuery(query)
        .then((res: any) => {
            if (res.length > 0) {
                return res[0].id;
            } else {
                throw new Error('Participation not found');
            }
        })
        .catch((error: any) => {
            console.error('Error getting participation ID:', error);
            throw error;
        });
}

export function eventTypeToLocalType (eventType: EventType): string {
    switch (eventType) {
        case EventType.TIME:
            return 'PHF';
        case EventType.DISTANCE:
            return 'USR';
        case EventType.POINTS:
            return 'points';
        case EventType.HEIGHT:
            return 'USR';
        default:
            throw new Error(`Unknown event type: ${eventType}`);
    }
}

export async function createLocalResult(detail: ResultDetail, participationId: number, type: EventType) {
    const query = `
        INSERT INTO results (since, participation, value, wind, seqno, metavalue, type, info, timeperformed, official)
        VALUES (NOW(), ${participationId}, ${detail.value}, ${detail.wind}, ${detail.tryNumber}, 0, '${eventTypeToLocalType(type)}', NULL, NOW(), 0)
    `;
    console.log('Creating local result with query:', query);
    try {
        const result = await window.localDb.executeQuery(query);
        console.log('Result created successfully:', result);
    } catch (error) {
        console.error('Error creating result in local DB:', error);
        throw error; 
    }
}

export async function upsertLocalResult(localResults: LocalResult[], result: Result, participationId: number) {
    console.log(localResults);
    console.log(result);
    console.log(participationId);
    for (const detail of result.details) {
        const value = result.competitionEvent.event.type === EventType.TIME ? detail.value / 1000 : detail.value;
        let found = false
        for (const localResult of localResults) {
            if (localResult.seqno === detail.tryNumber) {
                found = true;
                const updateQuery = `
                    UPDATE results
                    SET value = ${value}, wind = ${detail.wind}
                    WHERE id = ${localResult.id}
                `;
                try {
                    await window.localDb.executeQuery(updateQuery);
                    console.log(`Result with ID ${localResult.id} updated successfully.`);
                } catch (error) {
                    console.error('Error updating result in local DB:', error);
                }
                continue;
            }
        }
        if (!found) {
            createLocalResult(detail, participationId, result.competitionEvent.event.type);
        }
    }
    // Remove results that are no longer present
    if (localResults.length > result.details.length) {
        const idsToRemove = localResults
            .filter(localResult => !result.details.some(detail => detail.tryNumber === localResult.seqno))
            .map(localResult => localResult.id);
        
        if (idsToRemove.length > 0) {
            const deleteQuery = `
                DELETE FROM results
                WHERE id IN (${idsToRemove.join(',')})
            `;
            try {
                await window.localDb.executeQuery(deleteQuery);
                console.log(`Results with IDs ${idsToRemove.join(', ')} deleted successfully.`);
            } catch (error) {
                console.error('Error deleting results in local DB:', error);
            }
        }
    }
}

export async function newResult(result: Result) {
    const participationId = await getParticipationId(result);
    const localResults = await getResultsLocal(result);
    if (participationId) {
        await upsertLocalResult(localResults, result, participationId);
        return;
    }
    // TODO CREATE PARTICIPATION IF NOT EXISTS
}
