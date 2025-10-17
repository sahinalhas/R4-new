# Rehber360 - Student Guidance System

## Overview
Rehber360 is a comprehensive Turkish-language student guidance and management system for educational institutions. It provides tools for student tracking, counseling, risk assessment, behavioral monitoring, and academic performance analysis. A key feature is its AI-powered profile analysis, which generates standardized student profiles from diverse data sources. The system also includes an AI Assistant for local, AI-powered student counseling, supporting both OpenAI and Ollama (Llama 3.1) models. Built as a full-stack TypeScript application with React, Express.js, and SQLite, Rehber360 aims to drive data standardization and evidence-based interventions for student success.

## Recent Changes (October 17, 2025)
- **API Client Standardization & Data Fetching Refactor:** Comprehensive modernization of data fetching patterns across the codebase
  - **API Endpoints Constants:** Created centralized `client/lib/constants/api-endpoints.ts` with all API endpoint definitions, eliminating hardcoded URLs throughout the application
  - **API Client Migration:** Migrated all direct `fetch()` calls to use `apiClient` wrapper for consistent error handling, toast notifications, and request management
  - **Profile Sync API:** Refactored `client/lib/api/profile-sync.api.ts` to use `apiClient` and endpoint constants with proper Turkish error messages
  - **Advanced AI Analysis API:** Modernized `client/lib/api/advanced-ai-analysis.api.ts` with `apiClient`, success/error toasts, and endpoint constants
  - **AI Suggestions API:** Updated `client/lib/api/ai-suggestions.api.ts` to use `apiClient` with proper type safety and error handling
  - **Component Fetch Migration:** Migrated direct fetch calls in components (`AIStatusIndicator`, `ConflictResolutionPanel`, `SchoolWideAIInsights`) to use `apiClient`
  - **Survey Service Migration:** Refactored `client/services/surveyService.ts` to use `apiClient` and endpoint constants instead of raw fetch calls
  - **Benefits:** Consistent error handling, automatic toast notifications, better type safety, centralized timeout management, and easier debugging
  - All API calls now support proper Turkish error messages and user-friendly toast notifications

## Recent Changes (October 16, 2025)
- **AI Tools Page Modern Redesign:** Complete visual and UX overhaul to match design language of Settings and Student Profile pages
  - **Gradient Header:** Added modern gradient header (primary/accent) matching Settings page style
  - **Responsive Tab System:** Modernized tab list with flex-wrap, responsive design, bg-muted/50 background, and data-driven structure
  - **Consistent Icons & Labels:** Icon-based tabs with responsive text visibility (hidden on mobile, shown on larger screens)
  - **URL Behavior Update:** Tabs no longer update URL during manual navigation (per user request), but still support deep-links and redirects
  - **Deep-Link Support:** Initial tab selection honors URL parameters (e.g., `/ai-araclari?tab=ai-asistan`) for bookmarking and App.tsx redirects
  - **Architecture Approved:** Architect-verified implementation ensuring both manual tab switching and URL-based navigation work correctly
  - All AI tool components (RiskDashboard, AIAssistant, AIInsightsDashboard, AdvancedAIAnalysis, DailyActionPlan) remain fully functional with lazy loading
