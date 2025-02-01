
export const competitionInclude = {
    events: {
        include: {
            categories: true,
            event: true,
        },
    },
    paymentPlan: {
        include: {
            includedOptions: true,
        },
    },
    options: true,
    admins: {
        include: {
            user: true,
        },
    },
    freeClubs: true,
}