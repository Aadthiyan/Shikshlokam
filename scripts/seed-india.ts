/**
 * Comprehensive Data Seeding Script for All India
 * Generates realistic demo data across multiple states
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// India-wide data
const STATES_DATA = {
    "Jharkhand": {
        districts: ["Ranchi", "Dumka", "Hazaribagh", "Bokaro", "Dhanbad", "Giridih", "Deoghar", "Godda", "Koderma", "Palamu"],
        languages: ["Hindi", "Santhali", "Mundari", "Ho", "Kurukh"],
        tribalAreas: true,
    },
    "Bihar": {
        districts: ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Darbhanga", "Purnia", "Araria", "Madhubani", "Saharsa", "Sitamarhi"],
        languages: ["Hindi", "Maithili", "Bhojpuri", "Magahi", "Angika"],
        tribalAreas: false,
    },
    "Uttar Pradesh": {
        districts: ["Lucknow", "Kanpur", "Agra", "Varanasi", "Meerut", "Allahabad", "Bareilly", "Aligarh", "Moradabad", "Gorakhpur"],
        languages: ["Hindi", "Urdu", "Bhojpuri", "Awadhi", "Braj"],
        tribalAreas: false,
    },
    "Madhya Pradesh": {
        districts: ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Rewa", "Satna", "Dewas", "Chhindwara"],
        languages: ["Hindi", "Bundeli", "Malvi", "Nimadi", "Gondi"],
        tribalAreas: true,
    },
    "Chhattisgarh": {
        districts: ["Raipur", "Bilaspur", "Durg", "Korba", "Rajnandgaon", "Raigarh", "Jagdalpur", "Dhamtari", "Mahasamund", "Kanker"],
        languages: ["Hindi", "Chhattisgarhi", "Gondi", "Halbi", "Kurukh"],
        tribalAreas: true,
    },
    "Odisha": {
        districts: ["Bhubaneswar", "Cuttack", "Berhampur", "Sambalpur", "Rourkela", "Puri", "Balasore", "Bhadrak", "Baripada", "Jeypore"],
        languages: ["Odia", "Hindi", "Santali", "Kui", "Kondh"],
        tribalAreas: true,
    },
    "West Bengal": {
        districts: ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Bardhaman", "Malda", "Barasat", "Kharagpur", "Haldia"],
        languages: ["Bengali", "Hindi", "Santali", "Nepali", "Urdu"],
        tribalAreas: true,
    },
    "Rajasthan": {
        districts: ["Jaipur", "Jodhpur", "Kota", "Bikaner", "Udaipur", "Ajmer", "Bhilwara", "Alwar", "Bharatpur", "Sikar"],
        languages: ["Hindi", "Rajasthani", "Marwari", "Mewari", "Bhili"],
        tribalAreas: true,
    },
    "Maharashtra": {
        districts: ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Solapur", "Amravati", "Kolhapur", "Nanded", "Sangli"],
        languages: ["Marathi", "Hindi", "English", "Konkani", "Gujarati"],
        tribalAreas: true,
    },
    "Tamil Nadu": {
        districts: ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Erode", "Vellore", "Thoothukudi", "Dindigul"],
        languages: ["Tamil", "English", "Telugu", "Kannada", "Malayalam"],
        tribalAreas: false,
    },
};

const INFRASTRUCTURE_LEVELS = ["LOW", "MEDIUM", "HIGH"];

const ISSUE_TYPES = [
    "FLN_gaps",
    "digital_literacy",
    "assessment_techniques",
    "classroom_management",
    "subject_pedagogy_math",
    "subject_pedagogy_science",
    "subject_pedagogy_english",
    "special_needs_education",
    "language_mismatch",
    "low_infrastructure",
    "teacher_motivation",
    "parent_engagement",
];

const GRADE_BANDS = ["PRIMARY_1_3", "PRIMARY_4_5", "UPPER_PRIMARY_6_8"];

const BRP_NAMES = [
    "Rajesh Kumar", "Priya Singh", "Amit Sharma", "Sunita Devi", "Ramesh Yadav",
    "Kavita Kumari", "Suresh Prasad", "Anita Gupta", "Vijay Kumar", "Meena Devi",
    "Rakesh Singh", "Pooja Sharma", "Anil Kumar", "Rekha Devi", "Manoj Yadav",
    "Sita Kumari", "Dinesh Prasad", "Geeta Gupta", "Santosh Kumar", "Radha Devi",
    "Mukesh Singh", "Asha Sharma", "Ravi Kumar", "Savita Devi", "Ajay Yadav",
    "Kiran Kumari", "Deepak Prasad", "Usha Gupta", "Pankaj Kumar", "Manju Devi",
];

// Helper function to get random item from array
function getRandomItem<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}

// Helper function to get random items from array
function getRandomItems<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Helper function to get random date in last 6 months
function getRandomDate(): Date {
    const now = new Date();
    const sixMonthsAgo = new Date(now.setMonth(now.getMonth() - 6));
    const randomTime = sixMonthsAgo.getTime() + Math.random() * (Date.now() - sixMonthsAgo.getTime());
    return new Date(randomTime);
}

async function seedClusters() {
    console.log("🌍 Seeding clusters across India...");

    const clusters = [];

    for (const [state, data] of Object.entries(STATES_DATA)) {
        for (const district of data.districts) {
            // Create 3-5 clusters per district
            const clusterCount = Math.floor(Math.random() * 3) + 3;

            for (let i = 0; i < clusterCount; i++) {
                const blockNames = ["Block A", "Block B", "Block C", "Central", "North", "South", "East", "West", "Rural", "Urban"];
                const blockName = getRandomItem(blockNames);

                clusters.push({
                    name: `${district} ${blockName} Cluster`,
                    district,
                    block: `${blockName} Block`,
                    state,
                    primaryLanguage: getRandomItem(data.languages),
                    infrastructureLevel: getRandomItem(INFRASTRUCTURE_LEVELS) as any,
                    teacherCount: Math.floor(Math.random() * 30) + 20, // 20-50 teachers
                    createdAt: getRandomDate(),
                });
            }
        }
    }

    await prisma.cluster.createMany({ data: clusters });
    console.log(`✅ Created ${clusters.length} clusters across ${Object.keys(STATES_DATA).length} states`);

    return clusters.length;
}

async function seedUsers() {
    console.log("👥 Seeding BRP users...");

    const users = BRP_NAMES.map((name, index) => {
        const states = Object.keys(STATES_DATA);
        const state = states[index % states.length];
        const email = name.toLowerCase().replace(" ", ".") + "@diet.gov.in";

        return {
            id: `brp_${index + 1}`,
            clerkId: `clerk_${index + 1}`,
            email,
            name,
            role: "PLANNER" as const,
            createdAt: getRandomDate(),
        };
    });

    await prisma.user.createMany({ data: users });
    console.log(`✅ Created ${users.length} BRP users`);

    return users;
}

async function seedNeeds() {
    console.log("📝 Seeding need signals...");

    const clusters = await prisma.cluster.findMany();
    const users = await prisma.user.findMany();

    const needTemplates = [
        "Teachers struggling with {issue} in {grade} classes",
        "{count} schools reporting {issue} challenges",
        "Urgent need for {issue} training in {district}",
        "Teachers requesting support for {issue}",
        "{issue} identified as major gap in {district} schools",
        "Low performance in {subject} due to {issue}",
        "Need training on {issue} for {grade} teachers",
    ];

    const needs = [];

    // Create 150+ needs
    for (let i = 0; i < 150; i++) {
        const cluster = getRandomItem(clusters);
        const user = getRandomItem(users);
        const issue = getRandomItem(ISSUE_TYPES);
        const gradeBand = getRandomItem(GRADE_BANDS);
        const template = getRandomItem(needTemplates);

        const description = template
            .replace("{issue}", issue.replace(/_/g, " "))
            .replace("{grade}", gradeBand.replace(/_/g, " ").toLowerCase())
            .replace("{district}", cluster.district)
            .replace("{count}", String(Math.floor(Math.random() * 20) + 5))
            .replace("{subject}", getRandomItem(["Math", "Science", "English", "Hindi"]));

        needs.push({
            description,
            subject: getRandomItem(["MATH", "SCIENCE", "ENGLISH", "HINDI", "EVS", "SOCIAL_STUDIES"]),
            grades: [gradeBand],
            issueTags: getRandomItems(ISSUE_TYPES, Math.floor(Math.random() * 3) + 1),
            clusterId: cluster.id,
            reportedBy: user.id,
            createdAt: getRandomDate(),
        });
    }

    await prisma.needSignal.createMany({ data: needs });
    console.log(`✅ Created ${needs.length} need signals`);

    return needs.length;
}

async function seedCohorts() {
    console.log("👥 Seeding cohorts...");

    const needs = await prisma.needSignal.findMany({
        include: { cluster: true },
    });

    const users = await prisma.user.findMany();

    // Group needs by state and issue
    const cohortGroups: Record<string, any[]> = {};

    needs.forEach((need) => {
        const key = `${need.cluster?.state}_${need.issueTags[0]}`;
        if (!cohortGroups[key]) {
            cohortGroups[key] = [];
        }
        cohortGroups[key].push(need);
    });

    const cohorts = [];

    for (const [key, groupNeeds] of Object.entries(cohortGroups)) {
        if (groupNeeds.length < 3) continue; // Skip small groups

        const [state, issue] = key.split("_");
        const firstNeed = groupNeeds[0];
        const gradeBand = getRandomItem(GRADE_BANDS);

        cohorts.push({
            name: `${state} ${issue.replace(/_/g, " ")} Cohort`,
            description: `Training cohort for ${issue.replace(/_/g, " ")} in ${state}`,
            tags: [issue, gradeBand, state],
            primaryIssues: [issue],
            language: firstNeed.cluster?.primaryLanguage || "Hindi",
            gradeBand,
            infrastructureLevel: firstNeed.cluster?.infrastructureLevel || "MEDIUM",
            teacherCountEstimate: Math.floor(Math.random() * 120) + 30, // 30-150 teachers
            clusterCount: Math.floor(groupNeeds.length / 3),
            createdById: getRandomItem(users).id,
            createdAt: getRandomDate(),
        });
    }

    const createdCohorts = await Promise.all(
        cohorts.map((cohort) => prisma.cohort.create({ data: cohort }))
    );

    console.log(`✅ Created ${createdCohorts.length} cohorts`);

    return createdCohorts;
}

async function seedPlans() {
    console.log("📋 Seeding training plans...");

    const cohorts = await prisma.cohort.findMany();
    const users = await prisma.user.findMany();

    const plans = [];

    // Create 20+ plans
    for (let i = 0; i < Math.min(cohorts.length, 25); i++) {
        const cohort = cohorts[i];
        const user = getRandomItem(users);

        const plan = await prisma.plan.create({
            data: {
                name: `${cohort.name} Training Plan`,
                sessionCount: Math.floor(Math.random() * 3) + 3, // 3-5 sessions
                totalDurationMinutes: Math.floor(Math.random() * 180) + 120, // 120-300 minutes
                status: Math.random() > 0.3 ? "PUBLISHED" : "DRAFT",
                cohortId: cohort.id,
                createdById: user.id,
                publishedAt: Math.random() > 0.3 ? getRandomDate() : null,
                createdAt: getRandomDate(),
            },
        });

        plans.push(plan);
    }

    console.log(`✅ Created ${plans.length} training plans`);

    return plans.length;
}

async function main() {
    console.log("🚀 Starting India-wide data seeding...\n");

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

        // Seed in order
        const clusterCount = await seedClusters();
        const users = await seedUsers();
        const needCount = await seedNeeds();
        const cohorts = await seedCohorts();
        const planCount = await seedPlans();

        console.log("\n🎉 Seeding complete!");
        console.log("📊 Summary:");
        console.log(`   - ${Object.keys(STATES_DATA).length} states covered`);
        console.log(`   - ${clusterCount} clusters created`);
        console.log(`   - ${users.length} BRP users created`);
        console.log(`   - ${needCount} need signals created`);
        console.log(`   - ${cohorts.length} cohorts created`);
        console.log(`   - ${planCount} training plans created`);
        console.log("\n✨ Your platform now has rich, India-wide demo data!");

    } catch (error) {
        console.error("❌ Error seeding data:", error);
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
