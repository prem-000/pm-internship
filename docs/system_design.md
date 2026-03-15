# System Design & Architecture — AIRE v2.4.0

## 1. High-Level Architecture
AIRE is built on a **service-oriented backend** architecture using FastAPI for high-performance async operations and MongoDB Atlas for flexible, schema-less user profiling.

```
 ┌─────────────────────────────────────────────────────────────────────┐
 │                         AIRE Web Frontend                           │
 │                (Next.js 14, Zustand, Tailwind CSS)                  │
 └────────────────────────────┬────────────────────────────────────────┘
                              │ REST API (JWT Auth)
 ┌────────────────────────────▼────────────────────────────────────────┐
 │                       FastAPI Backend (Python 3.11)                 │
 │                                                                     │
 │  ┌──────────┐  ┌───────────────┐  ┌─────────────────┐  ┌────────┐  │
 │  │   Auth   │  │    Profile /  │  │  Recommender    │  │ Admin  │  │
 │  │  Router  │  │    Resume     │  │    Router       │  │ Panel  │  │
 │  └────┬─────┘  └──────┬────────┘  └───────┬─────────┘  └───┬────┘  │
 │       │               │                   │                │       │
 │  ┌────▼───────────────▼───────────────────▼────────────────▼────┐  │
 │  │                   Core Services Layer                         │  │
 │  │ • ModelLoader (Lazy)   • GeminiService   • SkillGapService    │  │
 │  │ • HPIS Merge Engine    • Adaptive Recommender • ProfileHelper  │  │
 │  └────────────────────────────┬───────────────────────────────────┘  │
 └───────────────────────────────┼─────────────────────────────────────┘
                                 │
          ┌──────────────────────┼──────────────────────┐
          │                      │                      │
  ┌───────▼──────┐    ┌──────────▼────────┐   ┌────────▼──────────┐
  │  MongoDB     │    │  spaCy Transformers│   │  Google Gemini    │
  │  Atlas       │    │  + SentenceTransf. │   │  1.5 Pro API      │
  └──────────────┘    └────────────────────┘   └───────────────────┘
```

---

## 2. Core Modules

### 2.1 Adaptive Recommendation Engine (`recommender.py`)
A multi-stage hybrid scoring system, now utilizing **Transformer Embeddings** for the semantic layer:

| Stage | Weight | Description |
|-------|--------|-------------|
| Semantic Layer | ~70% | **SentenceTransformer (`all-MiniLM-L6-v2`)** embeddings + Cosine Similarity |
| Skill Match | Inline | Fuzzy + exact normalized skill matching |
| Sector Alignment | ~20% | Historical sector preference from interaction history |
| Location Match | ~10% | Remote vs. city preference alignment |
| Behavioral Boost | ±20pts | Adaptive adjustment based on `viewed`, `saved`, `applied`, `rejected` actions |

### 2.2 Model Loader Utility (`utils/model_loader.py`)
Introduced in v2.4 to handle infrastructure constraints:
- **Lazy Singleton**: Initializes the `SentenceTransformer` only when `model_loader.model` is first accessed.
- **Infrastructure Safety**: Ensures the heavy model isn't loaded during startup, allowing deployment on 512MB RAM environments.

### 2.3 Resume Intelligence Pipeline (`services/resume_service.py`)
A modular, two-step NLP pipeline:

**Step 1 — Parse (Never writes to DB):**
1. Text extraction: `pdfminer.six` for PDFs, `python-docx` for DOCX.
2. Section detection: Named Entity Recognition using `en_core_web_trf`.
3. Semantic skill normalization: `all-MiniLM-L6-v2` to map raw text to a canonical skill set.

**Step 2 — Confirm (User-controlled merge):**
1. User reviews extracted data in the Verification Modal.
2. HPIS Merge Logic: Manual entries are always authoritative. AI data enriches, never overwrites.
3. Profile Strength recalculated after merge.

### 2.4 Skill Gap Service (`services/skill_gap_service.py`)
Introduced in v2.2 — runs on demand when a user clicks an internship.

