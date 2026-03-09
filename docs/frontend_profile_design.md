# Frontend Design Specification — User Profile Page

## 1. Design Philosophy
The AIRE Profile Page is designed with a **Premium, Modern, and Fluid** aesthetic. It prioritizes clarity and professional impact, moving away from "form-heavy" traditional portals to a dynamic, AI-assisted experience.

### Visual Style
- **Color Palette**: Sophisticated Slate for text, Primary Blue (#3B82F6) for actions, and Emerald for success states.
- **Typography**: Inter / Sans-serif for maximum readability.
- **Micro-interactions**: Entrance animations (translate-up/fade-in), hover scales, and smooth progress bar transitions.
- **Glassmorphism**: Subtle backdrops and soft shadows (shadow-sm/xl) create depth.

## 2. Layout Structure
The page uses a **Responsive Dual-Column Layout**:
- **Navigation (Left Desktop / Top Mobile)**: Persistent sidebar for quick access to Dashboard, Recommendations, and Settings.
- **Profile Header**: Displays user welcome and a dynamic **Profile Strength Meter**.
- **Main Stream**: A vertical stack of modular sections:
    1.  **AI Resume Suite**: Specialized "Drop Zone" for resume processing.
    2.  **Personal Intelligence**: Core user details and academic history.
    3.  **Skills Matrix**: Interactive tag-based manager.
    4.  **Preferences**: Career path and work location toggles.
    5.  **Professional Links**: Verification of social/professional presence.

## 3. Key Components

### 3.1 AI Resume Parser (Drop Zone)
- **Visuals**: Dashed border with high-contrast primary accents.
- **Functionality**:
    - Supports Drag & Drop and manual selection.
    - Features a **Processing State** with animated spinners.
    - **Step-1 Logic**: Calls `/api/profile/parse-resume` to extract data.

### 3.2 Verification Modal (Review Track)
When a resume is parsed, a "floating" modal appears (backdrop-blur):
- **Editable Fields**: Users can correct extracted names, education, or experience.
- **Skill Curator**: Allows users to remove irrelevant skills detected by the AI.
- **Merge Action**: `Confirm & Merge` saves data via `/api/profile/confirm-resume-data`.

### 3.3 Profile Strength Engine
- **UX**: A real-world visualizer of profile completion.
- **Calculation**: Real-time updates as user fills fields or confirms resume data.
- **Feedback**: Encourages users to "Complete fields to increase visibility."

### 3.4 Skill Manager
- **Interactions**:
    - Instant tag removal with visual feedback.
    - Quick-add for manual entry.
    - Auto-normalization (Handled by backend but visually confirmed here).

## 4. UI States & Feedback
- **Skeleton Loaders**: Initial loading state before data retrieval.
- **Toast Notifications**: Contextual alerts for success/failure.
- **Validation**:
    - Real-time URL format checking.
    - Required field highlighting.
- **Transitions**: Smooth entrance animations for each section (entrance-section class).

## 5. Technical Stack (Frontend)
- **Structure**: Semantic HTML5.
- **Logic**: Vanilla JavaScript (Modular ES Modules).
- **Styling**: Tailwind CSS (Utility-first) for rapid, premium styling.
- **Internationalization**: `i18next` support for multi-language profiles.
- **Icons**: Google Material Symbols.
