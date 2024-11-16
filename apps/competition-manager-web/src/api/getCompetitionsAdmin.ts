import { Competition } from "../type";
import { api } from "../utils/api";

const mockCompetitions: Competition[] = [
    {
        id: 1,
        name: "Meeting de concours pour tous. Spécial Perche",
        date: new Date("2025-10-20"),
        club: "USTA",
        address: "Rue de la Loi 175, 1048 Bruxelles",
    },
    {
        id: 2,
        name: "Challenge Eric De Meu | Finale + courses et perche TC",
        date: new Date("2024-11-15"),
        club: "USTA",
        address: "Rue des Palais 44, 1030 Bruxelles",
    },
    {
        id: 3,
        name: "Championnat Provinciaux Indoor | Brabant Wallon - Bruxelles - Namur",
        date: new Date("2024-12-10"),
        club: "ATH",
        address: "Rue des Francs 44, 7800 Ath"
    },
    {
        id: 4,
        name: "Competition 4",
        date: new Date("2024-09-09"),
        club: "RTBF",
        address: "Boulevard Reyers 52, 1044 Bruxelles"
    }
];

export const getCompetitionsAdmin = async (): Promise<Competition[]> => {
    // Simulate an API call with a delay
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockCompetitions);
        }, 1000);
    });
};

// export const getCompetitionsAdmin = async () => {
//     try {
//         const response = await api.get("/competitions?admin=true"); // ???
//         // parsed with zod schema
//         return response.data;
//     } catch (error) {
//         console.error(error);
//     }
