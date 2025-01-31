import { prisma } from "@competition-manager/prisma";
import { Athlete, Athlete$, License } from "@competition-manager/schemas";

export const findAthleteWithLicense = async (license: License, oneDayAthletes: Athlete[] = []) => {
    return oneDayAthletes.find((a) => a.license === license) || Athlete$.parse(await prisma.athlete.findFirstOrThrow({
        where: {
            license: license,
            competitionId: null
        },
        include: {
            club: true
        }
    }));
}