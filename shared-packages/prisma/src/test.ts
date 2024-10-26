import prisma from ".";

async function main() {

    // await prisma.userPreferences.deleteMany();
    // await prisma.user.deleteMany();

    // return;

    // create a new user
    const newUser = await prisma.user.create({
        data: {
            name: 'Alice',
            email: 'alice2@gmail.com',
            firebaseId: '12345',
            UserPreferences: {
                create: {
                    theme: 'DARK',
                    language: 'EN',
                },
            }
        },
    });
    console.log('Created new user:', newUser);

    // find user
    const user = await prisma.user.findFirst({
        where: {
            name: 'Alice',
        },
        include: {
            UserPreferences: true,
        },
    });
    console.log('Found user:', user);

    // update user
    const updatedUser = await prisma.user.update({
        where: {
            id: user?.id,
        },
        data: {
            name: 'Tom',
        },
    });
    console.log('Updated user:', updatedUser);

    // delete user
    const deletedUser = await prisma.user.delete({
        where: {
            id: user?.id,
        },
        include: {
            UserPreferences: true,
        },
    });
    console.log('Deleted user:', deletedUser);
}

main();