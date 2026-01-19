# Deployment Guide - DIET Training OS

**Last Updated:** January 13, 2026

---

## 📋 **Table of Contents**

1. [Quick Deploy to Vercel](#quick-deploy-to-vercel)
2. [Environment Variables Setup](#environment-variables-setup)
3. [Database Setup](#database-setup)
4. [CI/CD Pipeline](#cicd-pipeline)
5. [Monitoring & Logging](#monitoring--logging)
6. [Troubleshooting](#troubleshooting)

---

## 🚀 **Quick Deploy to Vercel** (5 minutes)

### **Prerequisites:**
- GitHub account
- Vercel account (free tier is fine)
- Supabase account (for database)
- Groq account (for AI - free)

### **Step 1: Push to GitHub**

```bash
# Initialize git (if not done)
git init
git add .
git commit -m "Initial commit"

# Create GitHub repo and push
git remote add origin https://github.com/YOUR_USERNAME/diet-training-os.git
git branch -M main
git push -u origin main
```

### **Step 2: Deploy to Vercel**

1. **Go to** https://vercel.com
2. **Click** "Add New Project"
3. **Import** your GitHub repository
4. **Configure:**
   - Framework Preset: Next.js
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

5. **Add Environment Variables** (see below)
6. **Click** "Deploy"

**Done!** Your app will be live in ~3 minutes at `your-app.vercel.app`

---

## 🔐 **Environment Variables Setup**

### **Required Variables:**

Add these in Vercel Dashboard → Settings → Environment Variables:

#### **1. Database (REQUIRED)**

```bash
DATABASE_URL
```

**Value:** Your Supabase connection string

**How to get:**
1. Go to https://supabase.com
2. Create project (takes 2 minutes)
3. Settings → Database → Connection string
4. Copy the `postgres://` URL
5. Paste in Vercel

**Example:**
```
postgresql://postgres.xxxxx:password@aws-0-region.pooler.supabase.com:5432/postgres
```

#### **2. AI Service (REQUIRED - at least one)**

```bash
GROQ_API_KEY
```

**Value:** Your Groq API key (FREE)

**How to get:**
1. Go to https://console.groq.com
2. Sign up (free, no credit card)
3. Create API key
4. Copy and paste in Vercel

**Example:**
```
gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Optional:**
```bash
OPENAI_API_KEY
```
Only needed if you want OpenAI fallback (costs money)

#### **3. Authentication (OPTIONAL)**

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
```

**How to get:**
1. Go to https://clerk.com
2. Create application
3. Dashboard → API Keys
4. Copy both keys to Vercel

#### **4. App Configuration (AUTO)**

```bash
NEXT_PUBLIC_APP_URL
```

**Value:** `https://your-app.vercel.app`

Vercel sets this automatically, but you can override if needed.

---

## 🗄️ **Database Setup**

### **Option 1: Supabase (Recommended)**

**Why Supabase?**
- ✅ Free tier (500MB database)
- ✅ Automatic backups
- ✅ Built-in dashboard
- ✅ Fast setup (2 minutes)

**Setup:**

1. **Create Project:**
   ```
   https://supabase.com → New Project
   Name: diet-training-os
   Region: Mumbai (closest to India)
   Password: [strong password]
   ```

2. **Get Connection String:**
   ```
   Settings → Database → Connection string
   Mode: Session (for Vercel)
   Copy the postgres:// URL
   ```

3. **Add to Vercel:**
   ```
   Vercel → Settings → Environment Variables
   Key: DATABASE_URL
   Value: [paste connection string]
   ```

4. **Push Schema:**
   ```bash
   # From your local machine
   npm run db:push
   
   # Seed sample data
   npm run db:seed
   ```

5. **Verify:**
   ```
   Supabase → Table Editor
   You should see: users, clusters, modules, etc.
   ```

### **Option 2: Neon (Alternative)**

Similar to Supabase, also has free tier.

1. Go to https://neon.tech
2. Create project
3. Copy connection string
4. Add to Vercel as `DATABASE_URL`

---

## 🔄 **CI/CD Pipeline**

### **GitHub Actions (Automatic)**

We've set up automatic checks on every push/PR:

#### **What Gets Checked:**

1. **Linting** - ESLint checks code quality
2. **Type Checking** - TypeScript validation
3. **Build** - Ensures app builds successfully
4. **Security Scan** - Checks for vulnerabilities

#### **Workflow:**

```
Push to GitHub
    ↓
GitHub Actions runs checks
    ↓
All checks pass? ✅
    ↓
Vercel auto-deploys
    ↓
Live at your-app.vercel.app
```

#### **View Status:**

```
GitHub → Your Repo → Actions tab
See all workflow runs and results
```

### **Branch Strategy:**

```
main (production)
  ↓
  Deploys to: your-app.vercel.app
  Auto-deploy: ✅ Enabled

develop (staging)
  ↓
  Deploys to: your-app-dev.vercel.app
  Auto-deploy: ✅ Enabled

feature/* (preview)
  ↓
  Deploys to: your-app-git-feature.vercel.app
  Auto-deploy: ✅ Enabled (on PR)
```

---

## 📊 **Monitoring & Logging**

### **Built-in Monitoring:**

#### **1. Vercel Analytics (Free)**

**Automatically enabled!**

**View:**
```
Vercel Dashboard → Your Project → Analytics
```

**Metrics:**
- Page views
- Unique visitors
- Top pages
- Performance scores

#### **2. Health Check Endpoint**

**URL:**
```
https://your-app.vercel.app/api/health
```

**Returns:**
```json
{
  "status": "healthy",
  "services": {
    "database": { "status": "up", "latency": 45 },
    "ai": {
      "groq": { "status": "up", "latency": 120 },
      "openai": { "status": "down" }
    }
  }
}
```

**Use for:**
- Uptime monitoring (UptimeRobot, Pingdom)
- Status page
- Debugging

#### **3. Health Dashboard**

**URL:**
```
https://your-app.vercel.app/health
```

**Shows:**
- Real-time service status
- Database statistics
- API latency
- Configuration status

### **Optional: Advanced Monitoring**

#### **Sentry (Error Tracking)**

**Setup (5 minutes):**

1. **Sign up:** https://sentry.io (free tier)

2. **Install:**
   ```bash
   npm install @sentry/nextjs
   npx @sentry/wizard@latest -i nextjs
   ```

3. **Add to Vercel:**
   ```bash
   SENTRY_DSN=your_sentry_dsn
   ```

4. **Done!** Errors auto-reported to Sentry

#### **PostHog (Analytics)**

**Setup (5 minutes):**

1. **Sign up:** https://posthog.com (free tier)

2. **Install:**
   ```bash
   npm install posthog-js
   ```

3. **Add to Vercel:**
   ```bash
   NEXT_PUBLIC_POSTHOG_KEY=your_key
   NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
   ```

---

## 🔧 **Deployment Commands**

### **Manual Deployment:**

```bash
# Deploy to production
vercel --prod

# Deploy to preview
vercel

# Check deployment status
vercel ls

# View logs
vercel logs your-app.vercel.app
```

### **Rollback:**

```bash
# List deployments
vercel ls

# Promote previous deployment
vercel promote [deployment-url]
```

---

## 🐛 **Troubleshooting**

### **Build Fails on Vercel**

**Error:** `Type error: Cannot find module '@/...'`

**Fix:**
```bash
# Check tsconfig.json has:
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**Error:** `Prisma Client not generated`

**Fix:**
Add to `package.json`:
```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

### **Database Connection Fails**

**Error:** `Can't reach database server`

**Checklist:**
1. ✅ DATABASE_URL is set in Vercel
2. ✅ Connection string is correct
3. ✅ Supabase project is running
4. ✅ No typos in connection string
5. ✅ Using "Session" mode (not "Transaction")

**Test locally:**
```bash
# Create .env.local with DATABASE_URL
npm run db:push
# Should connect successfully
```

### **AI Service Not Working**

**Error:** `AI service unavailable`

**Checklist:**
1. ✅ GROQ_API_KEY is set in Vercel
2. ✅ API key is valid (test at console.groq.com)
3. ✅ No rate limits hit
4. ✅ Check `/health` endpoint

**Test:**
```bash
curl https://your-app.vercel.app/api/health
# Should show groq: { status: "up" }
```

### **Environment Variables Not Working**

**Issue:** Changes not reflected

**Fix:**
1. Update variables in Vercel Dashboard
2. **Redeploy** (variables don't auto-update)
   ```
   Vercel Dashboard → Deployments → Redeploy
   ```

---

## 📋 **Deployment Checklist**

### **Before First Deploy:**

- [ ] GitHub repo created and pushed
- [ ] Supabase project created
- [ ] DATABASE_URL obtained
- [ ] Groq API key obtained
- [ ] All environment variables ready

### **Vercel Setup:**

- [ ] Project imported from GitHub
- [ ] Environment variables added
- [ ] Build settings configured
- [ ] First deployment successful

### **Post-Deploy:**

- [ ] Run `npm run db:push` (push schema)
- [ ] Run `npm run db:seed` (seed data)
- [ ] Visit `/health` endpoint (check services)
- [ ] Test a few pages
- [ ] Check Vercel Analytics

### **Optional:**

- [ ] Custom domain configured
- [ ] Sentry error tracking setup
- [ ] PostHog analytics setup
- [ ] Uptime monitoring configured

---

## 🚀 **Production Checklist**

### **Performance:**

- [ ] Images optimized (Next.js Image component)
- [ ] Database queries indexed
- [ ] API routes cached where appropriate
- [ ] Bundle size checked (`npm run build`)

### **Security:**

- [ ] No API keys in code
- [ ] Environment variables in Vercel only
- [ ] CORS configured properly
- [ ] Rate limiting on API routes (if needed)

### **Monitoring:**

- [ ] Health check endpoint working
- [ ] Error tracking configured
- [ ] Analytics tracking users
- [ ] Uptime monitoring active

### **Documentation:**

- [ ] README updated with live URL
- [ ] API documentation complete
- [ ] Deployment guide accessible
- [ ] Troubleshooting guide available

---

## 📊 **Success Metrics**

| Metric | Target | How to Check |
|--------|--------|--------------|
| Deploy time | < 5 min | Vercel deployment logs |
| Build success rate | 100% | GitHub Actions history |
| Uptime | > 99% | Uptime monitor |
| Error rate | < 1% | Sentry dashboard |
| Page load time | < 3s | Vercel Analytics |

---

## 🎉 **You're Live!**

Once deployed, your app will be available at:

```
https://your-app.vercel.app
```

**Share with:**
- Hackathon judges
- Team members
- Testers

**Monitor at:**
- Vercel Dashboard
- `/health` endpoint
- GitHub Actions

---

## 📚 **Additional Resources**

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Deployment:** https://nextjs.org/docs/deployment
- **Supabase Docs:** https://supabase.com/docs
- **Groq Docs:** https://console.groq.com/docs

---

**Need help?** Check:
- `QUICKSTART.md` - Local development
- `README.md` - Project overview
- `TASK_1.4_COMPLETE.md` - Deployment details

**Happy deploying! 🚀**
