# API Documentation — AIRE Backend v2.3.0

This document outlines the primary API endpoints for the AI Internship Recommendation Engine (AIRE).

## Base URL
`https://<api-domain>/api` (Remote)
`http://localhost:8000/api` (Local)

---

## 1. Authentication (`/auth`)

### Register
`POST /auth/register`
- **Body**: `{ "email": "user@gmail.com", "password": "password123" }`
- **Constraint**: Only `@gmail.com` addresses are allowed.
- **Returns**: Success message.

### Login
`POST /auth/login`
- **Body**: `{ "email": "user@gmail.com", "password": "password123" }`
- **Returns**: JWT Access Token and language preference.

---

## 2. User Profile (`/user`)

### Get Profile
`GET /user/profile`
- **Headers**: `Authorization: Bearer <token>`
- **Returns**: Full profile data including skills, projects, links, and profile strength.

### Update Profile
`PUT /user/profile/update`
- **Body**: Partial profile fields (JSON).
- **Behavior**: Uses `exclude_unset` to prevent overwriting existing data with nulls.

---

## 3. Resume Intelligence (`/profile`)
This is a two-step workflow designed to give users control over their data.

### Step 1: Parse Resume
`POST /profile/parse-resume`
- **Format**: `multipart/form-data`
- **Parameter**: `file` (PDF/DOCX)
- **Behavior**: Extracts information using NLP. Does **NOT** update the database.
- **Returns**: JSON of extracted data (skills, name, experience, etc.).

### Step 2: Confirm Data
`POST /profile/confirm-resume-data`
- **Body**: JSON object containing the (potentially edited) extracted data.
- **Behavior**: Applies HPIS merge rules and updates the user profile safely.
- **Returns**: Success status + New Profile Strength.

---

## 4. Recommendations (`/recommend`)

### Get Recommendations
`POST /recommend/`
- **Body**: Optional filters `{ "location": "remote", "sector": "SaaS" }`
- **Behavior**: Uses Hybrid Scoring (Semantic + Behavioral) to rank internships.
- **Returns**: List of internships, Gap Analysis, and Semantic Alignment score.

---

## 5. Interactions (`/interactions`)

### Record Interaction
`POST /interactions/`
- **Body**: `{ "internship_id": "...", "action": "viewed|saved|applied|rejected" }`
- **Behavior**: Trains the adaptive intelligence model for the user's latent preferences.

---

## 6. Admin Control (`/admin`)

### Admin Login
`POST /admin/login`
- **Body**: `{ "email": "...", "password": "..." }`
- **Returns**: Admin access token.

### Dashboard Stats
`GET /admin/stats`
- **Returns**: System-wide analytics (User counts, internship trends, blocked users).

### System Logs (WebSocket)
`WS /admin/ws/logs`
- **Behavior**: Continuous stream of system events and background logs.

---

## 7. Global Health
- `GET /health`: Basic operational check.
- `GET /api/health`: Comprehensive API health status.
