# Rehber360 - Student Guidance System

## Overview
Rehber360 is a comprehensive Turkish-language student guidance and management system for educational institutions. It provides tools for student tracking, counseling, risk assessment, behavioral monitoring, and academic performance analysis. A key feature is its AI-powered profile analysis, which generates standardized student profiles from diverse data sources. The system also includes an AI Assistant for local, AI-powered student counseling, supporting both OpenAI and Ollama (Llama 3.1) models. Built as a full-stack TypeScript application with React, Express.js, and SQLite, Rehber360 aims to drive data standardization and evidence-based interventions for student success.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Technology Stack:** React 18, TypeScript, Vite, Radix UI, Tailwind CSS, TanStack React Query, React Hook Form + Zod, React Router DOM, Framer Motion, Recharts.
- **Key Decisions:** Feature-based organization with lazy loading, global error boundaries, mobile-first and accessible design (WCAG AAA), React Query for server state, Context API for authentication, and various performance optimizations (memoization, background processing, virtual scrolling).

### Backend
- **Technology Stack:** Express.js v5, SQLite with `better-sqlite3`, TypeScript, Zod.
- **Key Decisions:** Modular architecture (`server/features/<feature-name>/`), Repository Pattern for data access, Service Layer for business logic, shared type safety, robust security measures (input sanitization, prepared statements, CORS, rate limiting), and centralized error handling.
- **Core Features:** Students, Surveys, Academic Data, Student Support, Administrative Functions, and AI features (holistic-profile, standardized-profile, student-profile-ai, ai-assistant).

### Data Architecture
- **Database:** Normalized relational schema in `database.db` (root directory) for student profiles, behavior, attendance, surveys, counseling, and interventions.
- **Data Standardization:** Utilizes a comprehensive taxonomy (`shared/constants/student-profile-taxonomy.ts`) for consistent values across academic, social-emotional, and behavioral data, enabling deterministic AI analysis.

### AI and Analytics System
- **AI Assistant:** A professional-grade virtual guidance counselor with deep psychological and pedagogical expertise.
    - **Architecture:** Unified `AI Provider Service` (OpenAI/Ollama/Gemini), `AI Prompt Builder Service`, `Pattern Analysis Service`, `Student Context Service`.
    - **Capabilities:** Pattern recognition, proactive insights, psychological depth analysis, evidence-based recommendations, contextual awareness, real-time streaming chat, 9 quick-action analyses, risk analysis, meeting summaries, runtime model selection, full Turkish language support.
    - **Provider Selection:** Automatically defaults to Gemini (if GEMINI_API_KEY is present) or Ollama (if not). All providers support streaming, system instructions, and JSON mode.
- **Advanced AI Features:**
    - **Daily Insights Service:** Automated daily/weekly/monthly reports, real-time student status tracking, AI-powered pattern detection, proactive alerts (academic decline, behavioral issues, attendance, social isolation), priority action recommendations.
    - **Psychological Depth Analysis:** Motivational profiling, family dynamics, peer relationships, developmental factors, holistic wellbeing planning.
    - **Predictive Risk Timeline:** 24-hour to 1-week risk predictions with probability scores, behavior pattern detection, causal analysis, early intervention opportunities.
    - **Hourly Action Planner:** Detailed daily action plans for counselors, morning briefings, priority-based task organization.
    - **Student Timeline Analyzer:** Chronological event collection, pattern clustering, causal relationship mapping, turning point identification.
    - **Comparative Multi-Student Analysis:** Class-level pattern detection, risk correlation across students, group dynamics analysis, prioritized recommendations.
- **Notification & Automation System:**
    - **Automated Notification Engine:** Multi-channel notifications (EMAIL, SMS, PUSH, IN_APP), template-based messaging, rule-based triggers, parent dashboard access, delivery tracking.
    - **Intervention Effectiveness Tracking:** Pre/post metrics comparison, AI-powered effectiveness analysis, impact measurement, success pattern identification.
    - **Intelligent Escalation System:** Automated escalation chains, response time tracking, risk-based priorities, multi-level notifications.
- **Deep Analysis Engine:** Comprehensive student trajectory prediction, multi-dimensional risk assessment, personalized intervention planning, comparative analysis.
- **Smart Recommendation Engine:** Priority student identification, intervention effectiveness prediction, resource recommendation system.
- **Meeting Prep Assistant:** Parent meeting briefing, teacher collaboration planning, evidence-based intervention plan creation, automated meeting documentation.
- **AI Dashboard:** Visualizes daily insights, critical alerts, positive updates, and recommended actions.
- **Unified Scoring Engine:** Calculates 8 standardized scores (0-100) per student (Academic, Social-Emotional, Behavioral Risk, Attendance, Motivation, Health & Wellness, Overall Risk, Protective Factors).
- **Deterministic Profile Analysis:** Consistent AI analysis using fixed prompts and zero temperature.
- **Early Warning System:** Risk assessment pipeline, weighted thresholds, prioritized alerts, evidence-based interventions.
- **Analytics Caching:** In-memory caching with configurable TTL and background processing.
- **Voice Transcription & AI Analysis (NEW):**
    - **Provider-Aware STT:** Automatic provider detection (Gemini audio API, OpenAI Whisper, browser Web Speech API fallback)
    - **Hybrid Architecture:** Real-time browser transcription + cloud API accuracy verification
    - **AI-Powered Analysis:** Auto-summary, keyword extraction, category detection, sentiment analysis, risk word flagging, emergency alerts
    - **Smart Integration:** Embedded in counseling session dialogs and student profile pages
    - **Error Handling:** Graceful fallbacks, browser compatibility checks, user-friendly error messages

### Authentication and Authorization
- **Role-Based Access Control (RBAC):** Four roles (Admin, Counselor, Teacher, Observer) with hierarchical permissions.
- **Security:** Password hashing (bcryptjs), session-based authentication, and permission guards.

### Build and Deployment
- **Build Process:** Two-stage build (client and server) using Vite.
- **Deployment Target:** Replit VM, running `dist/server/production.mjs` on port 3000.
- **Database:** File-based SQLite (`database.db` in root directory) with automatic backups and schema migrations.
- **Environment Variables:** Supports `GEMINI_API_KEY` (auto-detected, enables Gemini), `OPENAI_API_KEY`, `ALLOWED_ORIGINS`, `PORT`, and Ollama-specific variables (`OLLAMA_BASE_URL`). Note: `.env` file is auto-created if needed, already in `.gitignore`.

## External Dependencies

### Core Runtime
- **Frontend:** `react`, `react-router-dom`, `@tanstack/react-query`, `@tanstack/react-virtual`, Radix UI.
- **Backend:** `express`, `better-sqlite3`, `bcryptjs`, `cors`, `dotenv`.
- **Shared:** `zod`, `xlsx`, `jspdf`.

### Third-Party Services
- **Gemini API:** Primary AI provider (FREE, no limits). Automatically activates when GEMINI_API_KEY is present. AI Provider Service includes smart auto-switching to Gemini when API key is detected, even if system starts with Ollama.
- **OpenAI API:** Optional integration for AI features (requires OPENAI_API_KEY).
- **Ollama:** Recommended for local, privacy-focused AI (automatic fallback when no cloud API keys are present).
- **MEB Integration:** Placeholder for future integration.
- **e-Okul API:** Placeholder for future integration.

### Database
- **SQLite Database:** `database.db` (root directory) using `better-sqlite3` driver.

### Development Tools
- **Vitest, ESLint, Prettier, TypeScript.**

### Asset Management
- **Fonts:** Inter.
- **Icons:** Lucide React.
- **Charts:** Recharts.