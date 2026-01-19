# DIKSHA Integration Guide

## Overview

This document outlines how DIET Training OS training plans can integrate with DIKSHA (Digital Infrastructure for Knowledge Sharing).

---

## DIKSHA Platform

**DIKSHA** is India's national digital infrastructure for teachers, providing:
- Digital content repository
- Teacher training resources
- Assessment tools
- Learning analytics

**Website:** https://diksha.gov.in

---

## Integration Approach

### 1. Content Metadata Format

Training plans exported from DIET Training OS can be formatted to match DIKSHA's metadata schema:

```json
{
  "identifier": "plan_unique_id",
  "name": "Training Plan Name",
  "description": "Plan description",
  "contentType": "Course",
  "mimeType": "application/pdf",
  "language": ["Hindi", "English"],
  "medium": ["Hindi"],
  "gradeLevel": ["Grade 1", "Grade 2", "Grade 3"],
  "subject": ["Teacher Training"],
  "topic": ["FLN", "Classroom Management"],
  "keywords": ["foundational literacy", "numeracy", "pedagogy"],
  "audience": ["Teacher", "Teacher Educator"],
  "attributions": ["DIET", "SCERT"],
  "copyright": "SCERT Jharkhand",
  "license": "CC BY 4.0",
  "status": "Live",
  "createdOn": "2026-01-13T00:00:00Z",
  "lastUpdatedOn": "2026-01-13T00:00:00Z"
}
```

### 2. Content Structure

Each training plan can be packaged as:

**a) PDF Document**
- Exported using our PDF export service
- Includes all sessions, objectives, trainer notes
- Professional formatting

**b) Metadata File**
- JSON file with DIKSHA-compatible metadata
- Links to PDF content
- Includes competency tags

**c) Package Structure**
```
training-plan-package/
├── manifest.json          (DIKSHA metadata)
├── content.pdf           (Training plan PDF)
├── thumbnail.png         (Plan thumbnail)
└── assets/
    ├── session1.pdf
    ├── session2.pdf
    └── ...
```

---

## Metadata Mapping

### DIET Training OS → DIKSHA

| DIET Field | DIKSHA Field | Mapping |
|------------|--------------|---------|
| `plan.name` | `name` | Direct |
| `plan.description` | `description` | Direct |
| `cohort.language` | `language`, `medium` | Direct |
| `cohort.gradeBand` | `gradeLevel` | Map to DIKSHA grades |
| `module.theme` | `topic` | Direct |
| `module.competencyTags` | `keywords` | Array |
| `plan.status` | `status` | Map: PUBLISHED → Live |

### Grade Band Mapping

```javascript
const gradeBandMapping = {
  "primary_1_3": ["Grade 1", "Grade 2", "Grade 3"],
  "primary_4_5": ["Grade 4", "Grade 5"],
  "secondary_6_8": ["Grade 6", "Grade 7", "Grade 8"],
  "secondary_9_10": ["Grade 9", "Grade 10"]
};
```

---

## Export Process

### Step 1: Generate Training Plan
1. Create plan in DIET Training OS
2. Collect feedback
3. Publish plan

### Step 2: Export for DIKSHA
1. Click "Export for DIKSHA"
2. System generates:
   - PDF content
   - DIKSHA metadata JSON
   - Package structure

### Step 3: Upload to DIKSHA
1. Login to DIKSHA portal
2. Navigate to "Upload Content"
3. Upload package ZIP file
4. Review and publish

---

## API Integration (Future)

### DIKSHA Content API

Future versions can integrate directly with DIKSHA's Content API:

```javascript
// Upload content to DIKSHA
POST https://api.diksha.gov.in/api/content/v1/create
Headers:
  Authorization: Bearer <api_key>
  Content-Type: application/json

Body:
{
  "request": {
    "content": {
      "name": "Training Plan Name",
      "description": "Plan description",
      "contentType": "Course",
      "mimeType": "application/pdf",
      // ... other metadata
    }
  }
}
```

### Authentication

DIKSHA uses OAuth 2.0:
1. Register application
2. Obtain client credentials
3. Get access token
4. Use token for API calls

---

## Competency Framework Alignment

### DIKSHA Competencies

DIKSHA uses NCERT's competency framework. Our module competency tags can be mapped:

| Our Tag | DIKSHA Competency |
|---------|-------------------|
| `reading_pedagogy` | `C1: Foundational Literacy` |
| `numeracy_pedagogy` | `C2: Foundational Numeracy` |
| `assessment_techniques` | `C3: Assessment for Learning` |
| `classroom_management` | `C4: Classroom Management` |
| `inclusive_pedagogy` | `C5: Inclusive Education` |

---

## Benefits of DIKSHA Integration

1. **Wider Reach**
   - Access to 4M+ teachers on DIKSHA
   - National visibility
   - Standardized distribution

2. **Quality Assurance**
   - DIKSHA's review process
   - Alignment with national standards
   - Professional credibility

3. **Analytics**
   - Usage tracking
   - Teacher engagement metrics
   - Impact measurement

4. **Discoverability**
   - Searchable by topic, grade, language
   - Recommended to relevant teachers
   - Integration with other DIKSHA content

---

## Implementation Timeline

### Phase 1 (Current)
- ✅ PDF export working
- ✅ Metadata structure defined
- ✅ Documentation complete

### Phase 2 (Next 3 months)
- Generate DIKSHA metadata JSON
- Create package ZIP export
- Manual upload process

### Phase 3 (Next 6 months)
- DIKSHA API integration
- Automated upload
- Real-time sync

---

## Example: Exporting a Plan

### 1. Plan Details
```
Name: "FLN Training for Tribal Belt Teachers"
Cohort: Tribal, Low Infrastructure, Hindi/Mundari
Sessions: 4
Duration: 180 minutes
```

### 2. Generated Metadata
```json
{
  "identifier": "fln_tribal_belt_2026_01",
  "name": "FLN Training for Tribal Belt Teachers",
  "description": "Foundational Literacy and Numeracy training...",
  "contentType": "Course",
  "language": ["Hindi", "Mundari"],
  "medium": ["Hindi"],
  "gradeLevel": ["Grade 1", "Grade 2", "Grade 3"],
  "topic": ["Foundational Literacy", "Foundational Numeracy"],
  "keywords": ["FLN", "tribal", "multilingual", "low infrastructure"],
  "audience": ["Teacher"],
  "attributions": ["DIET Jharkhand", "SCERT Jharkhand"]
}
```

### 3. Package Contents
```
fln-tribal-belt-2026-01/
├── manifest.json
├── training-plan.pdf
└── thumbnail.png
```

---

## Contact & Support

**DIKSHA Support:**
- Email: support@diksha.gov.in
- Documentation: https://diksha.gov.in/developer-docs

**DIET Training OS:**
- For integration questions
- Technical support
- Custom metadata requirements

---

## Conclusion

DIKSHA integration enables DIET Training OS plans to reach millions of teachers across India. The metadata format ensures compatibility, while the export process remains simple and efficient.

**Next Steps:**
1. Review this documentation
2. Test metadata generation
3. Pilot upload to DIKSHA
4. Gather feedback
5. Implement API integration

---

*Last Updated: January 13, 2026*
*Version: 1.0*
