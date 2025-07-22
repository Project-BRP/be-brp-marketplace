import '../../src/configs/env';
import { PrismaClient } from "@prisma/client";
import { productSeeder } from "./ProductSeeder";
import { productVariantSeeder } from "./ProductVariantSeeder";
import { packagingSeeder } from "./packagingSeeder";

// Import your user seeder if you have one

const prisma = new PrismaClient();

async function main() {
    console.log("Start seeding ...");

    // --- Seeding Order ---
    // 1. Seed tables with no dependencies first
    // await userSeeder(); // Uncomment if you have a user seeder
    await packagingSeeder();

    // 2. Seed tables that depend on the ones above
    await productSeeder();

    // 3. Seed tables with the most dependencies last
    await productVariantSeeder();

    console.log("Seeding finished.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
