# Product Requirements Document (PRD): Resume Intelligence System v2.0

## 1. Product Goal
The Resume Intelligence System automatically extracts user information from uploaded resumes and populates the user profile. The system reduces manual data entry and improves the accuracy of internship recommendations.

## 2. Key Objectives
The system must:
- Extract structured data from resumes (PDF/DOCX).
- Detect technical skills automatically using hybrid NLP.
- Normalize skill names using semantic similarity.
- Update user profiles safely without overwriting manual data.

## 3. Supported Resume Formats
- **PDF** (via `pdfminer.six`)
- **DOCX** (via `python-docx`)

## 4. System Architecture
The resume intelligence system follows a modular NLP pipeline:
`Resume Upload` → `File Validation` → `Text Extraction` → `Section Detection` → `Entity Extraction` → `Skill Detection` → `Skill Normalization` → `Profile Merge Engine` → `MongoDB Profile Update`

## 5. Backend Router Architecture
The backend exposes five primary routers:
1. `auth_router.py`: Handles authentication and Gmail enforcement.
2. `user_router.py`: Manages user profile retrieval and manual updates.
3. `resume_router.py`: (New) Handles resume upload, parsing, and confirmation.
4. `recommendation_router.py`: Computes adaptive recommendations.

## 6. Resume Router Endpoints
- `POST /api/profile/parse-resume`: Step 1 - Accept a PDF/DOCX file and return parsed data (no DB update).
- `POST /api/profile/confirm-resume-data`: Step 2 - Accept confirmed data and update the user profile safely.

## 7. System Services
- `text_extractor.py`: Converts binary files to raw text.
- `resume_parser.py`: Uses spaCy (en_core_web_trf) for NER and rule-based section detection.
- `skill_normalizer.py`: Performs fuzzy and semantic normalization via `sentence-transformers`.
- `profile_updater.py`: Implements the HPIS Merge Engine rules.

## 8. Algorithms Used
### Text Extraction
- **PDF**: `pdfminer.six` for high-fidelity text extraction.
- **DOCX**: `python-docx` for structured paragraph processing.

### Section Detection
- **Algorithm**: Rule-based header detection using regex patterns for standard resume headings.

### Entity Extraction
- **Algorithm**: Named Entity Recognition (NER).
- **Model**: `spaCy en_core_web_trf` for professional entity detection (PERSON, ORG, etc.).

### Contact Info Extraction
- **Algorithm**: Regular Expressions (Regex) for Email, LinkedIn, GitHub, and Portfolio URLs.

### Skill Detection
1. **Dictionary Skill Mining**: Keyword matching against a curated technical skill database.
2. **Semantic Skill Detection**: Sentence embedding similarity using `all-MiniLM-L6-v2`.

### Skill Normalization
- **Algorithm**: Synonym dictionary mapping + Fuzzy matching + Cosine similarity.
- **Example**: "JS" → "JavaScript", "ML" → "Machine Learning".

## 9. Profile Merge Engine (HPIS Rules)
- **Rule 1 — Deduplication**: Skills and projects are deduplicated using `$addToSet` and set operations.
- **Rule 2 — Preservation**: Manual user fields (Bio, Name, Education) are NEVER overwritten by AI.
- **Rule 3 — Append**: New projects, experience, and certifications are appended via `$push`.
- **Rule 4 — Conditional Update**: Social links are updated only if currently empty.

## 10. Database Integration
- **Database**: MongoDB Atlas.
- **Operations**: `$set`, `$push`, `$addToSet` for atomic and safe updates.

## 11. Performance Targets
| Metric | Target |
| :--- | :--- |
| Resume parsing time | < 3 seconds |
| API Response (Preview) | < 2 seconds |
| Model Loading | Just-in-time with fallback |

## 12. Success Metrics
- **Profile Completion Rate**: Target > 80% for 90% of active users.
- **Resume Upload Adoption**: Target > 50% of new signups.
- **Recommendation Relevance**: Improvement in CTR on recommended internships.

## 13. PRD Update — Internship Skill Gap Retrieval (v2.2)

### Feature Overview
The system must provide missing skill insights when a user selects an internship. When a user clicks an internship, the backend retrieves the internship requirements and compares them with the user's skills extracted from their resume.

The system then returns:
- Missing skills required for the internship
- A short explanation generated using Gemini AI explaining why those skills are important.

This feature allows users to understand why they may not be eligible for a specific internship.

### System Integration
This feature extends the existing recommendation system and does not introduce new routers.

Updated pipeline:
`Resume Upload` → `Resume Parsing` → `Skill Detection` → `Skill Normalization` → `Profile Merge Engine` → `Recommendation Engine` → `User clicks internship` → `Internship Skill Retrieval` → `Skill Gap Detection` → `Gemini Explanation Generation` → `Missing Skills JSON Response`

### Backend Router Integration
The feature will be implemented inside `recommendation_router.py`.
New endpoint: `GET /api/recommend/{internship_id}/skill-gap`

This endpoint returns missing skills for the selected internship.

### Skill Gap Algorithm
The system computes missing skills by comparing required internship skills with user skills.
Algorithm: `missing_skills = required_skills − user_skills`

### Gemini Explanation Generation
After missing skills are computed, the system sends them to Gemini to generate a brief explanation.

### API Response Structure
The endpoint must return a structured JSON response containing internship data, user skills, missing skills, and the Gemini explanation.

### Backend Services
A new service will handle the skill gap computation: `skill_gap_service.py`.
Responsibilities:
- compute missing skills
- call Gemini API for explanation
- return structured JSON response.

### Performance Targets
| Metric | Target |
| :--- | :--- |
| Skill gap computation | < 50 ms |
| Gemini explanation generation | < 2 seconds |
| API response time | < 3 seconds |

### System Constraints
- No new router should be created.
- The feature must extend the existing recommendation router.
- User profile data must not be modified during skill gap retrieval.
- Missing skills must be computed dynamically.

## 14. PRD Update — Lazy Model Loading & Deployment Optimization (v2.4)

### 14.1 Feature Overview
To ensure successful deployment on restricted infrastructure (e.g., Render Free Tier with 512MB RAM), the system must implement lazy loading for all heavy transformer models. Heavy models such as `SentenceTransformer` must not be initialized during server startup.

### 14.2 Key Requirements
- **Deferred Initialization**: Models must only load when an endpoint requiring AI processing is first called.
- **Low Memory Footprint**: The initial server memory usage must remain below 150MB.
- **Model Efficiency**: Use optimized, lightweight models (e.g., `all-MiniLM-L6-v2`) for semantic similarity.
- **Build-time Model Caching**: Heavy model files should be pre-downloaded during the build stage to prevent runtime network timeouts.

### 14.3 Implementation Architecture (Model Loader)
A global `ModelLoader` service will manage the lifecycle of AI models:
1. API server starts (Transformers uninitialized).
2. First request to `/api/recommend/` triggers the loader.
3. Loader initializes the model into memory.
4. Subsequent requests reuse the loaded instance.

### 14.4 Performance Targets (Cold Start)
| Metric | Target |
| :--- | :--- |
| API server start | < 3 seconds |
| Initial AI Request (Model Load) | 8–15 seconds |
| Subsequent AI Requests | 300–800 ms |

### 14.5 Success Metrics
- **Deployment Stability**: 0 crashes on 512MB RAM during startup.
- **Model Availability**: 100% success rate in model initialization on-demand.

## 15. Success Metrics
- **Profile Completion Rate**: Target > 80% for 90% of active users.
- **Resume Upload Adoption**: Target > 50% of new signups.
- **Recommendation Relevance**: Improvement in CTR on recommended internships.
