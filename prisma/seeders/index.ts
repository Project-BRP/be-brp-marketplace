import '../../src/configs/env';
import { productTypeSeeder } from './ProductTypeSeeder';
import { userSeeder } from './UserSeeder';
import { productSeeder } from './ProductSeeder';
import dotenv from 'dotenv';

const seeders: { [key: string]: () => Promise<void> } = {
  users: userSeeder,
  productTypes: productTypeSeeder,
  products: productSeeder,
};

async function main() {
  const args = process.argv.slice(2); // Ambil argumen CLI
  const seederName = args[0]; // Argumen pertama menentukan seeder

  if (!seederName) {
    console.error(
      'Please provide a seeder name to run, or "all" to run all seeders.',
    );
    process.exit(1);
  }

  if (seederName === 'all') {
    console.log('Running all seeders in order...');
    // Jalankan sesuai urutan: users → categories → articles
    const orderedSeeders = ['users', 'productTypes', 'products'];
    for (const name of orderedSeeders) {
      console.log(`Running ${name} seeder...`);
      await seeders[name](); // Jalankan seeder berdasarkan urutan
    }
    console.log('All seeders executed successfully in order!');
  } else if (seeders[seederName]) {
    console.log(`Running ${seederName} seeder...`);
    await seeders[seederName]();
    console.log(`${seederName} seeder executed successfully!`);
  } else {
    console.error(`Seeder "${seederName}" not found.`);
    process.exit(1);
  }
}

main()
  .catch(e => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    await prisma.$disconnect();
  });
