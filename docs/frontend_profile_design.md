# Frontend Design Specification — AIRE v2.3.2

## 1. Design Philosophy
The AIRE frontend is designed with a **Premium Modern AI SaaS** aesthetic. Every page prioritizes clarity, data density, and career-driven focus — without feeling overwhelming.

### Visual Style
- **Color Palette**: Slate-900 for text, Primary Blue (`#3B82F6`) for actions, Emerald for success states, Amber for warnings.
- **Typography**: `Inter` (Google Fonts) — clean, high-readability sans-serif.
- **Micro-interactions**: Entrance animations (`slide-in-from-bottom`, `fade-in`), hover scales, smooth progress bar transitions.
- **Glassmorphism**: Used in Modals — `backdrop-blur`, soft borders, gradient overlays.
- **Dark Sidebar**: slate-900 navigation panel with active state highlights.

---

## 2. Page Structure & Navigation

### Sidebar Navigation (Desktop)
Links: Dashboard, My Profile, Recommendations, Skill Gap, Settings

- Highlighting: Active page highlighted with `bg-white/10` indicator.
- User Badge: Displays first letter of the user's name, dynamically sourced from profile.
- Language Switcher: EN / HI / TA / TE — changes UI language using `i18next`.
- Logout: Clears JWT token and redirects to login.

### Top Bar
- Displays page title contextually.
- Contains notification icon and user avatar (initials-based, no image required).
- Avatar correctly reads from user profile name.

---

## 3. Pages

### 3.1 Dashboard (`/`)
The primary overview page after login.

**Stat Cards (4 cards):**
| Card | Value Source | What It Shows |
|------|-------------|---------------|
| Profile Strength | `profile.profile_strength` | Completion % with progress bar |
| Skill Matches | `recommendations[0].score` | Best match % from top recommendation |
| High-Match Roles | Count of recs with score ≥ 70% | Number of strong opportunities |
| Skills Identified | `profile.skills.length` | Skills confirmed on profile |

**Recommended Internships Panel** (top 5):
- Lists top recommendations with title, company, location, and match %.
- Click → links to `/recommendations` for full list.
- Apply button opens internship URL in new tab.

**Sector Distribution Panel** (sidebar):
- Shows aggregated sectors from user interaction history.
- Falls back to AI/Cloud/Cybersecurity defaults for new users.

---

### 3.2 Profile Page (`/profile`)
Redesigned in v2.1 as a modern AI SaaS profile management interface.

**Sections:**
1. **AI Resume Suite** — Upload PDF/DOCX resume, trigger extraction.
2. **Personal Intelligence** — Name, Bio, Location, LinkedIn, GitHub, Portfolio.
3. **Skills Matrix** — Interactive tag-based skill manager.
4. **Career Preferences** — Target Roles, Sector Preference, Location Preference.
5. **Professional Links** — Social proof verification.

**Resume Upload Workflow:**
1. Upload file (Drag & Drop or Click).
2. Parser runs — loading spinner displayed.
3. **Verification Modal** opens immediately:
   - User reviews extracted fields.
   - Can edit name, education, experience before merging.
   - Skill Curator: remove or keep AI-detected skills.
   - Click "Confirm & Merge" → calls `/api/profile/confirm-resume-data`.
4. Profile updates silently — success toast shown.

**Skills Matrix:**
- Add skills via text input + **Enter key** or **Add button**.
- Remove skills with ✕ button on each tag.
- Changes auto-saved to backend via `userStore.updateProfile`.

---

### 3.3 Recommendations Page (`/recommendations`)
A full-page grid of all personalized internship recommendations.

**Cards:**
- Shows internship title, company, location, match score (progress bar), matched/missing skills.
- **High Match** badge appears for score ≥ 80%.
- Click anywhere on card → **Skill Gap Modal** opens.
- Apply button (stops card click propagation) → opens external URL in new tab.

**Skill Gap Modal:**
Opens as an animated centered modal with backdrop blur.

