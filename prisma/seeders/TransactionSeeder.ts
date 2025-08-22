// prisma/seeders/TransactionSeeder.ts

import {
  Prisma,
  PrismaClient,
  TxDeliveryStatus,
  TxManualStatus,
  TxMethod,
} from '@prisma/client';
import { v4 as uuid } from 'uuid';

const prisma = new PrismaClient();

// Helper function to get a random element from an array
const getRandomElement = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

// Helper function to get a random number in a range
const getRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// ✅ BARU: Helper function untuk membuat tanggal acak pada bulan dan tahun tertentu
const getRandomDateInMonth = (year: number, month: number): Date => {
  const day = getRandomNumber(1, 28); // Ambil tanggal 1-28 agar aman untuk semua bulan
  const hour = getRandomNumber(0, 23);
  const minute = getRandomNumber(0, 59);
  const second = getRandomNumber(0, 59);
  // Menggunakan WIB (UTC+7)
  return new Date(Date.UTC(year, month, day, hour - 7, minute, second));
};

// Interface untuk item dalam transaksi
interface ITransactionItemSeed {
  id: string;
  transactionId: string;
  variantId: string;
  quantity: number;
  priceRupiah: number;
}

// Interface untuk objek transaksi yang akan dibuat
interface ICreatedTransactionSeed {
  transactionData: Prisma.TransactionCreateInput;
  items: ITransactionItemSeed[];
}

export const transactionSeeder = async () => {
  console.log('Starting transaction seeder...');

  // 1. Ambil data yang dibutuhkan dari database
  const users = await prisma.user.findMany();
  const productVariants = await prisma.productVariant.findMany();
  const ppn = await prisma.currentPPN.findFirst();

  if (users.length === 0) {
    console.error('❌ No users found. Please seed users first.');
    return;
  }
  if (productVariants.length === 0) {
    console.error(
      '❌ No product variants found. Please seed product variants first.',
    );
    return;
  }
  if (!ppn) {
    console.error('❌ PPN setting not found. Please set a PPN value.');
    return;
  }

  const numberOfTransactions = 50;
  const createdTransactions: ICreatedTransactionSeed[] = [];
  
  // Dapatkan bulan dan tahun saat ini
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-11 (Januari-Desember)
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const yearForLastMonth = currentMonth === 0 ? currentYear - 1 : currentYear;


  // 2. Buat transaksi sebanyak numberOfTransactions
  for (let i = 0; i < numberOfTransactions; i++) {
    const randomUser = getRandomElement(users);
    const transactionId = `TX-${uuid()}`;

    // ✅ BARU: Tentukan tanggal transaksi secara acak (50% bulan ini, 50% bulan lalu)
    const isCurrentMonth = Math.random() < 0.5;
    const transactionDate = isCurrentMonth
      ? getRandomDateInMonth(currentYear, currentMonth)
      : getRandomDateInMonth(yearForLastMonth, lastMonth);

    // 3. Simulasikan isi keranjang belanja
    const cartItemsCount = getRandomNumber(1, 5);
    const selectedVariants: { variantId: string; quantity: number }[] = [];
    const availableVariants = [...productVariants];

    for (let j = 0; j < cartItemsCount; j++) {
      if (availableVariants.length === 0) break;
      const variantIndex = Math.floor(Math.random() * availableVariants.length);
      const variant = availableVariants[variantIndex];
      if (variant.stock > 0) {
        selectedVariants.push({
          variantId: variant.id,
          quantity: getRandomNumber(1, Math.min(3, variant.stock)),
        });
        availableVariants.splice(variantIndex, 1);
      }
    }

    if (selectedVariants.length === 0) continue;

    // 4. Hitung total harga dan berat
    let cleanPrice = 0;
    let totalWeightInKg = 0;
    const transactionItemsData: ITransactionItemSeed[] = [];

    for (const item of selectedVariants) {
      const variantDetails = productVariants.find(v => v.id === item.variantId)!;
      const itemPrice = variantDetails.priceRupiah * item.quantity;
      cleanPrice += itemPrice;
      totalWeightInKg += variantDetails.weight_in_kg * item.quantity;
      transactionItemsData.push({
        id: `TI-${uuid()}`,
        transactionId: transactionId,
        variantId: item.variantId,
        quantity: item.quantity,
        priceRupiah: itemPrice,
      });
    }
    
    // 5. Tentukan metode dan status transaksi secara acak
    const method = getRandomElement([TxMethod.DELIVERY, TxMethod.MANUAL]);
    let deliveryStatus: TxDeliveryStatus | null = null;
    let manualStatus: TxManualStatus | null = null;
    let shippingCost = 0;

    const isCompleted = Math.random() < 0.9;

    if (method === TxMethod.DELIVERY) {
      shippingCost = getRandomNumber(10000, 50000);
      deliveryStatus = isCompleted
        ? TxDeliveryStatus.DELIVERED
        : getRandomElement([
            TxDeliveryStatus.UNPAID,
            TxDeliveryStatus.PAID,
            TxDeliveryStatus.SHIPPED,
          ]);
    } else {
      manualStatus = isCompleted
        ? TxManualStatus.COMPLETE
        : getRandomElement([
            TxManualStatus.UNPAID,
            TxManualStatus.PAID,
            TxManualStatus.PROCESSING,
          ]);
    }

    const priceWithPPN = cleanPrice * (1 + ppn.percentage / 100);
    const totalPrice = priceWithPPN + shippingCost;

    // 6. Siapkan data untuk dimasukkan ke database
    const transactionData: Prisma.TransactionCreateInput = {
      id: transactionId,
      user: { connect: { id: randomUser.id } },
      userName: randomUser.name,
      userEmail: randomUser.email,
      userPhoneNumber: randomUser.phoneNumber,
      method,
      deliveryStatus,
      manualStatus,
      cleanPrice,
      priceWithPPN: Math.round(priceWithPPN),
      totalPrice: Math.round(totalPrice),
      totalWeightInKg,
      PPNPercentage: ppn.percentage,
      city: 'Surabaya',
      province: 'Jawa Timur',
      district: 'Gubeng',
      subDistrict: 'Kertajaya',
      postalCode: '60282',
      shippingAddress: 'Jl. Contoh Alamat No. 123',
      shippingAgent: method === TxMethod.DELIVERY ? 'JNE' : null,
      shippingCode: method === TxMethod.DELIVERY ? 'jne' : null,
      shippingService: method === TxMethod.DELIVERY ? 'REG' : null,
      shippingEstimate: method === TxMethod.DELIVERY ? '2-3 hari' : null,
      shippingCost,
      paymentMethod: 'bank_transfer',
      createdAt: transactionDate, // ✅ BARU: Gunakan tanggal yang sudah dibuat
    };

    createdTransactions.push({
      transactionData,
      items: transactionItemsData,
    });
  }

  // 7. Masukkan semua data transaksi ke database
  for (const tx of createdTransactions) {
    try {
      await prisma.transaction.create({
        data: {
          ...tx.transactionData,
          transactionItems: {
            createMany: {
              data: tx.items.map(
                ({ transactionId, ...rest }) => rest,
              ),
            },
          },
        },
      });
    } catch (error) {
      console.error(
        `❌ Failed to create transaction ${tx.transactionData.id}:`,
        error,
      );
    }
  }

  console.log(
    `✅ Transactions seeded successfully! (${createdTransactions.length} created)`,
  );
};