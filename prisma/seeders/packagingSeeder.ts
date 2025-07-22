import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const packagingSeeder = async () => {
    const packagings = [
        { id: "Karung_50kg", name: "Karung 50kg" },
        { id: "Karung_25kg", name: "Karung 25kg" },
        { id: "Botol_1L", name: "Botol 1 Liter" },
        { id: "Sachet_1kg", name: "Sachet 1kg" },
    ];

    for (const packaging of packagings) {
        await prisma.packaging.create({
            data: {
                id: packaging.id,
                name: packaging.name,
            },
        });
    }
    console.log("Packaging types seeded successfully!");
};
