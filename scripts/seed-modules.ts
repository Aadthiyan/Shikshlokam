import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const MODULES_DATA = [
    // FLN (5 modules)
    { title: "Introduction to FLN", theme: "FLN", description: "Understanding Foundational Literacy and Numeracy concepts and importance for early grade students", durationMinutes: 120, gradeBand: "primary_1_3", language: "Any", competencyTags: ["foundational_literacy", "numeracy_basics"], infraTags: ["offline_feasible", "no_tech_required"], objectives: ["Understand FLN concepts", "Identify learning gaps", "Apply basic strategies"] },
    { title: "Teaching Reading Skills", theme: "FLN", description: "Phonics, comprehension, and fluency strategies for early readers", durationMinutes: 180, gradeBand: "primary_1_3", language: "Any", competencyTags: ["reading_pedagogy", "phonics"], infraTags: ["offline_feasible"], objectives: ["Teach phonics effectively", "Build reading fluency", "Assess comprehension"] },
    { title: "Numeracy Fundamentals", theme: "FLN", description: "Number sense, basic operations, and problem-solving skills", durationMinutes: 150, gradeBand: "primary_1_3", language: "Any", competencyTags: ["numeracy", "problem_solving"], infraTags: ["offline_feasible", "no_tech_required"], objectives: ["Develop number sense", "Teach basic operations", "Foster problem-solving"] },
    { title: "FLN Assessment Techniques", theme: "FLN", description: "Diagnostic tools and progress tracking for FLN", durationMinutes: 120, gradeBand: "primary_1_3", language: "Any", competencyTags: ["assessment", "diagnostic_tools"], infraTags: ["offline_feasible"], objectives: ["Use diagnostic tools", "Track student progress", "Analyze learning data"] },
    { title: "Remedial Teaching for FLN", theme: "FLN", description: "Intervention strategies for struggling learners in foundational skills", durationMinutes: 180, gradeBand: "primary_1_3", language: "Any", competencyTags: ["remedial_teaching", "intervention"], infraTags: ["offline_feasible"], objectives: ["Identify struggling learners", "Apply intervention strategies", "Monitor improvement"] },

    // Digital Literacy (5 modules)
    { title: "Digital Tools for Teachers", theme: "Digital Literacy", description: "Basic digital tools and platforms for modern teaching", durationMinutes: 120, gradeBand: "all", language: "Any", competencyTags: ["digital_tools", "technology"], infraTags: ["projector_required", "internet_required"], objectives: ["Use basic digital tools", "Navigate learning platforms", "Create digital lessons"] },
    { title: "Creating Digital Content", theme: "Digital Literacy", description: "Presentations, videos, and interactive learning materials", durationMinutes: 180, gradeBand: "all", language: "Any", competencyTags: ["content_creation", "multimedia"], infraTags: ["computer_required", "internet_required"], objectives: ["Create presentations", "Develop video content", "Design interactive materials"] },
    { title: "Online Teaching Strategies", theme: "Digital Literacy", description: "Virtual classroom management and student engagement online", durationMinutes: 150, gradeBand: "all", language: "Any", competencyTags: ["online_teaching", "virtual_classroom"], infraTags: ["internet_required", "video_conferencing"], objectives: ["Manage virtual classrooms", "Engage students online", "Use collaboration tools"] },
    { title: "Educational Apps & Software", theme: "Digital Literacy", description: "Learning apps and productivity tools for education", durationMinutes: 120, gradeBand: "all", language: "Any", competencyTags: ["educational_apps", "software"], infraTags: ["tablet_required", "internet_required"], objectives: ["Explore educational apps", "Integrate apps in teaching", "Evaluate app effectiveness"] },
    { title: "Digital Safety & Ethics", theme: "Digital Literacy", description: "Online safety and digital citizenship for students", durationMinutes: 90, gradeBand: "all", language: "Any", competencyTags: ["digital_safety", "ethics"], infraTags: ["offline_feasible"], objectives: ["Teach online safety", "Promote digital citizenship", "Address cyberbullying"] },

    // Classroom Management (5 modules)
    { title: "Effective Classroom Management", theme: "Classroom Management", description: "Creating positive and productive learning environments", durationMinutes: 120, gradeBand: "all", language: "Any", competencyTags: ["classroom_management", "environment"], infraTags: ["offline_feasible", "no_tech_required"], objectives: ["Establish classroom routines", "Create positive environment", "Manage transitions"] },
    { title: "Behavior Management Strategies", theme: "Classroom Management", description: "Handling discipline and motivation techniques", durationMinutes: 150, gradeBand: "all", language: "Any", competencyTags: ["behavior_management", "discipline"], infraTags: ["offline_feasible", "no_tech_required"], objectives: ["Address behavioral issues", "Motivate students", "Use positive reinforcement"] },
    { title: "Time Management in Classroom", theme: "Classroom Management", description: "Lesson pacing and smooth activity transitions", durationMinutes: 90, gradeBand: "all", language: "Any", competencyTags: ["time_management", "pacing"], infraTags: ["offline_feasible", "no_tech_required"], objectives: ["Plan lesson timing", "Manage transitions", "Optimize learning time"] },
    { title: "Creating Inclusive Classrooms", theme: "Classroom Management", description: "Diversity, differentiation, and accessibility in teaching", durationMinutes: 180, gradeBand: "all", language: "Any", competencyTags: ["inclusive_education", "differentiation"], infraTags: ["offline_feasible"], objectives: ["Understand diversity", "Differentiate instruction", "Ensure accessibility"] },
    { title: "Student Engagement Techniques", theme: "Classroom Management", description: "Active learning and participation strategies", durationMinutes: 120, gradeBand: "all", language: "Any", competencyTags: ["student_engagement", "active_learning"], infraTags: ["offline_feasible"], objectives: ["Engage all students", "Use active learning", "Encourage participation"] },

    // Assessment (5 modules)
    { title: "Formative Assessment Strategies", theme: "Assessment", description: "Ongoing assessment and effective feedback methods", durationMinutes: 120, gradeBand: "all", language: "Any", competencyTags: ["formative_assessment", "feedback"], infraTags: ["offline_feasible"], objectives: ["Conduct formative assessments", "Provide effective feedback", "Adjust instruction"] },
    { title: "Summative Assessment Design", theme: "Assessment", description: "Test creation and grading rubrics", durationMinutes: 150, gradeBand: "all", language: "Any", competencyTags: ["summative_assessment", "rubrics"], infraTags: ["offline_feasible"], objectives: ["Design valid tests", "Create rubrics", "Grade fairly"] },
    { title: "Competency-Based Assessment", theme: "Assessment", description: "NEP 2020 aligned assessment approaches", durationMinutes: 180, gradeBand: "all", language: "Any", competencyTags: ["competency_based", "nep_2020"], infraTags: ["offline_feasible"], objectives: ["Understand competency-based assessment", "Align with NEP 2020", "Measure competencies"] },
    { title: "Portfolio Assessment", theme: "Assessment", description: "Student work collection and reflection", durationMinutes: 120, gradeBand: "all", language: "Any", competencyTags: ["portfolio", "reflection"], infraTags: ["offline_feasible"], objectives: ["Create student portfolios", "Guide reflection", "Assess growth"] },
    { title: "Using Assessment Data", theme: "Assessment", description: "Data analysis for instructional decisions", durationMinutes: 150, gradeBand: "all", language: "Any", competencyTags: ["data_analysis", "decision_making"], infraTags: ["computer_helpful"], objectives: ["Analyze assessment data", "Make data-driven decisions", "Track progress"] },

    // STEM (5 modules)
    { title: "Inquiry-Based Science Teaching", theme: "STEM", description: "Hands-on experiments and scientific method", durationMinutes: 180, gradeBand: "primary_4_5", language: "Any", competencyTags: ["inquiry_based", "science_pedagogy"], infraTags: ["lab_equipment_required"], objectives: ["Teach scientific method", "Conduct experiments", "Foster inquiry"] },
    { title: "Mathematics Pedagogy", theme: "STEM", description: "Conceptual understanding and problem-solving in mathematics", durationMinutes: 150, gradeBand: "all", language: "Any", competencyTags: ["math_pedagogy", "conceptual_understanding"], infraTags: ["offline_feasible"], objectives: ["Build conceptual understanding", "Teach problem-solving", "Use manipulatives"] },
    { title: "Technology Integration in STEM", theme: "STEM", description: "Simulations, coding, and digital tools for STEM", durationMinutes: 120, gradeBand: "secondary", language: "Any", competencyTags: ["technology_integration", "coding"], infraTags: ["computer_required", "internet_required"], objectives: ["Use STEM software", "Teach basic coding", "Integrate simulations"] },
    { title: "Project-Based STEM Learning", theme: "STEM", description: "Real-world projects and collaboration in STEM", durationMinutes: 180, gradeBand: "secondary", language: "Any", competencyTags: ["project_based", "collaboration"], infraTags: ["offline_feasible"], objectives: ["Design STEM projects", "Facilitate collaboration", "Connect to real world"] },
    { title: "STEM Career Awareness", theme: "STEM", description: "Inspiring students about STEM career pathways", durationMinutes: 90, gradeBand: "secondary", language: "Any", competencyTags: ["career_awareness", "inspiration"], infraTags: ["offline_feasible"], objectives: ["Introduce STEM careers", "Inspire students", "Connect learning to careers"] },

    // Language Teaching (5 modules)
    { title: "English Language Teaching Methods", theme: "Language", description: "Grammar, vocabulary, and communication skills in English", durationMinutes: 180, gradeBand: "all", language: "English", competencyTags: ["english_teaching", "communication"], infraTags: ["offline_feasible"], objectives: ["Teach grammar effectively", "Build vocabulary", "Develop communication skills"] },
    { title: "Hindi Language Pedagogy", theme: "Language", description: "Reading, writing, and literature in Hindi", durationMinutes: 150, gradeBand: "all", language: "Hindi", competencyTags: ["hindi_teaching", "literature"], infraTags: ["offline_feasible"], objectives: ["Teach Hindi reading", "Develop writing skills", "Explore literature"] },
    { title: "Multilingual Education", theme: "Language", description: "Mother tongue and second language acquisition", durationMinutes: 120, gradeBand: "primary_1_3", language: "Any", competencyTags: ["multilingual", "language_acquisition"], infraTags: ["offline_feasible"], objectives: ["Support mother tongue", "Teach second language", "Value linguistic diversity"] },
    { title: "Literature Teaching Strategies", theme: "Language", description: "Analysis, interpretation, and appreciation of literature", durationMinutes: 150, gradeBand: "secondary", language: "Any", competencyTags: ["literature", "critical_thinking"], infraTags: ["offline_feasible"], objectives: ["Teach literary analysis", "Foster interpretation", "Build appreciation"] },
    { title: "Language Assessment Techniques", theme: "Language", description: "Testing speaking, listening, reading, and writing skills", durationMinutes: 120, gradeBand: "all", language: "Any", competencyTags: ["language_assessment", "four_skills"], infraTags: ["offline_feasible"], objectives: ["Assess speaking", "Test listening", "Evaluate reading and writing"] },

    // Holistic Development (5 modules)
    { title: "Socio-Emotional Learning (SEL)", theme: "Holistic Development", description: "Emotional intelligence and social skills development", durationMinutes: 150, gradeBand: "all", language: "Any", competencyTags: ["sel", "emotional_intelligence"], infraTags: ["offline_feasible", "no_tech_required"], objectives: ["Teach emotional awareness", "Build social skills", "Foster empathy"] },
    { title: "Arts Integration in Education", theme: "Holistic Development", description: "Music, drama, and visual arts in learning", durationMinutes: 120, gradeBand: "all", language: "Any", competencyTags: ["arts_integration", "creativity"], infraTags: ["art_supplies_helpful"], objectives: ["Integrate arts", "Foster creativity", "Use arts for learning"] },
    { title: "Physical Education & Sports", theme: "Holistic Development", description: "Movement, health, and teamwork through sports", durationMinutes: 120, gradeBand: "all", language: "Any", competencyTags: ["physical_education", "sports"], infraTags: ["playground_required"], objectives: ["Teach physical activities", "Promote health", "Build teamwork"] },
    { title: "Value Education", theme: "Holistic Development", description: "Ethics, character building, and citizenship", durationMinutes: 90, gradeBand: "all", language: "Any", competencyTags: ["values", "character"], infraTags: ["offline_feasible", "no_tech_required"], objectives: ["Teach values", "Build character", "Foster citizenship"] },
    { title: "Life Skills Education", theme: "Holistic Development", description: "Critical thinking, decision-making, and communication", durationMinutes: 120, gradeBand: "secondary", language: "Any", competencyTags: ["life_skills", "critical_thinking"], infraTags: ["offline_feasible"], objectives: ["Develop critical thinking", "Teach decision-making", "Build communication"] },

    // NEP 2020 & Policy (5 modules)
    { title: "Understanding NEP 2020", theme: "Policy", description: "Key features and implementation guidelines of National Education Policy 2020", durationMinutes: 120, gradeBand: "all", language: "Any", competencyTags: ["nep_2020", "policy"], infraTags: ["offline_feasible"], objectives: ["Understand NEP 2020", "Learn implementation", "Align teaching"] },
    { title: "Competency-Based Education", theme: "Policy", description: "Learning outcomes and skill development focus", durationMinutes: 150, gradeBand: "all", language: "Any", competencyTags: ["competency_based", "outcomes"], infraTags: ["offline_feasible"], objectives: ["Understand competencies", "Focus on outcomes", "Develop skills"] },
    { title: "Continuous Professional Development", theme: "Policy", description: "Teacher growth and reflective practice", durationMinutes: 120, gradeBand: "all", language: "Any", competencyTags: ["professional_development", "reflection"], infraTags: ["offline_feasible"], objectives: ["Plan professional growth", "Practice reflection", "Improve teaching"] },
    { title: "School Leadership & Management", theme: "Policy", description: "Leadership skills and school improvement strategies", durationMinutes: 180, gradeBand: "all", language: "Any", competencyTags: ["leadership", "management"], infraTags: ["offline_feasible"], objectives: ["Develop leadership", "Manage schools", "Drive improvement"] },
    { title: "Community Engagement in Education", theme: "Policy", description: "Parent involvement and community partnerships", durationMinutes: 120, gradeBand: "all", language: "Any", competencyTags: ["community_engagement", "partnerships"], infraTags: ["offline_feasible", "no_tech_required"], objectives: ["Engage parents", "Build partnerships", "Involve community"] },
];

