import { Athlete, CompetitionEvent, Date } from "@competition-manager/schemas";
import { getCategoryAbbr } from "..";

/**
 * Check if the athlete is in one of the categories of the event
 * @param event The event to check
 * @param athlete The athlete to check
 * @param competitionDate The date of the competition
 * @returns True if the athlete is in one of the categories of the event
 */

export const checkCategory = (event: CompetitionEvent, athlete: Athlete, competitionDate: Date): boolean => {
    const eventCategoriesAbbrs = event.categories.map((category) => category.abbr);
    const athleteCategoryAbbr = getCategoryAbbr(athlete.birthdate, athlete.gender, competitionDate);
    return eventCategoriesAbbrs.includes(athleteCategoryAbbr);
}