**Pipeline:**
```
User clicks internship
        ↓
Fetch internship from DB (by _id or internship_id)
        ↓
If required_skills empty → Extract via Gemini + Cache to DB
        ↓
missing = required_skills − user_skills   (set difference)
        ↓
Send missing skills to Gemini for explanation
        ↓
Return structured JSON response
```

### 2.5 Gemini AI Interface (`gemini_service.py`)
Centralized service for all generative AI operations:

| Method | Purpose |
|--------|---------|
| `extract_skills_from_description()` | Parses raw internship descriptions → structured skill list |
| `generate_skill_explanation()` | Generates brief professional explanation of why missing skills matter |
| `generate_safety_filter()` | Content safety validation layer |

---

## 3. Data Architecture

### 3.1 MongoDB Collections

| Collection | Purpose |
|------------|---------|
| `users` | User profiles, skills, preferences, resume data |
| `internships` | Job listings with skills, description, company, sector |
| `user_feedback` | Interaction logs (viewed, saved, applied, rejected) |
| `user_behavior_profiles` | Aggregated sector preferences per user |
| `match_scores` | Historical match percentage snapshots |

### 3.2 User Profile Document (Key Fields)
```json
{
  "email": "user@gmail.com",
  "full_name": "...",
  "skills": ["Python", "React"],
  "target_roles": ["ML Engineer"],
  "sector_preference": ["AI", "Fintech"],
  "location_preference": ["Remote", "Bangalore"],
  "profile_strength": 80,
  "resume_parsed": true,
  "linkedin_url": "...",
  "github_url": "..."
}
```

### 3.3 Internship Document (Key Fields)
```json
{
  "internship_id": "INT102",
  "title": "Frontend Developer Intern",
  "company": "Tech Corp",
  "sector": "SaaS",
  "location": "Remote",
  "required_skills": ["HTML", "CSS", "React"],
  "job_description": "...",
  "apply_url": "..."
}
```

---

## 4. Security

| Layer | Implementation |
|-------|---------------|
| Authentication | JWT (HS256), short-lived access tokens |
| Password Hashing | `bcrypt` via `passlib` |
| Rate Limiting | `slowapi` — IP-based throttling on login and resume upload |
| Input Validation | Pydantic models on all request bodies |
| Domain Restriction | Only `@gmail.com` emails accepted at registration |

---

## 5. Performance

- **Lazy Transformer Load**: Heavy NLP models are deferred until the first relevant request, keeping startup memory < 150MB.
- **Async I/O**: All DB and Gemini calls are `async/await` — no blocking on I/O.
- **Skill Cache**: When Gemini extracts skills from a description, results are cached to the internship document, preventing re-computation.
- **Build-stage Caching**: Transformers are pre-downloaded during the build step on Render to prevent runtime timeouts.

---

## 6. Frontend Architecture

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| State Management | Zustand (per-store: user, recommendations, analytics) |
| Styling | Tailwind CSS |
| Internationalization | `react-i18next` (EN, HI, TA, TE) |
| API Client | Axios with JWT interceptor |
| UI Components | Lucide Icons, Custom Cards, Modals |
| Data Visualization | Recharts |

### Frontend Store Architecture
```
userStore          → profile data, auth operations
recommendationStore → recommendations, skill gap reports, gap fetching
analyticsStore     → match trend, sector distribution, heatmaps
```

---

## 7. Version History

| Version | Key Changes |
|---------|------------|
| v2.3.2 | Dashboard stat card accuracy fix; high-match role count metric |
| v2.3.1 | Skill Gap Visualization — SkillGapModal with AI explanations |
| v2.3.0 | Skill Gap API endpoint; SkillGapService; GeminiService extensions |
| v2.2.0 | Resume Verification Modal; two-step parse workflow |
| v2.1.0 | Resume Intelligence System; HPIS merge engine |
| v2.0.0 | Behavioral adaptation; interaction feedback scoring |
| v1.0.0 | Base recommendation engine with TF-IDF + JWT Auth |