async function seedModules() {
    console.log("📚 Starting module seeding...\n");

    try {
        // Check if modules already exist
        const existingCount = await prisma.module.count();
        if (existingCount > 0) {
            console.log(`⚠️  Found ${existingCount} existing modules.`);
            console.log("   Delete them first with: npm run db:clear\n");
            return;
        }

        console.log(`Creating ${MODULES_DATA.length} learning modules...`);

        await prisma.module.createMany({
            data: MODULES_DATA,
        });

        const finalCount = await prisma.module.count();

        console.log(`\n✅ Successfully created ${finalCount} modules!\n`);
        console.log("📊 Module breakdown:");
        console.log("   - FLN: 5 modules");
        console.log("   - Digital Literacy: 5 modules");
        console.log("   - Classroom Management: 5 modules");
        console.log("   - Assessment: 5 modules");
        console.log("   - STEM: 5 modules");
        console.log("   - Language Teaching: 5 modules");
        console.log("   - Holistic Development: 5 modules");
        console.log("   - NEP 2020 & Policy: 5 modules");
        console.log("\n✨ Module library is now complete!");
        console.log("💡 View at: http://localhost:3000/modules");
        console.log("💡 Or in Prisma Studio: http://localhost:5555");

    } catch (error) {
        console.error("❌ Error seeding modules:", error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

seedModules()
    .then(() => {
        console.log("\n🎉 Module seeding complete!");
        process.exit(0);
    })
    .catch((error) => {
        console.error("Failed to seed modules:", error);
        process.exit(1);
    });
