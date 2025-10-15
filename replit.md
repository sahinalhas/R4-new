# Rehber360 - Student Guidance System

## Overview
Rehber360 is a comprehensive Turkish-language student guidance and management system for educational institutions. It provides tools for student tracking, counseling, risk assessment, behavioral monitoring, and academic performance analysis. A key feature is its AI-powered profile analysis, which generates standardized student profiles from diverse data sources. The system also includes an AI Assistant for local, AI-powered student counseling, supporting both OpenAI and Ollama (Llama 3.1) models. Built as a full-stack TypeScript application with React, Express.js, and SQLite, Rehber360 aims to drive data standardization and evidence-based interventions for student success.

## User Preferences
Preferred communication style: Simple, everyday language.

## Recent Changes

**October 15, 2025:**
- ✅ **Critical Error Fixes Completed:**
  - Fixed student type consolidation: Unified Student types from client and shared folders, implemented safe data transformation functions (backendToFrontend, frontendToBackend)
  - Fixed division-by-zero errors: Added safety guards in social network analysis (calculateClusterCohesion, calculateNetworkDensity) and pattern analysis
  - Fixed findCluster crashes: Added defensive checks for empty arrays and safe pop() operations
  - Implemented subject-specific trend analysis: Updated generateAcademicTrends to use turkishScore, mathScore, scienceScore instead of removed 'subject' column
  - Clarified PDF export strategy: Advanced reports use Excel export; counseling sessions have working jsPDF client-side implementation
  - ✅ **Standardized Error Handling System:**
    - Created comprehensive error utility library (`client/lib/utils/error-utils.ts`) with handleApiError, handleLoadError, handleSaveError, showSuccessToast helpers
    - Expanded error message constants (`client/lib/constants/messages.constants.ts`) with generic fallback messages
    - Integrated error utilities into core API layer (students.api.ts) and critical components (ConflictResolutionUI, ManualCorrectionPanel)
    - Established best practices for consistent error handling across the application

**October 14, 2025:**
- ✅ **Profile Sync System Completed:** Living Student Profile system fully operational
  - All auto-sync hooks integrated (counseling, surveys, exams, behavior, meetings, attendance)
  - Manual correction and conflict resolution UI completed
  - Class-level analytics and comparison tools added
  - Frontend API client completed with all endpoints
  - Database schema fully initialized and tested
  - System tested and running without errors

## System Architecture

### Frontend
- **Technology Stack:** React 18, TypeScript, Vite, Radix UI, Tailwind CSS, TanStack React Query, React Hook Form + Zod, React Router DOM, Framer Motion, Recharts.
- **Key Decisions:** Feature-based organization with lazy loading, global error boundaries, mobile-first and accessible design (WCAG AAA), React Query for server state, Context API for authentication, and various performance optimizations (memoization, background processing, virtual scrolling).
- **Error Handling Best Practices:**
  - **Always use error utilities** from `client/lib/utils/error-utils.ts` instead of direct toast calls
  - **Use standardized messages** from `client/lib/constants/messages.constants.ts` for consistency
  - **Pattern to follow:**
    ```typescript
    import { handleApiError, showSuccessToast } from '@/lib/utils/error-utils';
    import { API_ERROR_MESSAGES } from '@/lib/constants/messages.constants';
    
    try {
      // API call
      showSuccessToast('Success title', 'Description');
    } catch (error) {
      handleApiError(error, {
        title: API_ERROR_MESSAGES.SPECIFIC.ERROR,
        description: API_ERROR_MESSAGES.SPECIFIC.ERROR_DESCRIPTION,
        context: 'functionName'
      });
    }
    ```
  - **Helper functions available:** `handleLoadError()`, `handleSaveError()`, `handleDeleteError()`, `handleUpdateError()`, `createSafeHandler()`
  - **Never use generic messages** like "Hata" or "Bir hata oluştu" directly

