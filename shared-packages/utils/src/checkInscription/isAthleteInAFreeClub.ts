import { Athlete, Competition } from "@competition-manager/schemas";

/**
 * Check if the athlete is in a free club
 * @param competition
 * @param athlete
 * @returns boolean
 * 
*/

export const isAthleteInAFreeClub = (competition: Competition, athlete: Athlete) => {
    return competition.freeClubs.map((club) => club.id).includes(athlete.club.id);
};