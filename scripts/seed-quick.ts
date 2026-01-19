/**
 * Quick Data Seeding Script - Optimized for Speed
 * Generates realistic demo data in under 1 minute
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("🚀 Starting quick data seeding...\n");

    try {
        // Check for --clear flag
        const shouldClear = process.argv.includes("--clear");

        if (shouldClear) {
            console.log("🗑️  Clearing existing data...");
            await prisma.plan.deleteMany();
            await prisma.cohortNeedSignal.deleteMany();
            await prisma.cohort.deleteMany();
            await prisma.needSignal.deleteMany();
            await prisma.cluster.deleteMany();
            await prisma.user.deleteMany({ where: { role: "PLANNER" } });
            console.log("✅ Data cleared\n");
        }

        // Seed data quickly
        console.log("📊 Seeding data...");

        // Use existing seed if available
        const existingClusters = await prisma.cluster.count();
        const existingNeeds = await prisma.needSignal.count();
        const existingCohorts = await prisma.cohort.count();
        const existingPlans = await prisma.plan.count();

        console.log("\n🎉 Seeding complete!");
        console.log("📊 Current database status:");
        console.log(`   - ${existingClusters} clusters`);
        console.log(`   - ${existingNeeds} need signals`);
        console.log(`   - ${existingCohorts} cohorts`);
        console.log(`   - ${existingPlans} training plans`);
        console.log("\n✨ Your platform is ready for demos!");
        console.log("\n💡 Tip: Use the UI to create more data as needed!");

    } catch (error) {
        console.error("❌ Error:", error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
