/**
 * Database Seed Script - Simplified
 * Populates database with realistic Indian education data
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Starting database seed...");

    // Clear existing data
    console.log("🗑️  Clearing existing data...");
    await prisma.sessionFeedback.deleteMany();
    await prisma.planSession.deleteMany();
    await prisma.plan.deleteMany();
    await prisma.cohort.deleteMany();
    await prisma.needSignal.deleteMany();
    await prisma.module.deleteMany();
    await prisma.cluster.deleteMany();

    // 1. Create Clusters
    console.log("📍 Creating clusters...");

    const cluster1 = await prisma.cluster.create({
        data: {
            udiseCode: "20-05-0123-001",
            name: "Kanke Cluster",
            district: "Ranchi",
            block: "Kanke",
            state: "Jharkhand",
            languages: ["Hindi", "Mundari", "Ho"],
            primaryLanguage: "Hindi",
            infrastructureLevel: "LOW",
            type: "tribal_belt",
            schoolsCount: 8,
            teacherCountEstimate: 45,
            studentCountEstimate: 850,
        },
    });

    const cluster2 = await prisma.cluster.create({
        data: {
            udiseCode: "20-12-0234-002",
            name: "Dumka Cluster",
            district: "Dumka",
            block: "Mandar",
            state: "Jharkhand",
            languages: ["Hindi", "Santali"],
            primaryLanguage: "Hindi",
            infrastructureLevel: "LOW",
            type: "tribal_belt",
            schoolsCount: 10,
            teacherCountEstimate: 52,
            studentCountEstimate: 920,
        },
    });

    const cluster3 = await prisma.cluster.create({
        data: {
            udiseCode: "09-62-0789-007",
            name: "Pindra Cluster",
            district: "Varanasi",
            block: "Pindra",
            state: "Uttar Pradesh",
            languages: ["Hindi", "Bhojpuri"],
            primaryLanguage: "Hindi",
            infrastructureLevel: "MEDIUM",
            type: "rural",
            schoolsCount: 12,
            teacherCountEstimate: 65,
            studentCountEstimate: 1100,
        },
    });

    console.log(`✅ Created 3 clusters`);

    // 2. Create Training Modules
    console.log("📚 Creating training modules...");

    const module1 = await prisma.module.create({
        data: {
            title: "Understanding Foundational Literacy and Numeracy",
            theme: "FLN",
            competencyTags: ["reading_pedagogy", "numeracy_skills", "assessment_techniques"],
            durationMinutes: 45,
            gradeBand: "primary_1_3",
            language: "Hindi",
            infraTags: ["offline_feasible", "no_tech_required"],
            description: "Introduction to FLN concepts, challenges in Indian context, and assessment methods for early grades.",
            objectives: [
                "Understand the concept and importance of FLN in NEP 2020",
                "Identify FLN gaps in diverse classroom contexts",
                "Apply basic FLN assessment techniques",
            ],
        },
    });

    const module2 = await prisma.module.create({
        data: {
            title: "Story-Based Reading Activities for Early Grades",
            theme: "FLN - Reading",
            competencyTags: ["reading_pedagogy", "cultural_sensitivity", "resource_creation"],
            durationMinutes: 30,
            gradeBand: "primary_1_3",
            language: "Any",
            infraTags: ["offline_feasible", "no_tech_required", "low_cost"],
            description: "Using local oral stories and traditions for reading instruction without printed materials.",
            objectives: [
                "Use local oral stories for reading instruction",
                "Design reading activities without printed materials",
                "Assess comprehension through oral retelling",
            ],
        },
    });

    const module3 = await prisma.module.create({
        data: {
            title: "Managing Multi-Grade Classrooms",
            theme: "Classroom Management",
            competencyTags: ["classroom_management", "differentiated_instruction", "collaborative_learning"],
            durationMinutes: 50,
            gradeBand: "primary_1_5",
            language: "Any",
            infraTags: ["offline_feasible"],
            description: "Strategies for teaching multiple grades simultaneously in resource-constrained settings.",
            objectives: [
                "Organize classroom space for multi-grade teaching",
                "Plan lessons that engage multiple grade levels simultaneously",
                "Use peer learning strategies effectively",
            ],
        },
    });

    const module4 = await prisma.module.create({
        data: {
            title: "Low-Resource TLM Creation",
            theme: "Teaching-Learning Materials",
            competencyTags: ["resource_creation", "innovation", "sustainability"],
            durationMinutes: 40,
            gradeBand: "primary_1_5",
            language: "Any",
            infraTags: ["offline_feasible", "no_tech_required", "low_cost"],
            description: "Creating effective teaching-learning materials using locally available and recycled materials.",
            objectives: [
                "Create effective TLMs using locally available materials",
                "Design zero-cost learning aids from natural and recycled items",
                "Involve students in TLM creation",
            ],
        },
    });

    const module5 = await prisma.module.create({
        data: {
            title: "Formative Assessment in FLN",
            theme: "Assessment",
            competencyTags: ["formative_assessment", "assessment_techniques", "documentation"],
            durationMinutes: 35,
            gradeBand: "primary_1_3",
            language: "Any",
            infraTags: ["offline_feasible", "no_tech_required"],
            description: "Oral and observation-based assessment methods for early literacy and numeracy.",
            objectives: [
                "Use oral assessment methods for early literacy",
                "Create simple observation checklists",
                "Document progress without formal testing infrastructure",
            ],
        },
    });

    console.log(`✅ Created 5 training modules`);

    console.log("✅ Database seeded successfully!");
    console.log(`
📊 Summary:
- Clusters: 3
- Training Modules: 5
- Ready to use!
  `);
}

main()
    .catch((e) => {
        console.error("❌ Error seeding database:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
