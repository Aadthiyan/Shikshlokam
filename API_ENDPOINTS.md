# 📚 API Endpoints Documentation

## 🎯 **Complete List of API Endpoints**

**Base URL:** `http://localhost:3000/api`

---

## 📊 **Analytics & Stats**

### **1. GET /api/stats**
Get platform-wide statistics
- **Response:** Total needs, cohorts, plans, teachers, clusters
- **Used in:** Homepage stats

### **2. GET /api/analytics**
Get detailed analytics data
- **Response:** Analytics metrics and trends

### **3. GET /api/dashboard**
Get dashboard data with charts
- **Query Params:** `range` (7d, 30d, all)
- **Response:** Needs by district, issues, grades, trends
- **Used in:** Dashboard page

---

## 🆘 **Needs Management**

### **4. GET /api/needs**
Get all need signals
- **Query Params:** 
  - `page` (pagination)
  - `limit` (items per page)
  - `district` (filter by district)
  - `issue` (filter by issue type)
- **Response:** List of needs with cluster info

### **5. POST /api/needs**
Create a new need signal
- **Body:** Need details (issue, district, grade, etc.)
- **Response:** Created need object

---

## 👥 **Cohorts Management**

### **6. GET /api/cohorts**
Get all cohorts
- **Response:** List of cohorts with needs count

### **7. POST /api/cohorts**
Create a new cohort
- **Body:** Cohort details
- **Response:** Created cohort

### **8. GET /api/cohorts/[id]**
Get specific cohort details
- **Params:** `id` (cohort ID)
- **Response:** Cohort with needs and plans

### **9. PUT /api/cohorts/[id]**
Update cohort
- **Params:** `id` (cohort ID)
- **Body:** Updated cohort data

### **10. DELETE /api/cohorts/[id]**
Delete cohort
- **Params:** `id` (cohort ID)

### **11. POST /api/cohorts/suggest**
Get AI-suggested cohorts
- **Response:** AI-generated cohort suggestions

### **12. POST /api/cohorts/[id]/generate-plan**
Generate training plan for cohort
- **Params:** `id` (cohort ID)
- **Response:** Generated training plan

---

## 📋 **Training Plans**

### **13. GET /api/plans**
Get all training plans
- **Response:** List of plans

### **14. POST /api/plans**
Create a new training plan
- **Body:** Plan details
- **Response:** Created plan

### **15. GET /api/plans/[id]**
Get specific plan details
- **Params:** `id` (plan ID)
- **Response:** Plan with sessions

### **16. PUT /api/plans/[id]**
Update plan
- **Params:** `id` (plan ID)
- **Body:** Updated plan data

### **17. DELETE /api/plans/[id]**
Delete plan
- **Params:** `id` (plan ID)

### **18. POST /api/plans/[id]/publish**
Publish a plan
- **Params:** `id` (plan ID)
- **Response:** Published plan

### **19. GET /api/plans/[id]/export**
Export plan as PDF
- **Params:** `id` (plan ID)
- **Response:** PDF file

### **20. GET /api/plans/[id]/recommendations**
Get AI recommendations for plan
- **Params:** `id` (plan ID)
- **Response:** Improvement suggestions

---

## 🎓 **Sessions Management**

### **21. GET /api/plans/[id]/sessions/[sessionId]**
Get session details
- **Params:** `id` (plan ID), `sessionId`
- **Response:** Session data

### **22. PUT /api/plans/[id]/sessions/[sessionId]**
Update session
- **Params:** `id` (plan ID), `sessionId`
- **Body:** Updated session data

### **23. POST /api/plans/[id]/sessions/[sessionId]/regenerate**
Regenerate session with AI
- **Params:** `id` (plan ID), `sessionId`
- **Response:** New session content

### **24. POST /api/plans/[id]/sessions/[sessionId]/feedback**
Submit session feedback
- **Params:** `id` (plan ID), `sessionId`
- **Body:** Feedback data
- **Response:** Saved feedback

---

## 🏫 **Clusters**

### **25. GET /api/clusters**
Get all school clusters
- **Response:** List of clusters with schools

### **26. POST /api/clusters**
Create a new cluster
- **Body:** Cluster details
- **Response:** Created cluster

---

## 📚 **Learning Resources**

### **27. GET /api/modules**
Get learning modules
- **Response:** List of training modules

### **28. GET /api/learning**
Get learning resources
- **Response:** Learning materials and resources

---

## 🌐 **Learning Network**

### **29. GET /api/learning-network**
Get shared training plans from network
- **Query Params:** `filter` (all, high-success, trending, recent)
- **Response:** Shared plans from other DIETs

---

## 🤖 **AI Features**

### **30. POST /api/ai-assistant**
Chat with AI assistant
- **Body:** `{ message: string }`
- **Response:** AI response

### **31. POST /api/translate/plan**
Translate plan to another language
- **Body:** Plan ID and target language
- **Response:** Translated plan

### **32. POST /api/voice/transcribe**
Transcribe voice to text
- **Body:** Audio file
- **Response:** Transcribed text

---

## 🎮 **Gamification**

### **33. GET /api/gamification**
Get gamification data
- **Response:** Badges, points, leaderboard, streaks

