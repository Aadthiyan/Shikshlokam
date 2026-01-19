/**
 * Quick Script: Create Cohort from Your Need
 * Run this to manually create a cohort from your existing need
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createCohortFromNeed() {
    console.log("🔍 Finding your need...");

    // Get the need you created
    const needs = await prisma.needSignal.findMany({
        include: {
            cluster: true,
        },
        orderBy: {
            createdAt: "desc",
        },
        take: 1,
    });

    if (needs.length === 0) {
        console.log("❌ No needs found!");
        return;
    }

    const need = needs[0];
    console.log(`✅ Found need for ${need.cluster.name}`);

    // Create or get demo user
    console.log("👤 Creating demo user...");
    const user = await prisma.user.upsert({
        where: { email: "demo@diet-training.gov.in" },
        update: {},
        create: {
            clerkId: "demo_clerk_id",
            email: "demo@diet-training.gov.in",
            name: "Demo User",
            role: "PLANNER",
        },
    });

    // Create cohort
    console.log("📝 Creating cohort...");

    const cohort = await prisma.cohort.create({
        data: {
            name: `Tribal FLN - Primary 1-3 (${need.cluster.district})`,
            description: `Teachers in tribal belt with FLN gaps and multilingual challenges in ${need.cluster.district} district`,
            tags: ["FLN", "tribal", "multilingual", "low_infra"],
            primaryIssues: need.issueTags,
            language: need.cluster.primaryLanguage,
            gradeBand: "primary_1_3",
            infrastructureLevel: need.cluster.infrastructureLevel,
            teacherCountEstimate: need.cluster.teacherCountEstimate,
            clusterCount: 1,
            createdById: user.id,
            needSignals: {
                create: {
                    needSignalId: need.id,
                },
            },
        },
    });

    console.log(`✅ Cohort created: ${cohort.name}`);
    console.log(`   ID: ${cohort.id}`);
    console.log(`   Issues: ${cohort.primaryIssues.join(", ")}`);
    console.log(`   Infrastructure: ${cohort.infrastructureLevel}`);
    console.log(`   Teachers: ${cohort.teacherCountEstimate}`);

    console.log("\n🎉 Done! Now you can:");
    console.log("1. Visit http://localhost:3000/cohorts");
    console.log("2. Click on your cohort");
    console.log("3. Generate AI training plan!");
}

createCohortFromNeed()
    .catch((e) => {
        console.error("❌ Error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
