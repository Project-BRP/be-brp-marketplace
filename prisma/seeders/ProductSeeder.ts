import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const productSeeder = async () => {
    const products = [
        {
            id: "NPK_15_15_15_Premium",
            name: "Pupuk NPK 15-15-15 Premium",
            description:
                "Pupuk majemuk lengkap dengan kandungan nitrogen (N), fosfor (P), dan kalium (K) dalam perbandingan seimbang. Sangat cocok untuk tanaman padi, jagung, dan sayuran.",
            productTypeId: "Pupuk_NPK",
            storageInstructions: "Simpan di tempat yang kering dan sejuk, jauhkan dari jangkauan anak-anak dan sinar matahari langsung.",
            expiredDurationInYears: 2,
            usageInstructions:
                "Aplikasikan 200-300 kg per hektar pada saat tanam dan 100-150 kg per hektar pada masa pertumbuhan vegetatif.",
            benefits:
                "Mengandung nitrogen 15% untuk pertumbuhan daun dan batang. Fosfor 15% untuk perkembangan akar dan bunga. Kalium 15% untuk ketahanan tanaman terhadap penyakit.",
        },
        {
            id: "NPK_16_16_16_Super",
            name: "Pupuk NPK 16-16-16 Super",
            description:
                "Formula NPK seimbang dengan kandungan lebih tinggi untuk pertumbuhan vegetatif yang optimal dan hasil panen melimpah.",
            productTypeId: "Pupuk_NPK",
            storageInstructions: "Simpan di tempat yang kering dan sejuk, hindari kontak dengan air sebelum digunakan.",
            expiredDurationInYears: 3,
            usageInstructions:
                "Dosis anjuran 250-350 kg per hektar, disesuaikan dengan jenis tanaman dan kondisi tanah.",
            benefits:
                "Meningkatkan pertumbuhan akar, batang, dan daun. Mempercepat pembungaan dan pembuahan. Meningkatkan kualitas dan kuantitas hasil panen.",
        },
        {
            id: "Organik_Cair_Plus",
            name: "Pupuk Organik Cair Plus",
            description:
                "Pupuk organik cair yang diperkaya dengan mikroorganisme bermanfaat untuk meningkatkan kesuburan tanah dan kesehatan tanaman.",
            productTypeId: "Pupuk_Cair",
            storageInstructions: "Kocok sebelum digunakan. Simpan di tempat teduh dan tidak terkena panas langsung.",
            expiredDurationInYears: 1,
            usageInstructions:
                "Campurkan 10-15 ml per liter air, semprotkan ke daun atau siramkan ke media tanam setiap 1-2 minggu sekali.",
            benefits:
                "Memperbaiki struktur tanah. Meningkatkan penyerapan nutrisi. Meningkatkan daya tahan tanaman terhadap hama dan penyakit.",
        },
    ];

    for (const product of products) {
        await prisma.product.create({
            data: product,
        });
    }
    console.log("Products seeded successfully!");
};
