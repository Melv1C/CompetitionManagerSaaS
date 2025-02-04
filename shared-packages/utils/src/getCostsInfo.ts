import { Athlete, Competition, CompetitionEvent, Eid, Id, Inscription, License, PaymentMethod } from "@competition-manager/schemas";
import { isAthleteInAFreeClub } from "./checkInscription";

const BASE_FEE = 0.35;
const VARIABLE_RATE = 0.02;

/**
 * Calculate the fees for a given total
 * @param total
 * @returns the fees
 */
export const getFees = (total: number) => {
    if (total <= 0) {
        return 0;
    }
    return Math.round((BASE_FEE + VARIABLE_RATE * total) * 100) / 100;
};


/**
 * Get the total amount already paid by a user for a given athlete license
 * @param userInscriptions
 * @param userId
 * @param athleteLicense
 * @returns the total amount already paid
 */
export const getAlreadPaid = (userInscriptions: Inscription[], athleteLicense: License) => {
    return userInscriptions.filter((i) => i.athlete.license === athleteLicense).reduce((acc, i) => acc + i.paid, 0);
}

/**
 * Get the total amount to pay for a given set of events
 * @param events
 * @param competitionEventEids
 * @returns the total amount to pay
 */

export const getTotalToPay = (events: CompetitionEvent[], competitionEventEids: Eid[]) => {
    return events.filter((e) => competitionEventEids.includes(e.eid)).reduce((acc, e) => acc + e.cost, 0);
}

/**
 * Get the costs info for a given competition, athlete, competition events, user inscriptions
 * @param competition
 * @param athlete
 * @param competitionEventEids
 * @param userInscriptions
 * @returns the costs info
 */
export const getCostsInfo = (competition: Competition, athlete: Athlete, competitionEventEids: Eid[], userInscriptions: Inscription[]) => {
    if (competition.method === PaymentMethod.FREE || isAthleteInAFreeClub(competition, athlete)) {
        return {
            totalCost: 0,
            alreadyPaid: 0,
            fees: 0,
            totalToPay: 0,
        };
    }

    const totalCost = getTotalToPay(competition.events, competitionEventEids);
    const alreadyPaid = getAlreadPaid(userInscriptions, athlete.license);
    const fees = competition.method === PaymentMethod.ONLINE ? getFees(totalCost - alreadyPaid) : 0;
    const totalToPay = Math.max(0, totalCost - alreadyPaid + fees);

    return {
        totalCost,
        alreadyPaid,
        fees,
        totalToPay,
    };
}