import '../../src/configs/env';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const productTypeSeeder = async () => {
  const productTypes = [
    { id: 'Pupuk_Organik', name: 'Pupuk Organik' },
    { id: 'Pupuk_Kimia', name: 'Pupuk Kimia' },
    { id: 'Pupuk_Hayati', name: 'Pupuk Hayati' },
    { id: 'Pupuk_NPK', name: 'Pupuk NPK' },
    { id: 'Pupuk_Kandang', name: 'Pupuk Kandang' },
    { id: 'Pupuk_Cair', name: 'Pupuk Cair' },
    { id: 'Pupuk_Granul', name: 'Pupuk Granul' },
    { id: 'Pupuk_Mikro', name: 'Pupuk Mikro' },
  ];
  for (const type of productTypes) {
    await prisma.productType.create({
      data: {
        id: type.id,
        name: type.name,
      },
    });
  }
  console.log('Product types seeded successfully!');
};