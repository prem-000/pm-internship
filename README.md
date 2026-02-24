🚀 AI-Based Adaptive Internship Recommendation Engine v2

An intelligent, adaptive AI system that matches students with highly relevant internships using hybrid semantic matching, behavioral learning, and impact-based skill gap analysis.

Built for scalability, personalization, and real-world career growth.

🎯 Problem Statement
- Students are overwhelmed by long, irrelevant internship listings.
- Most portals return static, keyword-based results with no personalization or learning capability.

This system solves that by:
- **Adaptive Ranking**: Learns from user interactions (clicks, saves, applications) to re-weight results.
- **Impact-Based Gap Analysis**: Identifies missing skills and quantifies their impact on your career visibility.
- **Generative Roadmaps**: Provides structured learning paths via Gemini AI.
- **Hybrid Scoring**: Combines TF-IDF semantic similarity with fuzzy skill matching.

🏗 System Architecture
```text
User Profile + Interaction History
    ↓
Hybrid Scoring Engine (Base Score)
    ↓
Behavior Adjustment Layer (Bonus/Penalty)
    ↓
Impact-Based Gap Analysis Engine
    ↓
Gemini AI Roadmap Generator
    ↓
Personalized Recommendation Response
```

🧠 Core Features
1️⃣ Adaptive Scoring Engine (V2)
A multi-layered scoring model that evolves with the user:
- **Base Score (70%)**: TF-IDF Semantic Similarity + Fuzzy Skill Match.
- **Sector Alignment (20%)**: Historical preference for specific industries.
- **Location Match (10%)**: Remote vs. City preference.
- **Behavior Bonus**: Dynamic points added/subtracted based on `viewed`, `saved`, `applied`, or `rejected` actions.

2️⃣ Impact-Based Skill Gap Analysis
For each gap identified, the system calculates:
- **Estimated Score Gain**: The precise increase in match percentage if the skill is acquired.
- **Internships Unlocked**: The number of additional opportunities in the database the user would become relevant for.
- **Impact Tiers**: Categories gaps into *High*, *Medium*, and *Low* impact for prioritized learning.

3️⃣ Interaction Tracking & Profiling
A dedicated behavioral layer that captures:
- **Actions**: Track user intent across the platform.
- **Automated Profiling**: Aggregates weights for sectors and skills to build a "latent preference" profile for every user.

4️⃣ Gemini AI Learning Roadmaps
For each missing skill, the system generates a 4–5 week structured learning path:
- Week-by-week milestones.
- Curated resource guidance.
- Powered by **Google Gemini 1.5 Pro**.

🛠 Tech Stack
| Layer | Technology |
| :--- | :--- |
| **Backend** | FastAPI (Async Python) |
| **Database** | MongoDB Atlas |
| **NLP** | Scikit-learn (TF-IDF Vectorization) |
| **Similarity** | Cosine Similarity + Rapidfuzz |
| **AI/LLM** | Google Gemini 1.5 Pro API |
| **Authentication** | JWT + Argon2 Hashing |

📡 API Endpoints
� Authentication
- `POST /api/auth/register`: Create a new account (Gmail enforcement).
- `POST /api/auth/login`: Secure access token generation.

📌 Recommendation & Behavior
- `POST /api/recommend/`: Get personalized, adaptive recommendations.
- `POST /api/interactions/`: Record actions (`viewed`, `saved`, `applied`, `rejected`) to train the engine.

� Performance & Stability
- **Synthesis Engine**: Automatically handles missing data in internships by synthesizing descriptions from metadata.
- **Vector Caching**: TF-IDF vectors are computed once at startup and reused for high performance.
- **Rate Limiting**: Integrated SlowAPI for security and stability.

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
   Create a `.env` file with:
   ```env
   MONGODB_URI=your_mongo_uri
   JWT_SECRET=your_secret
   GOOGLE_API_KEY=your_gemini_key
   ADMIN_DEFAULT_EMAIL=admin@gmail.com
   ADMIN_DEFAULT_PASSWORD=your_password
   ```
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

🏆 Version: 2.2.0
**Status**: Fully functional Adaptive Recommendation System with interaction tracking and strategic gap insights.