| Section | Content |
|---------|---------|
| Header | Internship title + "Analysis Report" badge |
| Matched Skills | Green badges — skills you already have |
| Missing Skills | Gray badges — skills to acquire |
| AI Insight | Gradient panel with Sparkles icon + Gemini explanation |
| CTA | "Understood" button closes modal |

**Loading State:** Spinner + "Analyzing Skill Gaps..." shown while API responds.
**Error State:** Alert icon + error message + "Close" button.

---

### 3.4 Skill Gap Page (`/skill-gap`)
Dedicated skill gap analysis page (linked from Dashboard sidebar).

---

### 3.5 Settings Page (`/settings`)
- Toggle email notifications and AI alerts.
- Language switcher (EN, HI, TA, TE).
- Change password section.

---

### 3.6 Login / Registration Pages
- **Login**: Email + Password with show/hide toggle.
- **Registration**: Email + Password + Confirm Password with show/hide toggles.
- Password strength indicator on registration.
- Form validation with toast error messages.
- Auto-redirect to Dashboard on success.

---

## 4. Internationalization (i18n)
Supported languages: **English**, **Hindi (हिन्दी)**, **Tamil (தமிழ்)**, **Telugu (తెలుగు)**

All UI text uses `t('key')` calls via `react-i18next`.
Language preference is stored in JWT token response and applied on login.

### Key Translation Groups
- Navigation labels
- Dashboard stats and subtitles
- Profile section headers
- Skill gap modal labels (`matched_skills`, `missing_skills`, `no_gaps`, `ai_insight`)
- Toast messages (`skill_saved`, `skill_removed`, `resume_parsed`)

---

## 5. State Management

| Store | State | Actions |
|-------|-------|---------|
| `userStore` | `profile`, `isLoading` | `fetchProfile`, `updateProfile` |
| `recommendationStore` | `recommendations`, `skillGapReport`, `isGapLoading` | `fetchRecommendations`, `fetchSkillGap`, `clearSkillGap` |
| `analyticsStore` | `data` (trend, sectors, heatmap), `isLoading` | `fetchAnalytics` |

---

## 6. API Communication
- **Client**: `axios` with a base URL pointing to `http://localhost:8000/api`.
- **Auth**: Axios interceptor adds `Authorization: Bearer <token>` to every request automatically.
- **Error Handling**: Toast-based user notifications via `sonner`.

---

## 7. Component Directory
```
aire-ui/src/
├── app/
│   ├── page.tsx               → Dashboard
│   ├── profile/page.tsx       → Profile Page
│   ├── recommendations/page.tsx → Recommendations
│   ├── skill-gap/page.tsx     → Skill Gap Analysis
│   ├── settings/page.tsx      → Settings
│   ├── login/page.tsx         → Login
│   └── register/page.tsx      → Registration
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx        → Navigation sidebar
│   │   ├── PageHeader.tsx     → Page title bar
│   │   └── AppShell.tsx       → Root layout wrapper
│   ├── profile/
│   │   ├── SkillsManager.tsx  → Tag-based skill input/removal
│   │   └── ResumeUpload.tsx   → PDF/DOCX upload zone
│   │   └── ResumeVerificationModal.tsx → Two-step merge review
│   ├── recommendations/
│   │   └── SkillGapModal.tsx  → AI-powered gap analysis modal
│   └── ui/
│       └── Card.tsx           → Reusable card component
├── store/
│   ├── userStore.ts
│   ├── recommendationStore.ts
│   └── analyticsStore.ts
└── lib/
    ├── api.ts                 → Axios client
    └── i18n.ts               → i18next configuration (4 languages)
```

---

## 8. Performance Guidelines
- **Lazy Loading**: Modals are conditionally rendered (`if (!isOpen) return null`).
- **Deduplication**: Zustand stores prevent redundant API calls.
- **Optimistic UI**: Skill changes reflect immediately in the UI, then sync to backend.
- **Target**: All pages load in < 2 seconds on local dev server.
