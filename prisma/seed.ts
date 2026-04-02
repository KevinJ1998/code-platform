import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.upsert({
        where: { email: "demo@codeplatform.com" },
        update: {},
        create: {
            email: "demo@codeplatform.com",
            name: "Demo User",
        },
    });

    const exercise1Id = "exercise-1";

    const exercise1 = await prisma.exercise.upsert({
        where: { id: exercise1Id },
        update: {
            title: "Suma básica",
            description: "Suma dos números",
            difficulty: "easy",
        },
        create: {
            id: exercise1Id,
            title: "Suma básica",
            description: "Suma dos números",
            difficulty: "easy",
        },
    });

    await prisma.testCase.createMany({
        data: [
            { exerciseId: exercise1.id, input: "1 2", output: "3" },
            { exerciseId: exercise1.id, input: "5 7", output: "12" },
        ],
    });

    console.log("Seed complete:", { user, exercise1 });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
