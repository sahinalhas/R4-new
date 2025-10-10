# Rehber360 - Student Guidance System

## Overview

Rehber360 is a comprehensive Turkish-language student guidance and management system for educational institutions. It offers tools for student tracking, counseling, risk assessment, behavioral monitoring, and academic performance analysis. A core feature is its AI-powered profile analysis, which generates standardized student profiles from diverse data sources like academic records, attendance, and surveys. The system also includes an AI Assistant for local, AI-powered student counseling, supporting both OpenAI and Ollama (Llama 3.1) models. Built as a full-stack TypeScript application with React, Express.js, and SQLite, it emphasizes data standardization and evidence-based interventions for student success.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:** React 18 with TypeScript, Vite, Radix UI, Tailwind CSS, TanStack React Query, React Hook Form + Zod, React Router DOM, Framer Motion, Recharts.

**Architecture Decisions:**
- **Feature-based organization** with lazy loading and code splitting.
- **Global error boundaries** and responsive mobile-first design.
- **Accessibility** is a priority (WCAG AAA compliant color contrast).
- **State Management:** React Query for server state, Context API for authentication, local component state. No global client-side state managers like Redux.
- **Performance Optimizations:** Memoization, background processing for analytics, chart data point limiting, virtual scrolling, and asset optimization.

### Backend Architecture

**Technology Stack:** Express.js v5, SQLite with `better-sqlite3`, TypeScript, Zod.

**Feature-Based Modular Architecture:** Organized into `server/features/<feature-name>/`, each containing `routes/`, `services/`, `repository/`, and `types/`. Key feature modules include core domains (students, surveys), academic data, student support, administrative functions, and AI features (holistic-profile, standardized-profile, student-profile-ai, ai-assistant).

**Key Architectural Decisions:**
- **Database Layer:** SQLite for simplicity, prepared statements for security.
- **Repository Pattern:** Isolates data access, returning DTOs.
- **Service Layer:** Handles business logic, validation, and orchestration.
- **Type Safety:** Shared types (`shared/types/`) ensure consistency.
- **Security:** Input sanitization, prepared statements, CORS, security headers, rate limiting.
- **Error Handling:** Centralized error messages and structured error responses.

### Data Architecture

**Database Schema:** Normalized relational schema in `data/data.db` with tables for students, academic/social-emotional/health profiles, behavior incidents, attendance, surveys, counseling sessions, and interventions.

**Data Standardization:** Utilizes a comprehensive taxonomy (`shared/constants/student-profile-taxonomy.ts`) for standardized values across academic subjects, social-emotional competencies, behavioral categories, and risk factors, ensuring deterministic AI analysis.

### AI and Analytics System

**AI Assistant:** A professional-grade virtual guidance counselor with deep psychological and pedagogical expertise.
- **Architecture:** 
  - `AI Provider Service` (Singleton pattern) - Unified abstraction for OpenAI and Ollama
  - `AI Prompt Builder Service` - Professional counselor prompts with 15+ years expertise simulation
  - `Pattern Analysis Service` - Automatic pattern recognition, trend analysis, and correlation detection
  - `Student Context Service` - Comprehensive data aggregation with deep insights
  - `AI Assistant Routes` - Chat, streaming, risk analysis, and meeting summaries
- **Deep Analysis Capabilities:**
  - **Pattern Recognition:** Identifies behavioral patterns, academic trends, temporal cycles, and correlations
  - **Proactive Insights:** Automatically detects critical findings without being asked
  - **Psychological Depth:** Analyzes motivation, emotional regulation, resilience, and developmental factors
  - **Evidence-Based Recommendations:** Provides SMART goals, intervention strategies, and follow-up plans
  - **Contextual Awareness:** Considers family, peers, school climate, and cultural factors
- **Features:** 
  - Real-time streaming chat for immediate responses
  - 9 comprehensive quick-action analyses (profile, risk, patterns, interventions, parent meeting prep, strengths, learning, social-emotional, proactive insights)
  - Risk analysis with multi-factor assessment
  - Professional meeting summaries with action items
  - Runtime model selection (OpenAI GPT-4 or Ollama Llama 3.1)
  - Full Turkish language support with educational terminology
- **Security:** Singleton pattern for provider usage, no API keys in frontend, local Ollama for privacy.

**Advanced AI Features (October 2025):**
1. **Daily Insights Service** (`server/features/daily-insights/`)
   - Automated daily/weekly/monthly reports for all students
   - Real-time student status tracking with change detection
   - AI-powered pattern analysis and trend detection
   - Proactive alert generation (academic decline, behavioral issues, attendance problems, social isolation)
   - Priority action recommendations for counselors
   - Database: `daily_insights`, `student_daily_status`, `proactive_alerts` tables

