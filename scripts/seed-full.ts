/**
 * FULL SCALE Data Seeding Script
 * Creates 200+ clusters, 150+ needs, 30 BRPs, 25+ cohorts, 20+ plans
 * Optimized to complete in under 2 minutes
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
    log: [], // Disable logging for speed
});

// India-wide data
const STATES_DATA = {
    "Jharkhand": {
        districts: ["Ranchi", "Dumka", "Hazaribagh", "Bokaro", "Dhanbad", "Giridih", "Deoghar", "Godda", "Koderma", "Palamu"],
        languages: ["Hindi", "Santhali", "Mundari", "Ho", "Kurukh"],
    },
    "Bihar": {
        districts: ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Darbhanga", "Purnia", "Araria", "Madhubani", "Saharsa", "Sitamarhi"],
        languages: ["Hindi", "Maithili", "Bhojpuri", "Magahi", "Angika"],
    },
    "Uttar Pradesh": {
        districts: ["Lucknow", "Kanpur", "Agra", "Varanasi", "Meerut", "Allahabad", "Bareilly", "Aligarh", "Moradabad", "Gorakhpur"],
        languages: ["Hindi", "Urdu", "Bhojpuri", "Awadhi", "Braj"],
    },
    "Madhya Pradesh": {
        districts: ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Rewa", "Satna", "Dewas", "Chhindwara"],
        languages: ["Hindi", "Bundeli", "Malvi", "Nimadi", "Gondi"],
    },
    "Chhattisgarh": {
        districts: ["Raipur", "Bilaspur", "Durg", "Korba", "Rajnandgaon", "Raigarh", "Jagdalpur", "Dhamtari", "Mahasamund", "Kanker"],
        languages: ["Hindi", "Chhattisgarhi", "Gondi", "Halbi", "Kurukh"],
    },
    "Odisha": {
        districts: ["Bhubaneswar", "Cuttack", "Berhampur", "Sambalpur", "Rourkela", "Puri", "Balasore", "Bhadrak", "Baripada", "Jeypore"],
        languages: ["Odia", "Hindi", "Santali", "Kui", "Kondh"],
    },
    "West Bengal": {
        districts: ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Bardhaman", "Malda", "Barasat", "Kharagpur", "Haldia"],
        languages: ["Bengali", "Hindi", "Santali", "Nepali", "Urdu"],
    },
    "Rajasthan": {
        districts: ["Jaipur", "Jodhpur", "Kota", "Bikaner", "Udaipur", "Ajmer", "Bhilwara", "Alwar", "Bharatpur", "Sikar"],
        languages: ["Hindi", "Rajasthani", "Marwari", "Mewari", "Bhili"],
    },
    "Maharashtra": {
        districts: ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Solapur", "Amravati", "Kolhapur", "Nanded", "Sangli"],
        languages: ["Marathi", "Hindi", "English", "Konkani", "Gujarati"],
    },
    "Tamil Nadu": {
        districts: ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Erode", "Vellore", "Thoothukudi", "Dindigul"],
        languages: ["Tamil", "English", "Telugu", "Kannada", "Malayalam"],
    },
};

const BRP_NAMES = [
    "Rajesh Kumar", "Priya Singh", "Amit Sharma", "Sunita Devi", "Ramesh Yadav",
    "Kavita Kumari", "Suresh Prasad", "Anita Gupta", "Vijay Kumar", "Meena Devi",
    "Rakesh Singh", "Pooja Sharma", "Anil Kumar", "Rekha Devi", "Manoj Yadav",
    "Sita Kumari", "Dinesh Prasad", "Geeta Gupta", "Santosh Kumar", "Radha Devi",
    "Mukesh Singh", "Asha Sharma", "Ravi Kumar", "Savita Devi", "Ajay Yadav",
    "Kiran Kumari", "Deepak Prasad", "Usha Gupta", "Pankaj Kumar", "Manju Devi",
];

const INFRASTRUCTURE_LEVELS = ["LOW", "MEDIUM", "HIGH"];
const ISSUE_TYPES = ["FLN_gaps", "digital_literacy", "assessment_techniques", "classroom_management", "subject_pedagogy_math", "subject_pedagogy_science"];
const GRADE_OPTIONS = ["1", "2", "3", "4", "5", "6", "7", "8"];
const SUBJECTS = ["Mathematics", "Science", "English", "Hindi", "Social Studies"];

function getRandomItem<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}

async function main() {
    console.log("🚀 Starting FULL SCALE data seeding...\n");

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

        console.log("📊 Creating data (this will take 1-2 minutes)...\n");

        // 1. Create 200+ Clusters
        console.log("1️⃣ Creating 200+ clusters...");
        const clusterData = [];
        const blockNames = ["Block A", "Block B", "Block C", "Central", "North", "South", "East", "West", "Rural", "Urban"];

        for (const [state, data] of Object.entries(STATES_DATA)) {
            for (const district of data.districts) {
                // Create 2 clusters per district = 200 clusters
                for (let i = 0; i < 2; i++) {
                    clusterData.push({
                        name: `${district} ${blockNames[i % blockNames.length]}`,
                        district,
                        block: `${blockNames[i % blockNames.length]} Block`,
                        state,
                        primaryLanguage: getRandomItem(data.languages),
                        infrastructureLevel: getRandomItem(INFRASTRUCTURE_LEVELS) as any,
                    });
                }
            }
        }

        await prisma.cluster.createMany({ data: clusterData });
        console.log(`✅ Created ${clusterData.length} clusters\n`);

        // 2. Create 30 BRP Users
        console.log("2️⃣ Creating 30 BRP users...");
        const userData = BRP_NAMES.map((name, index) => ({
            id: `brp_${index + 1}`,
            clerkId: `clerk_${index + 1}`,
            email: name.toLowerCase().replace(" ", ".") + "@diet.gov.in",
            name,
            role: "PLANNER" as const,
        }));

        await prisma.user.createMany({ data: userData });
        console.log(`✅ Created ${userData.length} BRP users\n`);

        // Fetch created data
        const clusters = await prisma.cluster.findMany();
        const users = await prisma.user.findMany({ where: { role: "PLANNER" } });

        // 3. Create 150+ Need Signals
        console.log("3️⃣ Creating 150+ need signals...");
        const needsData = [];

        for (let i = 0; i < 150; i++) {
            needsData.push({
                notes: `Training need ${i + 1}: ${getRandomItem(ISSUE_TYPES).replace(/_/g, " ")} identified`,
                subjects: [getRandomItem(SUBJECTS)],
                grades: [getRandomItem(GRADE_OPTIONS)],
                issueTags: [getRandomItem(ISSUE_TYPES)],
                clusterId: clusters[i % clusters.length].id,
                reportedBy: users[i % users.length].name,
            });
        }

        await prisma.needSignal.createMany({ data: needsData });
        console.log(`✅ Created ${needsData.length} need signals\n`);

        // 4. Create 25+ Cohorts
        console.log("4️⃣ Creating 25+ cohorts...");
        const cohortData = [];

        // Create cohorts for each state + issue combination
        for (const [state, data] of Object.entries(STATES_DATA)) {
            for (let i = 0; i < 3; i++) { // 3 cohorts per state = 30 cohorts
                const issue = ISSUE_TYPES[i % ISSUE_TYPES.length];
                cohortData.push({
                    name: `${state} ${issue.replace(/_/g, " ")} Cohort`,
                    description: `Training cohort for ${issue.replace(/_/g, " ")} in ${state}`,
                    tags: [issue, state],
                    primaryIssues: [issue],
                    language: getRandomItem(data.languages),
                    gradeBand: getRandomItem(["PRIMARY_1_3", "PRIMARY_4_5", "UPPER_PRIMARY_6_8"]),
                    infrastructureLevel: getRandomItem(INFRASTRUCTURE_LEVELS) as any,
                    teacherCountEstimate: Math.floor(Math.random() * 120) + 30,
                    clusterCount: Math.floor(Math.random() * 5) + 3,
                    createdById: users[i % users.length].id,
                });
            }
        }

        await prisma.cohort.createMany({ data: cohortData });
        console.log(`✅ Created ${cohortData.length} cohorts\n`);

        // Fetch cohorts
        const cohorts = await prisma.cohort.findMany();

        // 5. Create 20+ Training Plans
        console.log("5️⃣ Creating 20+ training plans...");
        let planCount = 0;

        for (let i = 0; i < Math.min(cohorts.length, 25); i++) {
            await prisma.plan.create({
                data: {
                    name: `${cohorts[i].name} Training Plan`,
                    sessionCount: Math.floor(Math.random() * 3) + 3,
                    totalDurationMinutes: Math.floor(Math.random() * 180) + 120,
                    status: Math.random() > 0.2 ? "PUBLISHED" : "DRAFT",
                    cohortId: cohorts[i].id,
                    createdById: users[i % users.length].id,
                    publishedAt: Math.random() > 0.2 ? new Date() : null,
                },
            });
            planCount++;
        }
        console.log(`✅ Created ${planCount} training plans\n`);

        // Final Summary
        console.log("\n🎉 SEEDING COMPLETE!");
        console.log("📊 Summary:");
        console.log(`   - ${Object.keys(STATES_DATA).length} states covered`);
        console.log(`   - ${clusterData.length} clusters created`);
        console.log(`   - ${userData.length} BRP users created`);
        console.log(`   - ${needsData.length} need signals created`);
        console.log(`   - ${cohortData.length} cohorts created`);
        console.log(`   - ${planCount} training plans created`);
        console.log("\n✨ Your platform now has FULL SCALE demo data!");
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
