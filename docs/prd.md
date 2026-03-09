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
5. `admin_router.py`: Provides administrative controls and analytics.

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
