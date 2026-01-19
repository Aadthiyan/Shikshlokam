import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function clearDatabase() {
    console.log("🗑️  Starting database cleanup...");

    try {
        // Delete in correct order to respect foreign key constraints
        console.log("Deleting Plans...");
        await prisma.plan.deleteMany({});

        console.log("Deleting Cohorts...");
        await prisma.cohort.deleteMany({});

        console.log("Deleting Need Signals...");
        await prisma.needSignal.deleteMany({});

        console.log("Deleting Modules...");
        await prisma.module.deleteMany({});

        console.log("Deleting Clusters...");
        await prisma.cluster.deleteMany({});

        console.log("✅ Database cleared successfully!");
        console.log("\n📊 Final counts:");

        const counts = {
            plans: await prisma.plan.count(),
            cohorts: await prisma.cohort.count(),
            needSignals: await prisma.needSignal.count(),
            modules: await prisma.module.count(),
            clusters: await prisma.cluster.count(),
        };

        console.table(counts);
        console.log("\n✨ All data deleted. Database is now empty!");
    } catch (error) {
        console.error("❌ Error clearing database:", error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

clearDatabase()
    .then(() => {
        console.log("\n✅ Database cleanup complete!");
        process.exit(0);
    })
    .catch((error) => {
        console.error("Failed to clear database:", error);
        process.exit(1);
    });
