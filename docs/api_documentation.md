# API Documentation — AIRE Backend v2.3.2

This document outlines all REST API endpoints for the AI Internship Recommendation Engine (AIRE).

## Base URL
- **Local**: `http://localhost:8000/api`
- **Swagger UI**: `http://localhost:8000/docs`

---

## 1. Authentication (`/auth`)

### Register
`POST /auth/register`
- **Body**: `{ "email": "user@gmail.com", "password": "...", "confirm_password": "..." }`
- **Constraint**: Only `@gmail.com` addresses are allowed.
- **Password**: Must meet minimum strength requirements (enforced on frontend).
- **Returns**: `{ "message": "User registered successfully" }`

### Login
`POST /auth/login`
- **Body**: `{ "email": "user@gmail.com", "password": "..." }`
- **Returns**: `{ "access_token": "...", "token_type": "bearer", "language": "en" }`

---

## 2. User Profile (`/user`)

### Get Profile
`GET /user/profile`
- **Auth**: Required (Bearer token)
- **Returns**: Full user profile including `skills`, `projects`, `links`, `profile_strength`, `sector_preference`, `location_preference`.
- **Note**: All null fields default to `[]` or `""` — never returns `null` for lists.

### Update Profile
`PUT /user/profile/update`
- **Auth**: Required
- **Body**: Partial profile JSON (any subset of fields).
- **Behavior**: Uses `exclude_unset=True` — only provided fields are updated, existing data is never overwritten with `null`.

---

## 3. Resume Intelligence (`/profile`)
A two-step workflow to give users full control before committing data to their profile.

### Step 1 — Parse Resume
`POST /profile/parse-resume`
- **Auth**: Required
- **Format**: `multipart/form-data`
- **Parameter**: `file` (PDF or DOCX, max 10MB)
- **Behavior**: Extracts data using `spaCy + SentenceTransformers`. Does **NOT** write to the database.
- **Returns**: Extracted fields: `name`, `email`, `education`, `experience`, `skills`, `projects`, `links`.

### Step 2 — Confirm Data
`POST /profile/confirm-resume-data`
- **Auth**: Required
- **Body**: JSON of reviewed/edited extracted data from Step 1.
- **Behavior**: Applies HPIS merge rules — user manual entries are always authoritative. AI data is merged or appended safely.
- **Returns**: `{ "success": true, "profile_strength": 85, "added_skills": [...] }`

---

## 4. Recommendations (`/recommend`)

### Get Personalized Recommendations
`POST /recommend/`
- **Auth**: Required
- **Body**: Optional filters `{ "location": "remote", "sector": "AI" }`
- **Requirements**: User profile must have `skills` and `target_roles` set.
- **Behavior**: Hybrid scoring using TF-IDF Semantic + Skill Match + Sector/Location alignment + Behavioral feedback boost.
- **Returns**:
```json
{
  "recommendations": [
    {
      "internship_id": "...",
      "title": "...",
      "company": "...",
      "location": "...",
      "apply_url": "...",
      "score": 85.4,
      "match_details": {
        "matched_skills": ["Python", "SQL"],
        "missing_skills": ["Docker"],
        "skill_match_percentage": 75.0
      },
      "gap_analysis": {
        "missing_skills": ["Docker"],
        "estimated_score_if_completed": 92.0
      }
    }
  ],
  "profile_strength": 80,
  "total_matches": 12
}
```

### Get Internship Skill Gap
`GET /recommend/{internship_id}/skill-gap`
- **Auth**: Required
- **Path Parameter**: `internship_id` — MongoDB `_id` or logical internship ID.
- **Behavior**: Computes the difference between user skills and internship requirements. If the internship lacks structured skill data, extracts them from the description via Gemini AI and caches the result for future requests.
- **Returns**:
```json
{
  "internship": { "id": "INT102", "title": "Frontend Developer Intern" },
  "user_skills": ["Python", "HTML", "CSS"],
  "missing_skills": { "skills": ["JavaScript", "React", "Git"] },
  "explanation": {
    "gemini_text": "JavaScript is essential for building interactive UIs..."
  }
}
```

---

## 5. Interactions (`/interactions`)

### Record User Interaction
`POST /interactions/`
- **Auth**: Required
- **Body**: `{ "internship_id": "...", "action": "viewed|saved|applied|rejected" }`
- **Behavior**: Trains the adaptive behavioral model. Adjusts future recommendation scores for the user's sector/role preferences.
- **Score Impact**: `applied` +15, `saved` +10, `viewed` +5, `rejected` -10 (per sector, capped at ±20).

---

## 6. Analytics (`/analytics`)

### Match Trend
`GET /analytics/match-trend`
- **Auth**: Required
- **Returns**: Time-series of match percentages from `match_scores` collection. Falls back to default data if empty.

### Sector Distribution
`GET /analytics/sector-distribution`
- **Auth**: Required
- **Returns**: Top 3 sectors based on user's `viewed`, `saved`, and `applied` interactions. Falls back to defaults if no history.

### Behavioral Heatmap
`GET /analytics/behavioral-heatmap`
- **Auth**: Required
- **Returns**: Per-sector breakdown of applied vs viewed counts.

---

## 7. Admin Control (`/admin`)

### Admin Login
`POST /admin/login`
- **Body**: `{ "email": "...", "password": "..." }`
- **Returns**: Admin JWT access token.

### Dashboard Stats
`GET /admin/stats`
- **Auth**: Admin token required.
- **Returns**: Total users, internship count, blocked users, and platform activity summaries.

### System Logs (WebSocket)
`WS /admin/ws/logs`
- **Behavior**: Continuous stream of real-time system events and background process logs.

---

## 8. Health Checks
- `GET /health` — Basic livelihood check.
- `GET /api/health` — Extended health check (DB + service connections).

---

## Error Codes

| Status | Meaning |
|--------|---------|
| 400 | Bad request — missing required profile fields or invalid body |
| 401 | Unauthorized — missing or expired JWT token |
| 404 | Resource not found — internship ID not found |
| 422 | Validation error — incorrect body schema |
| 429 | Rate limit exceeded — too many requests from same IP |
| 500 | Internal server error |