---

## 📊 **Impact Reports**

### **34. GET /api/impact-reports**
Get impact report data
- **Query Params:** `range` (6m, 1y, all)
- **Response:** Impact metrics, charts, district data

### **35. GET /api/impact-reports/export**
Export impact report as PDF
- **Query Params:** `range` (6m, 1y, all)
- **Response:** PDF file

### **36. POST /api/impact-reports/email**
Email impact report to stakeholder
- **Body:** `{ email: string, timeRange: string }`
- **Response:** Success confirmation

---

## 💬 **WhatsApp Integration**

### **37. POST /api/whatsapp/webhook**
WhatsApp webhook for messages
- **Body:** WhatsApp message data
- **Response:** Webhook acknowledgment

---

## 🏥 **System Health**

### **38. GET /api/health**
Check system health
- **Response:** Database, API, services status

---

## 📝 **Quick Reference Table**

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/stats` | GET | Platform statistics |
| `/api/analytics` | GET | Analytics data |
| `/api/dashboard` | GET | Dashboard charts |
| `/api/needs` | GET, POST | Manage needs |
| `/api/cohorts` | GET, POST | Manage cohorts |
| `/api/cohorts/[id]` | GET, PUT, DELETE | Cohort details |
| `/api/cohorts/suggest` | POST | AI cohort suggestions |
| `/api/cohorts/[id]/generate-plan` | POST | Generate plan |
| `/api/plans` | GET, POST | Manage plans |
| `/api/plans/[id]` | GET, PUT, DELETE | Plan details |
| `/api/plans/[id]/publish` | POST | Publish plan |
| `/api/plans/[id]/export` | GET | Export PDF |
| `/api/plans/[id]/recommendations` | GET | AI recommendations |
| `/api/plans/[id]/sessions/[sessionId]` | GET, PUT | Session details |
| `/api/plans/[id]/sessions/[sessionId]/regenerate` | POST | Regenerate session |
| `/api/plans/[id]/sessions/[sessionId]/feedback` | POST | Session feedback |
| `/api/clusters` | GET, POST | Manage clusters |
| `/api/modules` | GET | Learning modules |
| `/api/learning` | GET | Learning resources |
| `/api/learning-network` | GET | Shared plans |
| `/api/ai-assistant` | POST | AI chat |
| `/api/translate/plan` | POST | Translate plan |
| `/api/voice/transcribe` | POST | Voice to text |
| `/api/gamification` | GET | Badges & points |
| `/api/impact-reports` | GET | Impact data |
| `/api/impact-reports/export` | GET | Export PDF |
| `/api/impact-reports/email` | POST | Email report |
| `/api/whatsapp/webhook` | POST | WhatsApp messages |
| `/api/health` | GET | System health |

---

## 🧪 **Testing Endpoints**

### **Using Browser:**
```
http://localhost:3000/api/stats
http://localhost:3000/api/health
http://localhost:3000/api/needs
```

### **Using curl:**
```bash
# GET request
curl http://localhost:3000/api/stats

# POST request
curl -X POST http://localhost:3000/api/needs \
  -H "Content-Type: application/json" \
  -d '{"issue":"FLN_gaps","district":"Ranchi"}'
```

### **Using Postman:**
1. Import as collection
2. Set base URL: `http://localhost:3000/api`
3. Test each endpoint

---

## 📁 **File Locations**

All API routes are in: `src/app/api/`

```
src/app/api/
├── ai-assistant/route.ts
├── analytics/route.ts
├── clusters/route.ts
├── cohorts/
│   ├── route.ts
│   ├── suggest/route.ts
│   └── [id]/
│       ├── route.ts
│       └── generate-plan/route.ts
├── dashboard/route.ts
├── gamification/route.ts
├── health/route.ts
├── impact-reports/
│   ├── route.ts
│   ├── export/route.ts
│   └── email/route.ts
├── learning/route.ts
├── learning-network/route.ts
├── modules/route.ts
├── needs/route.ts
├── plans/
│   ├── route.ts
│   └── [id]/
│       ├── route.ts
│       ├── export/route.ts
│       ├── publish/route.ts
│       ├── recommendations/route.ts
│       └── sessions/
│           └── [sessionId]/
│               ├── route.ts
│               ├── feedback/route.ts
│               └── regenerate/route.ts
├── stats/route.ts
├── translate/
│   └── plan/route.ts
├── voice/
│   └── transcribe/route.ts
└── whatsapp/
    └── webhook/route.ts
```

---

## 🎯 **Total Endpoints: 38**

**Categories:**
- 📊 Analytics & Stats: 3 endpoints
- 🆘 Needs: 2 endpoints
- 👥 Cohorts: 7 endpoints
- 📋 Plans: 7 endpoints
- 🎓 Sessions: 4 endpoints
- 🏫 Clusters: 2 endpoints
- 📚 Learning: 3 endpoints
- 🤖 AI: 3 endpoints
- 🎮 Gamification: 1 endpoint
- 📊 Impact Reports: 3 endpoints
- 💬 WhatsApp: 1 endpoint
- 🏥 Health: 1 endpoint

**Your API is comprehensive and production-ready!** 🚀