- **Student Profile Page Complete Reorganization:** Comprehensive restructuring following detailed analysis report (ogrenci_profil_analiz_raporu.md)
  - **New Tab Structure:** Reorganized from 6 to 9 main tabs - Dashboard, Kimlik & Temel Bilgiler, Akademik, Kişisel-Sosyal, Risk-Müdahale, Aile-İletişim, Mesleki, AI Tools, Sistem
  - **Unified Risk Section:** Consolidated 4 separate risk displays into single UnifiedRiskSection with unified scoring (useUnifiedRisk hook)
  - **Unified Meetings Section:** Merged parent meetings, individual counseling, group sessions into UnifiedMeetingsSection (useUnifiedMeetings hook)
  - **AI Tools Hub:** Centralized all AI features (intervention recommendations, auto reports, parent communication, voice notes) into dedicated AIToolsHub
  - **Simplified Dashboard:** Removed technical tools (manual correction, conflict resolution) - moved to dedicated "Sistem" tab
  - **Streamlined Guardian Information:** Removed redundant "Veli Bilgileri" subtab from Aile-İletişim section - all guardian/contact info consolidated in BasicInfoSection (Kişisel Bilgiler tab) with full editing capability
  - **Fixed Authentication:** Updated useUnifiedRisk and useUnifiedMeetings hooks to use apiClient instead of raw fetch for proper auth headers
  - **Backend Integration:** IlerlemeTakibiSection now uses coaching API (getAchievementsByStudent, addAchievement) instead of localStorage
  - **Survey System Integration:** AnketlerSection fully synchronized with main survey system API (survey-responses, survey-distributions) - counselors can view student surveys and fill surveys on behalf of students
  - **Removed Student Self-Assessment:** Eliminated "Günlük Değerlendirme" feature - system is counselor-operated, not student-facing
  - **Props Cleanup:** Removed redundant props from IlerlemeTakibiSection and AnketlerSection - components now fetch data directly from backend APIs
  - **Information Architecture:** Each piece of information appears only once, related items grouped logically, counselor-centric organization
  - **Aile & İletişim Tab:** Now focused on three core areas - Tüm Görüşmeler (unified meetings), Ev Ziyaretleri (home visits), Aile Katılımı (family participation)
  - All P0 priorities from analysis report completed: risk consolidation, meetings consolidation, dashboard simplification, guardian information unification, AI tools centralization, survey system integration

## Recent Changes (October 15, 2025)
- **Code Quality Refactoring - AI Components & Constants:** Comprehensive code quality improvements and standardization
  - **AI Utilities Centralization:** Created shared AI utility functions (`ai-utils.ts`) for consistent badge colors, priority labels, and status handling across all AI components
  - **AI Data Fetching Hook:** Implemented `useAIRecommendations` hook to eliminate duplicated React Query logic across AI widgets
  - **Null Safety Improvements:** Added robust null/undefined handling to all AI utility functions with fallback values ("Belirtilmemiş")
  - **Design System Compliance:** Updated all AI components (PriorityStudentsWidget, InterventionRecommendations, AISuggestionPanel) to use typed Badge variants instead of raw Tailwind classes
  - **Constants Migration:** Replaced magic strings with SESSION_MODES constants in SessionDetailsStep component
  - **Documentation:** Created comprehensive constants usage guide (`shared/constants/README.md`) with safety checklist, migration examples, and best practices
  - **Type Safety:** Fixed TypeScript return types for all utility functions to ensure design-system compliance
  - Architect-approved refactoring ensuring consistent AI component behavior and preventing UI breaks from unexpected backend data
- **AI Architecture Refactor - Guidance Assistant Model:** Complete architectural transformation from autonomous AI decision-maker to "Guidance Teacher Assistant" model
  - Implemented AI Suggestion Queue system with database schema, repository, and service layer
  - Refactored AutoSyncHooksService to generate suggestions instead of automatic profile updates
  - Updated AI system prompts to emphasize "Assistant" role - AI now provides recommendations requiring explicit user approval
  - Built comprehensive backend API infrastructure (/api/ai-suggestions) for suggestion management
  - Created AISuggestionPanel frontend component with approval workflow, diff visualization, and feedback system
  - Integrated suggestion panel into main dashboard for real-time suggestion visibility
  - All data sources (counseling, surveys, exams, behavior) now create suggestions with priority, confidence scores, and reasoning
  - User maintains full control - can approve, reject, or modify AI suggestions before application
- **Form State Synchronization Fix:** Fixed KisilikProfiliSection to properly sync form state with props using useEffect
  - Changed state type from string to number to prevent NaN values during save
  - Added null handling with ?? operator to preserve zero values while providing defaults
  - Fixed student switching behavior - form now correctly updates when navigating between students
- **Vite HMR Configuration:** Added REPLIT_DEV_DOMAIN to HMR host configuration for proper WebSocket connection in Replit environment

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Technology Stack:** React 18, TypeScript, Vite, Radix UI, Tailwind CSS, TanStack React Query, React Hook Form + Zod, React Router DOM, Framer Motion, Recharts.
- **Key Decisions:** Feature-based organization with lazy loading, global error boundaries, mobile-first and accessible design (WCAG AAA), React Query for server state, Context API for authentication, and various performance optimizations.
- **Error Handling:** 
  - Standardized system using `client/lib/utils/error-utils.ts` and `client/lib/constants/messages.constants.ts` for consistent error messages and handling
  - Defensive programming with optional chaining (`?.`) for all potentially undefined data from API responses
  - All pages implement proper null/undefined checks to prevent "Cannot read properties of undefined" errors