### Backend
- **Technology Stack:** Express.js v5, SQLite with `better-sqlite3`, TypeScript, Zod.
- **Key Decisions:** Modular architecture (`server/features/<feature-name>/`), Repository Pattern for data access, Service Layer for business logic, shared type safety, robust security measures (input sanitization, prepared statements, CORS, rate limiting), and centralized error handling.
- **Core Features:** Students, Surveys, Academic Data, Student Support, Administrative Functions, and AI features (holistic-profile, standardized-profile, student-profile-ai, ai-assistant, **profile-sync**).

### Data Architecture
- **Database:** Normalized relational schema in `database.db` (root directory) for student profiles, behavior, attendance, surveys, counseling, and interventions.
- **Data Standardization:** Utilizes a comprehensive taxonomy (`shared/constants/student-profile-taxonomy.ts`) for consistent values across academic, social-emotional, and behavioral data, enabling deterministic AI analysis.

### AI and Analytics System
- **Living Student Profile (COMPLETE - October 2025):** AI-powered profile aggregation system that automatically updates student identity from all data sources.
    - **Auto-Sync Engine:** ✅ Automatic triggers when counseling sessions complete, surveys submitted, exam results added, behavior incidents recorded, meeting notes added, parent meetings recorded, self-assessments completed, and attendance recorded - profile instantly updates.
    - **AI Validation:** ✅ Gemini-powered data validation checks meaningfulness and realism before profile updates (scoring 0-100%).
    - **Intelligent Aggregation:** ✅ Combines data from multiple sources with conflict resolution and weighted domain scoring.
    - **Field Mapping System:** ✅ Intelligent mapping of AI-extracted insights to standardized database fields. AI can detect phrases like "doktor kontrolü yaptı" and automatically update the `lastHealthCheckup` field in health profile.
    - **Dual Update Strategy:** ✅ Updates BOTH the unified identity card AND specific profile fields (health, academic, social_emotional, talents_interests) ensuring complete data synchronization.
    - **Real-Time Dashboard:** ✅ "Who is this student?" - Live profile card showing identity summary, current state, scores, strengths/challenges, AI recommendations.
    - **Update Timeline:** ✅ Complete history of profile changes with AI reasoning, validation scores, and extracted insights.
    - **Manual Correction System:** ✅ UI and API for manually correcting AI extraction errors, complete correction history tracking, undo operations.
    - **Conflict Resolution UI:** ✅ Interactive panel for resolving data conflicts manually, bulk resolution support, severity-based prioritization.
    - **Class-Level Analytics:** ✅ Profile summaries by class, trend analysis over time, class comparison tools.
    - **Database Schema:** ✅ Unified identity table, sync logs, conflict tracking, AI corrections, undo operations, and processing queue for reliable updates.
    - **Frontend Integration:** ✅ Complete API client with all endpoints (profile-sync.api.ts), components integrated in ProfileDashboard.
    - **Auto-Sync Hooks:** ✅ All major data sources integrated (counseling sessions, surveys, exams, behavior, meetings, assessments, attendance).
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
- **Voice Transcription & AI Analysis:**
    - **Provider-Aware STT:** Automatic provider detection (Gemini audio API, OpenAI Whisper, browser Web Speech API fallback)
    - **Hybrid Architecture:** Real-time browser transcription + cloud API accuracy verification
    - **AI-Powered Analysis:** Auto-summary, keyword extraction, category detection, sentiment analysis, risk word flagging, emergency alerts
    - **Smart Integration:** Embedded in counseling session dialogs and student profile pages
    - **Error Handling:** Graceful fallbacks, browser compatibility checks, user-friendly error messages
- **Enhanced Text Input Features (October 2025):**
    - **EnhancedTextarea Component:** Unified text input component with integrated voice and AI capabilities
    - **Voice Input (🎤):** Real-time Turkish speech-to-text using Web Speech API, automatic text insertion, visual feedback
    - **AI Text Polish (✨):** Gemini-powered text enhancement with contextual processing (academic, counseling, notes, general)
    - **Universal Integration:** Replaced 50+ standard textarea fields across all forms (student profiles, counseling sessions, reports)
    - **Controlled Component Support:** Full React Hook Form compatibility with proper state synchronization
    - **Smart Context Detection:** aiContext prop enables contextual AI processing for different content types
    - **Accessibility:** Icon toolbar design, keyboard support, disabled state handling, ARIA labels

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