2. **Deep Analysis Engine** (`server/features/deep-analysis/`)
   - Comprehensive student trajectory prediction (1-3 month outlook)
   - Multi-dimensional risk assessment (academic, social-emotional, behavioral, attendance)
   - Personalized intervention planning with evidence-based strategies
   - Comparative analysis (peer comparison, historical trends)
   - Batch processing for multiple students

3. **Smart Recommendation Engine** (`server/features/ai-assistant/routes/recommendations.routes.ts`)
   - Priority student identification with automated scoring
   - Intervention effectiveness prediction
   - Resource recommendation system (academic, social-emotional, behavioral, family support)
   - Implementation guides for counselors

4. **Meeting Prep Assistant** (`server/features/ai-assistant/routes/meeting-prep.routes.ts`)
   - Parent meeting briefing generation
   - Teacher collaboration planning
   - Evidence-based intervention plan creation
   - Automated meeting documentation

**AI Dashboard:** New `/ai-insights` route provides daily insights visualization, critical alerts, positive updates, and recommended actions.

**Unified Scoring Engine:** Calculates 8 standardized scores (0-100) per student: Academic, Social-Emotional, Behavioral Risk, Attendance, Motivation, Health & Wellness, Overall Risk, and Protective Factors.

**Deterministic Profile Analysis:** `AI Profile Analyzer` uses fixed prompts with OpenAI (temperature=0) to generate strengths, areas for growth, risk levels, and intervention recommendations, ensuring consistent analysis.

**Early Warning System:** Risk assessment pipeline that calculates aggregate scores, applies weighted thresholds, generates prioritized alerts, and recommends evidence-based interventions.

**Analytics Caching:** In-memory caching with configurable TTL, background processing, and memoization for performance optimization.

### Authentication and Authorization

**Role-Based Access Control (RBAC):** Four roles (Admin, Counselor, Teacher, Observer) with hierarchical permissions, defined in `client/lib/auth-context.tsx`.
**Security:** Password hashing (bcryptjs), session-based authentication (via context), and permission guards on routes and components.

### Build and Deployment

**Build Process:** Two-stage build (client and server) using Vite, producing optimized bundles in `dist/`.
**Deployment Target:** Configured for Replit VM, running `dist/server/production.mjs` on port 3000.
**Database:** File-based SQLite (`data/data.db`) with automatic backups and schema migrations.
**Environment Variables:** Optional `OPENAI_API_KEY`, `ALLOWED_ORIGINS`, `PORT`, and Ollama-specific variables.

## Recent Changes

### October 10, 2025 - Advanced AI Features
- ✅ Implemented Daily Insights Service with automated reporting
- ✅ Added Proactive Alert System for real-time pattern detection
- ✅ Built Deep Analysis Engine with trajectory predictions
- ✅ Created Smart Recommendation Engine for prioritization
- ✅ Developed Meeting Prep Assistant for counselor support
- ✅ Added AI Insights Dashboard at `/ai-insights`
- ✅ Database Migration 017: Added `daily_insights`, `student_daily_status`, `proactive_alerts` tables
- ✅ Fixed UNIQUE constraint bug in daily insights UPSERT operations
- ✅ Configured Vite HMR for Replit environment (WSS protocol)

**API Endpoints Added:**
- `POST /api/daily-insights/generate` - Generate daily insights
- `GET /api/daily-insights/today` - Get today's insights
- `GET /api/daily-insights/alerts` - Get proactive alerts
- `POST /api/deep-analysis/:studentId` - Generate deep analysis
- `POST /api/deep-analysis/batch` - Batch analysis
- `GET /api/ai-assistant/recommendations/priority-students` - Priority list
- `GET /api/ai-assistant/recommendations/interventions` - Intervention recommendations
- `POST /api/ai-assistant/meeting-prep/parent` - Parent meeting prep
- `POST /api/ai-assistant/meeting-prep/teacher` - Teacher meeting prep

## External Dependencies

### Core Runtime Dependencies

**Frontend:** `react`, `react-router-dom`, `@tanstack/react-query`, `@tanstack/react-virtual`, Radix UI components.
**Backend:** `express`, `better-sqlite3`, `bcryptjs`, `cors`, `dotenv`.
**Shared:** `zod`, `xlsx`, `jspdf`.

### Third-Party Services

1.  **OpenAI API:** Optional integration for AI features; requires `OPENAI_API_KEY`.
2.  **Ollama:** Recommended for local, privacy-focused AI; runs on `localhost:11434`.
3.  **MEB Integration (placeholder):** Configurable, not actively implemented.
4.  **e-Okul API (placeholder):** Configurable, not actively implemented.

### Database

-   **SQLite Database:** `data/data.db`, uses `better-sqlite3` driver. Features automatic schema migrations, scheduled backups, and database triggers.

### Development Tools

-   **Vitest:** Unit testing.
-   **ESLint, Prettier:** Code quality and formatting.
-   **TypeScript:** Static type checking.

### Asset Management

-   **Fonts:** Inter (Google Fonts).
-   **Icons:** Lucide React.
-   **Charts:** Recharts.