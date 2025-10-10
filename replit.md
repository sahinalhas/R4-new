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

**AI Assistant:** A virtual guidance counselor supporting both OpenAI and Ollama.
- **Architecture:** `AI Provider Service` abstraction, `Ollama Integration`, `Student Context Service` for data aggregation, `AI Assistant Routes` for chat and analysis.
- **Features:** Streaming chat, risk analysis, meeting summaries, runtime model selection (OpenAI GPT-4 or Ollama Llama 3.1), and full Turkish language support.
- **Security:** Singleton pattern for provider usage, no API keys in frontend, local Ollama for privacy.

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