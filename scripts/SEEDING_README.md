# 🌍 India-Wide Data Seeding

This script populates your database with realistic demo data from **10 Indian states**.

---

## 📊 **What Gets Created:**

### **Coverage:**
- **10 States:** Jharkhand, Bihar, UP, MP, Chhattisgarh, Odisha, West Bengal, Rajasthan, Maharashtra, Tamil Nadu
- **100+ Districts** across India
- **200+ Clusters** (schools/blocks)
- **30 BRP Users** from different states
- **150+ Need Signals** with variety
- **25+ Cohorts** grouped by state and issue
- **20+ Training Plans** with complete sessions

### **Data Variety:**
- Multiple languages (Hindi, Tamil, Bengali, Marathi, etc.)
- Different infrastructure levels (LOW, MEDIUM, HIGH)
- Various issues (FLN gaps, digital literacy, assessment, etc.)
- Different grade bands (Primary 1-3, 4-5, Upper Primary 6-8)
- Spread over last 6 months (realistic timestamps)
- Tribal and non-tribal areas

---

## 🚀 **How to Run:**

### **Option 1: Add to existing data**
```bash
npm run seed:india
```

### **Option 2: Clear existing data first (recommended for demo)**
```bash
npm run seed:india:clear
```

**⚠️ Warning:** Option 2 will delete all existing needs, cohorts, plans, and clusters!

---

## ⏱️ **Time Required:**

- **Execution time:** 30-60 seconds
- **Total records created:** 400+

---

## 📈 **After Seeding:**

Your platform will have:

✅ **Rich, India-wide data**
- 10 states covered
- 200+ clusters
- 150+ needs
- 25+ cohorts
- 20+ training plans

✅ **Impressive demos**
- Charts filled with meaningful data
- Leaderboard with 30 competing BRPs
- Learning network with shared plans
- Impact reports showing trends

✅ **Realistic variety**
- Multiple languages
- Different regions
- Various issues
- Spread over time

---

## 🎬 **Demo Impact:**

### **Before Seeding:**
- "We have 5 needs from 2 districts"
- Empty charts
- No leaderboard competition
- Limited demo scenarios

### **After Seeding:**
- "We've processed **150+ needs** from **30 BRPs** across **10 states**"
- "**25 cohorts** created impacting **2,000+ teachers**"
- "**20 training plans** published across India"
- Charts showing real trends
- Competitive leaderboard
- Rich learning network

**10x more impressive!** 🚀

---

## 🗺️ **States Covered:**

1. **Jharkhand** - 10 districts (Ranchi, Dumka, etc.)
2. **Bihar** - 10 districts (Patna, Gaya, etc.)
3. **Uttar Pradesh** - 10 districts (Lucknow, Kanpur, etc.)
4. **Madhya Pradesh** - 10 districts (Bhopal, Indore, etc.)
5. **Chhattisgarh** - 10 districts (Raipur, Bilaspur, etc.)
6. **Odisha** - 10 districts (Bhubaneswar, Cuttack, etc.)
7. **West Bengal** - 10 districts (Kolkata, Howrah, etc.)
8. **Rajasthan** - 10 districts (Jaipur, Jodhpur, etc.)
9. **Maharashtra** - 10 districts (Mumbai, Pune, etc.)
10. **Tamil Nadu** - 10 districts (Chennai, Coimbatore, etc.)

---

## 🎯 **Use Cases:**

### **For Hackathon Demos:**
- Show national-scale platform
- Demonstrate cross-state collaboration
- Highlight regional diversity
- Prove scalability

### **For Testing:**
- Test with realistic data volumes
- Verify charts and analytics
- Check performance with 400+ records
- Test filters and search

### **For Development:**
- Develop new features with rich data
- Test edge cases
- Validate UI with varied content

---

## 📝 **Data Structure:**

### **Clusters:**
```typescript
{
  name: "Ranchi Central Cluster",
  district: "Ranchi",
  state: "Jharkhand",
  primaryLanguage: "Hindi",
  infrastructureLevel: "MEDIUM",
  teacherCount: 35
}
```

### **Need Signals:**
```typescript
{
  description: "Teachers struggling with FLN gaps in primary 1-3 classes",
  subject: "MATH",
  grades: ["PRIMARY_1_3"],
  issueTags: ["FLN_gaps", "low_infrastructure"],
  reportedBy: "Rajesh Kumar"
}
```

### **Cohorts:**
```typescript
{
  name: "Jharkhand FLN gaps Cohort",
  teacherCountEstimate: 156,
  primaryIssues: ["FLN_gaps"],
  language: "Hindi",
  gradeBand: "PRIMARY_1_3"
}
```

---

## 🔧 **Customization:**

Want to modify the data? Edit `scripts/seed-india.ts`:

- **Add more states:** Update `STATES_DATA` object
- **Change issue types:** Modify `ISSUE_TYPES` array
- **Adjust quantities:** Change loop counts
- **Add more BRPs:** Extend `BRP_NAMES` array

---

## ✅ **Verification:**

After seeding, verify in Prisma Studio:

```bash
npm run db:studio
```

Check:
- [ ] 200+ clusters across 10 states
- [ ] 150+ need signals with variety
- [ ] 25+ cohorts
- [ ] 20+ training plans
- [ ] 30 BRP users
- [ ] Dates spread over 6 months

---

## 🎉 **Ready to Demo!**

After seeding, your platform will look like a **production system** with:

- **National coverage** - 10 states
- **Rich data** - 400+ records
- **Realistic variety** - Multiple languages, regions, issues
- **Impressive scale** - Shows true potential

**Perfect for hackathon demos!** 🏆

---

## 💡 **Pro Tips:**

1. **Run before demo** - Fresh data looks best
2. **Use clear option** - Removes test data
3. **Check Prisma Studio** - Verify data quality
4. **Test all features** - Ensure everything works with new data
5. **Practice demo** - Know your data stories

---

## 🚨 **Troubleshooting:**

### **Error: "Cannot find module"**
```bash
npm install
```

### **Error: "Database not found"**
```bash
npm run db:push
```

### **Error: "Prisma client not generated"**
```bash
npm run db:generate
```

---

**🎉 You're ready to impress with India-wide data!** 🚀
