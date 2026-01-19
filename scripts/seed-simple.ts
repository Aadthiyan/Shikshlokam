/**
 * Simple & Fast Data Seeding Script
 * Creates demo data in under 30 seconds
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("🚀 Starting data seeding...\n");

    try {
        // Clear existing data if --clear flag
        if (process.argv.includes("--clear")) {
            console.log("🗑️  Clearing data...");
            await prisma.plan.deleteMany();
            await prisma.cohortNeedSignal.deleteMany();
            await prisma.cohort.deleteMany();
            await prisma.needSignal.deleteMany();
            await prisma.cluster.deleteMany();
            await prisma.user.deleteMany({ where: { role: "PLANNER" } });
            console.log("✅ Cleared\n");
        }

        console.log("📊 Creating data...\n");

        // 1. Create Clusters (20 clusters - quick!)
        console.log("1️⃣ Creating clusters...");
        await prisma.cluster.createMany({
            data: [
                { name: "Ranchi Central", district: "Ranchi", block: "Central", state: "Jharkhand", primaryLanguage: "Hindi", infrastructureLevel: "MEDIUM" as any },
                { name: "Ranchi North", district: "Ranchi", block: "North", state: "Jharkhand", primaryLanguage: "Hindi", infrastructureLevel: "HIGH" as any },
                { name: "Dumka Tribal", district: "Dumka", block: "Tribal", state: "Jharkhand", primaryLanguage: "Santhali", infrastructureLevel: "LOW" as any },
                { name: "Hazaribagh Urban", district: "Hazaribagh", block: "Urban", state: "Jharkhand", primaryLanguage: "Hindi", infrastructureLevel: "MEDIUM" as any },
                { name: "Bokaro Industrial", district: "Bokaro", block: "Industrial", state: "Jharkhand", primaryLanguage: "Hindi", infrastructureLevel: "HIGH" as any },
                { name: "Patna Central", district: "Patna", block: "Central", state: "Bihar", primaryLanguage: "Hindi", infrastructureLevel: "HIGH" as any },
                { name: "Gaya Rural", district: "Gaya", block: "Rural", state: "Bihar", primaryLanguage: "Hindi", infrastructureLevel: "MEDIUM" as any },
                { name: "Lucknow Urban", district: "Lucknow", block: "Urban", state: "Uttar Pradesh", primaryLanguage: "Hindi", infrastructureLevel: "HIGH" as any },
                { name: "Kanpur Central", district: "Kanpur", block: "Central", state: "Uttar Pradesh", primaryLanguage: "Hindi", infrastructureLevel: "MEDIUM" as any },
                { name: "Bhopal Central", district: "Bhopal", block: "Central", state: "Madhya Pradesh", primaryLanguage: "Hindi", infrastructureLevel: "HIGH" as any },
                { name: "Indore Urban", district: "Indore", block: "Urban", state: "Madhya Pradesh", primaryLanguage: "Hindi", infrastructureLevel: "HIGH" as any },
                { name: "Raipur Central", district: "Raipur", block: "Central", state: "Chhattisgarh", primaryLanguage: "Hindi", infrastructureLevel: "MEDIUM" as any },
                { name: "Bhubaneswar Urban", district: "Bhubaneswar", block: "Urban", state: "Odisha", primaryLanguage: "Odia", infrastructureLevel: "HIGH" as any },
                { name: "Kolkata Central", district: "Kolkata", block: "Central", state: "West Bengal", primaryLanguage: "Bengali", infrastructureLevel: "HIGH" as any },
                { name: "Jaipur Urban", district: "Jaipur", block: "Urban", state: "Rajasthan", primaryLanguage: "Hindi", infrastructureLevel: "HIGH" as any },
                { name: "Mumbai Central", district: "Mumbai", block: "Central", state: "Maharashtra", primaryLanguage: "Marathi", infrastructureLevel: "HIGH" as any },
                { name: "Pune Urban", district: "Pune", block: "Urban", state: "Maharashtra", primaryLanguage: "Marathi", infrastructureLevel: "HIGH" as any },
                { name: "Chennai Central", district: "Chennai", block: "Central", state: "Tamil Nadu", primaryLanguage: "Tamil", infrastructureLevel: "HIGH" as any },
                { name: "Coimbatore Urban", district: "Coimbatore", block: "Urban", state: "Tamil Nadu", primaryLanguage: "Tamil", infrastructureLevel: "MEDIUM" as any },
                { name: "Madurai Rural", district: "Madurai", block: "Rural", state: "Tamil Nadu", primaryLanguage: "Tamil", infrastructureLevel: "MEDIUM" as any },
            ],
        });
        const clusters = await prisma.cluster.findMany();
        console.log(`✅ Created ${clusters.length} clusters\n`);

        // 2. Create Users (10 BRPs)
        console.log("2️⃣ Creating BRP users...");
        await prisma.user.createMany({
            data: [
                { id: "brp_1", clerkId: "clerk_1", email: "rajesh.kumar@diet.gov.in", name: "Rajesh Kumar", role: "PLANNER" as const },
                { id: "brp_2", clerkId: "clerk_2", email: "priya.singh@diet.gov.in", name: "Priya Singh", role: "PLANNER" as const },
                { id: "brp_3", clerkId: "clerk_3", email: "amit.sharma@diet.gov.in", name: "Amit Sharma", role: "PLANNER" as const },
                { id: "brp_4", clerkId: "clerk_4", email: "sunita.devi@diet.gov.in", name: "Sunita Devi", role: "PLANNER" as const },
                { id: "brp_5", clerkId: "clerk_5", email: "ramesh.yadav@diet.gov.in", name: "Ramesh Yadav", role: "PLANNER" as const },
                { id: "brp_6", clerkId: "clerk_6", email: "kavita.kumari@diet.gov.in", name: "Kavita Kumari", role: "PLANNER" as const },
                { id: "brp_7", clerkId: "clerk_7", email: "suresh.prasad@diet.gov.in", name: "Suresh Prasad", role: "PLANNER" as const },
                { id: "brp_8", clerkId: "clerk_8", email: "anita.gupta@diet.gov.in", name: "Anita Gupta", role: "PLANNER" as const },
                { id: "brp_9", clerkId: "clerk_9", email: "vijay.kumar@diet.gov.in", name: "Vijay Kumar", role: "PLANNER" as const },
                { id: "brp_10", clerkId: "clerk_10", email: "meena.devi@diet.gov.in", name: "Meena Devi", role: "PLANNER" as const },
            ],
        });
        const users = await prisma.user.findMany({ where: { role: "PLANNER" } });
        console.log(`✅ Created ${users.length} BRP users\n`);

        // 3. Create Needs (30 needs - manageable!)
        console.log("3️⃣ Creating need signals...");
        const needsData = [];
        const issues = ["FLN_gaps", "digital_literacy", "assessment_techniques", "classroom_management", "subject_pedagogy_math"];
        const gradeOptions = ["1", "2", "3", "4", "5", "6", "7", "8"];

        for (let i = 0; i < 30; i++) {
            needsData.push({
                notes: `Need ${i + 1}: Training required for ${issues[i % issues.length]}`,
                subjects: ["Mathematics"],
                grades: [gradeOptions[i % gradeOptions.length]],
                issueTags: [issues[i % issues.length]],
                clusterId: clusters[i % clusters.length].id,
                reportedBy: users[i % users.length].name,
            });
        }
        await prisma.needSignal.createMany({ data: needsData });
        console.log(`✅ Created ${needsData.length} need signals\n`);

        // 4. Create Cohorts (5 cohorts)
        console.log("4️⃣ Creating cohorts...");
        await prisma.cohort.createMany({
            data: [
                { name: "Jharkhand FLN Cohort", description: "FLN training for Jharkhand", tags: ["FLN_gaps"], primaryIssues: ["FLN_gaps"], language: "Hindi", gradeBand: "PRIMARY_1_3", infrastructureLevel: "MEDIUM" as any, teacherCountEstimate: 156, clusterCount: 5, createdById: users[0].id },
                { name: "Bihar Digital Literacy Cohort", description: "Digital literacy training for Bihar", tags: ["digital_literacy"], primaryIssues: ["digital_literacy"], language: "Hindi", gradeBand: "PRIMARY_4_5", infrastructureLevel: "MEDIUM" as any, teacherCountEstimate: 89, clusterCount: 3, createdById: users[1].id },
                { name: "UP Math Pedagogy Cohort", description: "Math pedagogy training for UP", tags: ["subject_pedagogy_math"], primaryIssues: ["subject_pedagogy_math"], language: "Hindi", gradeBand: "UPPER_PRIMARY_6_8", infrastructureLevel: "HIGH" as any, teacherCountEstimate: 124, clusterCount: 4, createdById: users[2].id },
                { name: "MP Assessment Cohort", description: "Assessment training for MP", tags: ["assessment_techniques"], primaryIssues: ["assessment_techniques"], language: "Hindi", gradeBand: "PRIMARY_1_3", infrastructureLevel: "MEDIUM" as any, teacherCountEstimate: 78, clusterCount: 3, createdById: users[3].id },
                { name: "Tamil Nadu Classroom Management Cohort", description: "Classroom management for Tamil Nadu", tags: ["classroom_management"], primaryIssues: ["classroom_management"], language: "Tamil", gradeBand: "PRIMARY_4_5", infrastructureLevel: "HIGH" as any, teacherCountEstimate: 102, clusterCount: 3, createdById: users[4].id },
            ],
        });
        const cohorts = await prisma.cohort.findMany();
        console.log(`✅ Created ${cohorts.length} cohorts\n`);

        // 5. Create Plans (5 plans)
        console.log("5️⃣ Creating training plans...");
        for (const cohort of cohorts) {
            await prisma.plan.create({
                data: {
                    name: `${cohort.name} Training Plan`,
                    sessionCount: 4,
                    totalDurationMinutes: 240,
                    status: "PUBLISHED",
                    cohortId: cohort.id,
                    createdById: users[0].id,
                    publishedAt: new Date(),
                },
            });
        }
        console.log(`✅ Created ${cohorts.length} training plans\n`);

        // Summary
        console.log("\n🎉 Seeding complete!");
        console.log("📊 Summary:");
        console.log(`   - ${clusters.length} clusters (across 10 states)`);
        console.log(`   - ${users.length} BRP users`);
        console.log(`   - ${needsData.length} need signals`);
        console.log(`   - ${cohorts.length} cohorts`);
        console.log(`   - ${cohorts.length} training plans`);
        console.log("\n✨ Your platform now has demo data!");
        console.log("\n💡 Next: Open http://localhost:3000 to see your data!");

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
