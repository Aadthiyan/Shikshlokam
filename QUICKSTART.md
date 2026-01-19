# 🚀 Quick Start Guide - DIET Training OS

**Last Updated:** January 12, 2026

---

## ⚡ **5-Minute Setup**

### **1. Clone & Install** (2 minutes)

```bash
cd diet-training-os
npm install
```

### **2. Setup Database** (2 minutes)

**Option A: Use Supabase (Recommended - No local install needed)**

1. Go to https://supabase.com → Sign up (free)
2. Create new project → Wait 2 minutes for setup
3. Go to Settings → Database → Copy connection string
4. Create `.env.local`:

```bash
# Copy from env.example
cp env.example .env.local
```

5. Edit `.env.local` - paste your Supabase connection string:

```bash
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT].supabase.co:5432/postgres"
```

**Option B: Local PostgreSQL** (if you have it installed)

```bash
# Create database
createdb diet_training_os

# Use this in .env.local
DATABASE_URL="postgresql://localhost:5432/diet_training_os"
```

### **3. Initialize Database** (1 minute)

```bash
# Push schema to database
npm run db:push

# Seed sample data (3 users, 5 clusters, 10 modules)
npm run db:seed
```

### **4. Start Development Server**

```bash
npm run dev
```

Visit http://localhost:3000 🎉

---

## 🔑 **Get API Keys** (Optional - for full features)

### **Groq API (Free - for AI features)**

1. Go to https://console.groq.com
2. Sign up (free, no credit card)
3. Create API key
4. Add to `.env.local`:

```bash
GROQ_API_KEY="gsk_..."
```

### **Clerk Auth (Free tier available)**

1. Go to https://clerk.com
2. Create application
3. Copy keys to `.env.local`:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
```

---

## 📊 **View Your Data**

```bash
npm run db:studio
```

Opens Prisma Studio at http://localhost:5555

You'll see:
- 3 sample users
- 5 sample clusters (Jharkhand & Chhattisgarh)
- 10 training modules

---

## 🛠️ **Useful Commands**

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run lint             # Run linter
npm run format           # Format code

# Database
npm run db:push          # Push schema changes
npm run db:studio        # Open database GUI
npm run db:seed          # Seed sample data
npm run db:migrate       # Create migration
```

---

## 📁 **Project Structure**

```
diet-training-os/
├── src/
│   ├── app/              # Next.js pages (App Router)
│   ├── components/       # React components
│   ├── lib/              # Utilities (Prisma client, etc.)
│   ├── services/         # API integrations
│   ├── types/            # TypeScript types
│   └── hooks/            # Custom React hooks
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Sample data
├── public/               # Static files
└── .env.local            # Environment variables (create this!)
```

---

## 🎯 **What's Built So Far**

### ✅ **Phase 1: Foundation** (COMPLETE)
- ✅ Next.js 14 + TypeScript + Tailwind CSS
- ✅ Project structure
- ✅ Database schema (8 models)
- ✅ Sample data seed
- ✅ Authentication setup (Clerk)

### 🚧 **Next: Phase 2** (Coming Soon)
- Needs capture form
- Cohort dashboard
- Module library UI

---

## 🐛 **Troubleshooting**

### **Database connection error**

```bash
# Make sure DATABASE_URL is correct in .env.local
# For Supabase, use the "Connection string" from Settings → Database
# Should start with: postgresql://postgres:...
```

### **Prisma client not found**

```bash
npm run db:generate
```

### **Port 3000 already in use**

```bash
# Kill the process or use different port
npm run dev -- -p 3001
```

---

## 📚 **Sample Data**

### **Users** (for testing)

| Email | Role | Password |
|-------|------|----------|
| admin@diet-jharkhand.gov.in | ADMIN | (Use Clerk) |
| planner@diet-jharkhand.gov.in | PLANNER | (Use Clerk) |
| brp@diet-jharkhand.gov.in | BRP | (Use Clerk) |

### **Clusters**

- Kanke Cluster (Ranchi) - Tribal, Low Infra
- Dumka Cluster A (Dumka) - Tribal, Low Infra
- Gumla Cluster B (Gumla) - Tribal, Low Infra
- Ratu Cluster (Ranchi) - Rural, Medium Infra
- Jagdalpur Cluster (Bastar, CG) - Tribal, Low Infra

### **Modules**

- Understanding FLN in Tribal Contexts (45 min)
- Story-Based Reading Activities (30 min)
- Numeracy Skills Through Everyday Activities (40 min)
- Formative Assessment in FLN (35 min)
- Managing Multi-Grade Classrooms (50 min)
- Positive Behavior Management (40 min)
- Teaching in Multilingual Classrooms (45 min)
- Low-Cost TLM Creation (40 min)
- Inclusive Strategies for Diverse Learners (45 min)
- Integrating Digital Resources (50 min)

---

## 🎉 **You're Ready!**

Your development environment is set up. Now you can:

1. **Explore the database** with Prisma Studio
2. **Start building features** (needs capture, cohorts, plans)
3. **Test with sample data** already loaded

---

**Need help?** Check:
- `README.md` - Full project documentation
- `TASK_1.2_COMPLETE.md` - Database setup details
- `DATA_REQUIREMENTS.md` - Data sources and structure

**Happy coding! 🚀**
