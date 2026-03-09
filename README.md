🚀 AI-Based Adaptive Internship Recommendation Engine v2.3

An intelligent, adaptive AI system that matches students with highly relevant internships using hybrid semantic matching, behavioral learning, and the new **Resume Intelligence System v2.0**.

Built for scalability, personalization, and real-world career growth.

🎯 Problem Statement
- Students are overwhelmed by long, irrelevant internship listings.
- Most portals return static, keyword-based results with no personalization or learning capability.
- Manual profile building is tedious and prone to missing key technical skills.

This system solves that by:
- **Resume Intelligence v2.0**: Automatically parse PDF/DOCX resumes using spaCy Transformers and Sentence Embeddings.
- **Adaptive Ranking**: Learns from user interactions (clicks, saves, applications) to re-weight results.
- **Impact-Based Gap Analysis**: Identifies missing skills and quantifies their impact on your career visibility.
- **Generative Roadmaps**: Provides structured learning paths via Gemini AI.
- **Hybrid Scoring**: Combines TF-IDF semantic similarity with fuzzy and semantic skill matching.

🏗 System Architecture
```text
Resume Upload (PDF/DOCX) → NLP Parsing (spaCy trf) → Semantic Normalization
                                                           ↓
                      User Profile + Interaction History → Profile Merge Engine (HPIS)
                                                           ↓
                      Hybrid Scoring Engine (Semantic + Behavioral)
                                                           ↓
                      Impact-Based Gap Analysis → Gemini AI Roadmap Generator
                                                           ↓
                      Personalized Recommendation Response
```

🧠 Core Features
1️⃣ Resume Intelligence System (v2.0)
Advanced modular NLP pipeline for automated profiling:
- **Text Extraction**: High-fidelity processing of PDF and DOCX.
- **NER & Section Detection**: Using `en_core_web_trf` for professional entity mapping.
- **Semantic Normalizer**: Sentence embeddings (`all-MiniLM-L6-v2`) to prevent duplicate skills (e.g., JS → JavaScript).
- **HPIS Merge Engine**: Safety-first logic—AI never overwrites manual entries, it only enriches them.

2️⃣ Adaptive Scoring Engine
A multi-layered scoring model that evolves with the user:
- **Base Score (70%)**: TF-IDF Semantic Similarity + Fuzzy Skill Match.
- **Sector Alignment (20%)**: Historical preference for specific industries.
- **Location Match (10%)**: Remote vs. City preference.
- **Behavior Bonus**: Dynamic points added/subtracted based on `viewed`, `saved`, `applied`, or `rejected` actions.

3️⃣ Impact-Based Skill Gap Analysis
For each gap identified, the system calculates:
- **Estimated Score Gain**: The precise increase in match percentage if the skill is acquired.
- **Internships Unlocked**: The number of additional opportunities in the database the user would become relevant for.

4️⃣ Gemini AI Learning Roadmaps
For each missing skill, the system generates a 4–5 week structured learning path powered by **Google Gemini 1.5 Pro**.

🛠 Tech Stack
| Layer | Technology |
| :--- | :--- |
| **Backend** | FastAPI (Async Python) |
| **Database** | MongoDB Atlas |
| **NLP (Resume)** | spaCy Transformers + SentenceTransformers |
| **NLP (Recommender)** | Scikit-learn (TF-IDF Vectorization) |
| **Similarity** | Cosine Similarity + Rapidfuzz |
| **AI/LLM** | Google Gemini 1.5 Pro API |
| **Authentication** | JWT + Argon2 Hashing |

📡 API Endpoints (Highlights)
- `POST /api/auth/register`: Create a account (Gmail enforcement).
- **`POST /api/profile/parse-resume`**: Step 1 - Extract data for review (File upload).
- **`POST /api/profile/confirm-resume-data`**: Step 2 - Save the reviewed data to profile.
- `POST /api/recommend/`: Get personalized, adaptive recommendations.
- `POST /api/interactions/`: Record actions to train the engine.

🧪 Local Setup
1. **Clone Repository**
   ```bash
   git clone <repo_url>
   cd ai-internship-engine
   ```
2. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```
3. **Configure Environment Variables**
   Create a `.env` file with `MONGODB_URI`, `JWT_SECRET`, and `GOOGLE_API_KEY`.
4. **Run Server**
   ```bash
   uvicorn app.main:app --reload
   ```

📈 Why This Is Different
| Traditional Portals | This Adaptive Engine |
| :--- | :--- |
| Keyword filtering | Semantic & Behavioral ranking |
| Static results | Results evolve based on your actions |
| No skill insight | Quantified "Impact" based gap analysis |
| No guidance | AI-driven roadmap generation |

🏆 Version: 2.3.0
**Status**: Fully functional with Resume Intelligence v2.0, Interaction Tracking, and Strategic Gap Insights.
