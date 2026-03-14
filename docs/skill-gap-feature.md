# Skill Gap Analysis Feature — Technical Reference (v2.2)

## 1. Feature Goal
The Skill Gap Analysis feature provides personalized, AI-generated insights when a user clicks on any recommended internship. It shows:
- Which skills the user already has that match the role.
- Which skills are missing.
- An AI-generated explanation (via Gemini Pro) of why those missing skills are important for the role.

This helps users understand why they may not currently qualify and what to learn next.

---

## 2. System Flow

```
User clicks internship card (Recommendations page)
        ↓
Frontend calls: GET /api/recommend/{internship_id}/skill-gap
        ↓
Backend: Fetch internship from MongoDB by _id or internship_id
        ↓
If required_skills is empty:
   - Extract skills from description using Gemini AI
   - Cache extracted skills back to internship document
        ↓
Compute: missing_skills = required_skills − user_skills  (set difference)
        ↓
Call Gemini API: generate brief explanation for missing skills
        ↓
Return structured JSON response
        ↓
Frontend renders SkillGapModal with report
```

---

## 3. API Endpoint

`GET /api/recommend/{internship_id}/skill-gap`

### Request
| Parameter | Type | Description |
|-----------|------|-------------|
| `internship_id` | Path (string) | MongoDB `_id` or logical ID (e.g., `INT102`) |
| `Authorization` | Header | `Bearer <JWT_token>` |

### Response
```json
{
  "internship": {
    "id": "INT102",
    "title": "Frontend Developer Intern"
  },
  "user_skills": [
    "Python",
    "HTML",
    "CSS"
  ],
  "missing_skills": {
    "skills": [
      "JavaScript",
      "React",
      "Git"
    ]
  },
  "explanation": {
    "gemini_text": "JavaScript is essential for building interactive web applications. React enables building scalable, component-based UIs. Git is required for version control in team environments."
  }
}
```

### Error Cases
| Status | Reason |
|--------|--------|
| 401 | Missing or expired JWT |
| 404 | Internship ID not found in database |
| 500 | Gemini API failure (fallback text returned) |

---

## 4. Backend Implementation

### Router: `app/routers/recommendation_router.py`
The endpoint is added to the existing `/recommend` router to avoid creating a new router.

**Algorithm:**
```python
# Skill gap computation
missing_skills = list(set(required_skills) - set(user_skills))
```

**Auto-enrichment:**
If `required_skills` is empty in the DB, the system calls `gemini_service.extract_skills_from_description()` and stores the result in the internship document for future cache hits.

### Service: `app/services/skill_gap_service.py`
```
SkillGapService
  ├── calculate_missing_skills(user_skills, required_skills) → List[str]
  ├── generate_gemini_explanation(internship_title, missing_skills) → str
  └── calculate_impact_score(current_score, missing_count, total_required) → float
```

### Gemini Methods: `app/gemini_service.py`
```
GeminiService
  ├── extract_skills_from_description(description) → List[str]
  └── generate_skill_explanation(internship_title, missing_skills) → str
```

---

## 5. Frontend Implementation

### Store: `recommendationStore.ts`
New state added:
```typescript
skillGapReport: SkillGapReport | null  // holds the fetched report
isGapLoading: boolean                   // loading state for the modal

Actions:
  fetchSkillGap(internshipId: string)   // calls the API
  clearSkillGap()                       // resets state on modal close
```

### Component: `SkillGapModal.tsx`
Located at: `aire-ui/src/components/recommendations/SkillGapModal.tsx`

**UI States:**
| State | UI |
|-------|----|
| `isGapLoading = true` | Spinner + "Analyzing Skill Gaps..." message |
| Error | Alert icon + error text + "Close" button |
| Data loaded | Full report with matched skills, missing skills, AI explanation |

**Design:**
- Full-screen backdrop with `backdrop-blur-sm` overlay.
- Centered modal (max-width: 2xl) with gradient accent top bar.
- Smooth `zoom-in-95` entrance animation.
- Matched skills: **green** badges with `CheckCircle2` icon.
- Missing skills: **gray** badges with `Zap` icon.
- AI Insight: Gradient `indigo-50` panel with `Sparkles` icon.

---

## 6. Internationalization
The following i18n keys are used in the Skill Gap Modal and are translated for all 4 languages (EN, HI, TA, TE):

| Key | English |
|-----|---------|
| `matched_skills` | Your Matched Skills |
| `missing_skills` | Missing Skills |
| `no_gaps` | No gaps detected! |
| `ai_insight` | AI Insight |

---

## 7. Performance
| Metric | Target | Notes |
|--------|--------|-------|
| Skill computation | < 50ms | Pure set difference |
| Gemini explanation | < 2 seconds | Network-dependent |
| Full API response | < 3 seconds | End-to-end |
| Modal appears | < 500ms | Spinner shown immediately on click |

---

## 8. Caching Strategy
- **First access**: If `required_skills` is empty in DB, Gemini extracts them from the description.
- **Cached to DB**: Extracted skills are written back using `$set`, so subsequent calls skip AI extraction.
- **Gemini explanation**: Not cached (generated fresh per request to ensure relevance).
- **Future improvement**: Cache explanation in Redis with a 24-hour TTL.
