# DIET Training OS - Personalized Training Design Platform

**Hackathon Project:** January 2-22, 2026  
**For:** DIETs/SCERTs - Transforming Teacher Training in India
**Live on:** https://educohort-nine.vercel.app/
**Demo video:** https://www.youtube.com/watch?v=l-Sz-oqF-6k

---

## 🎯 **Project Overview**

A web platform that enables DIETs (District Institutes of Education and Training) and SCERTs (State Council of Educational Research and Training) to design personalized, micro-learning-based teacher training programs using AI assistance.

### **The Problem**
- Teacher training in India uses static, one-size-fits-all manuals
- DIETs struggle to contextualize training for local languages, infrastructure, and specific needs
- Manual revision cycles take months/years
- Weak feedback loops from classrooms

### **Our Solution**
1. **Capture needs** from field (BRPs/CRPs report classroom challenges)
2. **Group into cohorts** (similar needs, language, infrastructure)
3. **AI-assisted plan generation** (contextualized, micro-learning modules)
4. **Feedback loop** (continuous improvement)

---

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+ 
- PostgreSQL database
- Groq API key (free at console.groq.com)

### **Installation**

```bash
# Clone the repository
git clone <your-repo-url>
cd diet-training-os

# Install dependencies
npm install

# Setup environment variables
cp env.example .env.local
# Edit .env.local with your credentials

# Run database migrations
npx prisma migrate dev

# Seed sample data
npm run seed

# Start development server
npm run dev
```

Visit `http://localhost:3000`

---

## 📁 **Project Structure**

```
diet-training-os/
├── src/
│   ├── app/              # Next.js 14 App Router pages
│   ├── components/       # Reusable UI components
│   ├── lib/              # Utilities and helpers
│   ├── services/         # API integrations (Groq, DB)
│   ├── types/            # TypeScript type definitions
│   └── hooks/            # Custom React hooks
├── prisma/               # Database schema and migrations
├── public/               # Static assets
└── README.md
```

---

## 🛠️ **Tech Stack**

### **Frontend**
- **Next.js 14** (React + TypeScript)
- **Tailwind CSS** (Styling)
- **Radix UI** (Accessible components)
- **Lucide React** (Icons)

### **Backend**
- **Next.js API Routes**
- **Prisma ORM** (Database)
- **PostgreSQL** (Database)

### **AI**
- **Groq** (Llama 3.1 70B - Free, Fast)
- **OpenAI** (Optional fallback)

### **Infrastructure**
- **Vercel** (Deployment)
- **Supabase/Neon** (Database hosting)

---

## 🎨 **Key Features**

### **Phase 1: Needs Capture** ✅
- BRPs/CRPs report classroom needs
- Multi-select issues (FLN gaps, language mismatch, etc.)
- Cluster/school selection

### **Phase 2: Cohort Management** ✅
- Automatic grouping by similarity
- Cohort dashboard with filters
- Real-time profiling

### **Phase 3: AI-Assisted Plan Generation** 🚀
- Rule-based module matching
- LLM-powered contextualization
- Drag-and-drop plan editor
- PDF/DOCX export

### **Phase 4: Feedback & Analytics** 📊
- Post-training feedback collection
- Plan effectiveness metrics
- Continuous improvement loop

---

## 📚 **Data Sources**

Our platform uses authentic data from official Indian education sources:

- **NISHTHA FLN** - Module library structure
- **DIKSHA** - Teacher training courses
- **UDISE+** - School/cluster master data
- **NEP 2020** - CPD framework (50 hours)
- **NCERT** - Competency frameworks

---

## 🎯 **Alignment with NEP 2020**

- ✅ **Continuous Professional Development (CPD)** - 50-hour framework
- ✅ **Competency-based training** - Targeted skill development
- ✅ **Micro-learning** - Short, focused modules (15-60 min)
- ✅ **Contextualization** - Local language, culture, infrastructure
- ✅ **Digital Public Goods** - Open, modular, interoperable

---

## 🧪 **Development**

### **Available Scripts**

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run db:push      # Push schema changes to DB
npm run db:studio    # Open Prisma Studio
npm run seed         # Seed sample data
```

### **Environment Variables**

See `env.example` for required variables:
- `DATABASE_URL` - PostgreSQL connection string
- `GROQ_API_KEY` - Groq API key (free)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk auth
- `CLERK_SECRET_KEY` - Clerk auth secret

---

## 📊 **Demo Scenario**

**"Tribal FLN Cohort in Jharkhand"**

1. **Need Signal:** BRP reports 5 clusters in Dumka district
   - Issue: Severe FLN gaps
   - Context: Tribal population (Santali speakers)
   - Infrastructure: Low (no electricity, no digital resources)

2. **Cohort Created:** "Dumka Tribal FLN - Primary 1-3"
   - 135 teachers across 3 clusters
   - Primary issues: FLN gaps + language mismatch + low infrastructure

3. **AI-Generated Plan:** 4-session training
   - Session 1: Understanding FLN in tribal contexts (45 min)
   - Session 2: Story-based reading using oral traditions (30 min)
   - Session 3: Low-resource TLM creation (40 min)
   - Session 4: Oral assessment strategies (35 min)

4. **Feedback:** High relevance scores, request for follow-up

---

## 🏆 **Hackathon Submission**

**Timeline:** January 2-22, 2026  
**Team:** [Your Team Name]  
**Demo:** [Live URL]  
**Video:** [Demo Video URL]

### **Judging Criteria Alignment**

| Criteria | How We Address It |
|----------|-------------------|
| **Innovation** | AI-powered contextualization, micro-learning approach |
| **Impact** | Scalable to 1000s of DIETs, reduces training design time from months to minutes |
| **Feasibility** | Uses proven tech stack, free AI (Groq), aligned with existing systems (DIKSHA) |
| **Alignment** | NEP 2020 CPD framework, NISHTHA structure, UDISE+ data |
| **Presentation** | Clear demo, measurable outcomes, realistic data |

---

## 📝 **License**

This project is built as a **Digital Public Good (DPG)** following open-source principles.

---

## 🤝 **Contributing**

This is a hackathon project. For questions or collaboration:
- Email: [your-email]
- GitHub: [your-github]

---

## 🙏 **Acknowledgments**

- **NCERT/CIET** - NISHTHA FLN course structure
- **DIKSHA** - Teacher training modules
- **UDISE+** - School master data
- **NEP 2020** - Policy framework
- **Groq** - Free, fast LLM inference

---

**Built with ❤️ for Indian Education**
