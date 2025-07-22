import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const productVariantSeeder = async () => {
    const variants = [
        {
            id: "NPK_15_15_15_Premium_50kg",
            productId: "NPK_15_15_15_Premium",
            weight: "50 kg",
            composition: "Nitrogen (N): 15%, Fosfor (P2O5): 15%, Kalium (K2O): 15%",
            packagingId: "Karung_50kg",
            imageUrl: "/dashboard/Hero.jpg",
            priceRupiah: 125000,
        },
        {
            id: "NPK_15_15_15_Premium_25kg",
            productId: "NPK_15_15_15_Premium",
            weight: "25 kg",
            composition: "Nitrogen (N): 15%, Fosfor (P2O5): 15%, Kalium (K2O): 15%",
            packagingId: "Karung_25kg",
            imageUrl: "/dashboard/Hero.jpg",
            priceRupiah: 70000,
        },
        {
            id: "NPK_16_16_16_Super_50kg",
            productId: "NPK_16_16_16_Super",
            weight: "50 kg",
            composition: "Nitrogen (N): 16%, Fosfor (P2O5): 16%, Kalium (K2O): 16%",
            packagingId: "Karung_50kg",
            imageUrl: "/dashboard/Hero.jpg",
            priceRupiah: 135000,
        },
        {
            id: "Organik_Cair_Plus_1L",
            productId: "Organik_Cair_Plus",
            weight: "1 Liter",
            composition: "Bahan Organik: 20%, C-Organik: 15%, N+P+K: 5%",
            packagingId: "Botol_1L",
            imageUrl: "/dashboard/Hero.jpg",
            priceRupiah: 55000,
        },
    ];

    for (const variant of variants) {
        await prisma.productVariant.create({
            data: variant,
        });
    }
    console.log("Product variants seeded successfully!");
};