### Backend
- **Technology Stack:** Express.js v5, SQLite with `better-sqlite3`, TypeScript, Zod.
- **Key Decisions:** Modular architecture, Repository Pattern for data access, Service Layer for business logic, shared type safety, robust security measures (input sanitization, prepared statements, CORS, rate limiting), and centralized error handling.
- **Core Features:** Students, Surveys, Academic Data, Student Support, Administrative Functions, and AI features (holistic-profile, standardized-profile, student-profile-ai, ai-assistant, profile-sync).

### Data Architecture
- **Database:** Normalized relational schema in `database.db` for student profiles, behavior, attendance, surveys, counseling, and interventions.
- **Data Standardization:** Utilizes a comprehensive taxonomy (`shared/constants/student-profile-taxonomy.ts`) for consistent values across academic, social-emotional, and behavioral data, enabling deterministic AI analysis.

### AI and Analytics System
- **AI Suggestion Queue System (NEW):** User-approval-required AI recommendation system where AI acts as an assistant, not decision-maker. All profile updates, insights, and interventions are proposed as suggestions with reasoning, confidence scores, and priority levels. Users review, approve, reject, or modify suggestions through an intuitive dashboard panel. Includes feedback system to track AI suggestion quality over time.
- **Living Student Profile:** AI-powered profile aggregation system that analyzes data from all sources including counseling sessions, surveys, exams, behavior incidents, meetings, and attendance. Now generates suggestions for profile updates requiring user approval. Features AI validation, intelligent aggregation, field mapping, real-time dashboard, update timeline, and manual correction/conflict resolution UI.
- **AI Assistant:** A professional-grade virtual guidance counselor with deep psychological and pedagogical expertise. Features include pattern recognition, proactive insights, psychological depth analysis, evidence-based recommendations, contextual awareness, real-time streaming chat, quick-action analyses, and risk analysis. Supports OpenAI, Ollama, and Gemini models with runtime model selection.
- **Advanced AI Features:** Daily Insights Service, Psychological Depth Analysis, Predictive Risk Timeline, Hourly Action Planner, Student Timeline Analyzer, Comparative Multi-Student Analysis, Notification & Automation System, Deep Analysis Engine, Smart Recommendation Engine, Meeting Prep Assistant, AI Dashboard, Unified Scoring Engine (8 standardized scores), Deterministic Profile Analysis, Early Warning System, and Analytics Caching.
- **Voice Transcription & AI Analysis:** Provider-aware STT (Gemini, OpenAI Whisper, Web Speech API) with hybrid architecture for real-time transcription and cloud verification. AI-powered analysis for auto-summary, keyword extraction, sentiment analysis, and risk word flagging.
- **Enhanced Text Input Features:** `EnhancedTextarea` component with integrated voice input (Web Speech API) and Gemini-powered text enhancement for contextual processing.

### Authentication and Authorization
- **Role-Based Access Control (RBAC):** Four roles (Admin, Counselor, Teacher, Observer) with hierarchical permissions.
- **Security:** Password hashing (bcryptjs), session-based authentication, and permission guards.

### Build and Deployment
- **Build Process:** Two-stage build (client and server) using Vite.
- **Deployment Target:** Replit VM, running `dist/server/production.mjs` on port 3000.
- **Database:** File-based SQLite (`database.db` in root directory) with automatic backups and schema migrations.
- **Environment Variables:** Supports `GEMINI_API_KEY`, `OPENAI_API_KEY`, `ALLOWED_ORIGINS`, `PORT`, and Ollama-specific variables (`OLLAMA_BASE_URL`).

## External Dependencies

### Core Runtime
- **Frontend:** `react`, `react-router-dom`, `@tanstack/react-query`, `@tanstack/react-virtual`, Radix UI.
- **Backend:** `express`, `better-sqlite3`, `bcryptjs`, `cors`, `dotenv`.
- **Shared:** `zod`, `xlsx`, `jspdf`.

### Third-Party Services
- **Gemini API:** Primary AI provider (activates with `GEMINI_API_KEY`).
- **OpenAI API:** Optional integration for AI features (requires `OPENAI_API_KEY`).
- **Ollama:** Recommended for local, privacy-focused AI (automatic fallback when no cloud API keys are present).

### Database
- **SQLite Database:** `database.db` (root directory) using `better-sqlite3` driver.