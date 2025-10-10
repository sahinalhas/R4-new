# Rehber360 - Student Guidance System

## Overview

Rehber360 is a comprehensive Turkish-language student guidance and management system designed for educational institutions. The platform provides modern tools for student tracking, counseling, risk assessment, behavioral monitoring, and academic performance analysis. It features an AI-powered profile analysis system that generates standardized, measurable student profiles based on multiple data sources including academic records, attendance, behavioral incidents, surveys, and social-emotional assessments.

The system is built as a full-stack TypeScript application with a React frontend and Express.js backend, using SQLite for data persistence. It emphasizes data standardization, deterministic scoring, and evidence-based interventions to support student success.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- **React 18** with TypeScript for type-safe component development
- **Vite** as the build tool providing fast HMR and optimized production builds
- **Radix UI** component library for accessible, unstyled primitives
- **Tailwind CSS** with custom theme extensions (purple primary: HSL 262 80% 45%)
- **TanStack React Query** for server state management with 30-second stale time
- **React Hook Form + Zod** for type-safe form validation
- **React Router DOM** for client-side routing with lazy-loaded pages
- **Framer Motion** for animations
- **Recharts** for data visualization

**Architecture Decisions:**
- **Feature-based organization**: Components are co-located with their pages for better maintainability
- **Lazy loading**: Route components are lazy-loaded to optimize initial bundle size
- **Code splitting**: Manual chunks configured for vendor libraries (React, UI components, charts)
- **Error boundaries**: Global error handling with graceful degradation
- **Responsive design**: Mobile-first approach with breakpoint-based layouts
- **Accessibility**: WCAG AAA compliant color contrast ratios

**State Management:**
- React Query for server state with automatic cache invalidation
- Context API for authentication state
- Local component state with React hooks
- No global client-side state management (Redux/Zustand) to reduce complexity

**Performance Optimizations:**
- Memoization utilities for expensive calculations (`lib/analytics-cache.ts`)
- Background processing for analytics calculations
- Chart data point limiting (max 100 points) to prevent render slowdowns
- Virtual scrolling for large student lists using `@tanstack/react-virtual`
- Asset optimization with separate chunks for images, fonts, and JavaScript

### Backend Architecture

**Technology Stack:**
- **Express.js v5** web framework
- **SQLite** database with `better-sqlite3` driver (synchronous API)
- **TypeScript** for type safety across the entire stack
- **Zod** for runtime type validation and sanitization

**Feature-Based Modular Architecture:**

The backend follows a strict feature-based modular structure located in `server/features/`. Each feature module contains:

```
server/features/<feature-name>/
├── routes/          # Express route handlers and endpoint definitions
├── services/        # Business logic and orchestration
├── repository/      # Data access layer (database operations)
├── types/           # TypeScript type definitions
└── index.ts         # Feature router export
```

**Completed Feature Modules:**
- **Core Domains**: students, surveys, progress, subjects
- **Academic Data**: coaching, exams, sessions, attendance, study
- **Student Support**: health, special-education, risk-assessment, behavior
- **Administrative**: settings, meeting-notes, documents
- **Cross-cutting**: counseling-sessions, auth, users, analytics, early-warning
- **AI Features**: holistic-profile, standardized-profile, student-profile-ai

**Key Architectural Decisions:**

1. **Database Layer**: SQLite chosen for simplicity and zero-configuration deployment. All database operations use prepared statements for security and performance.

2. **Repository Pattern**: Data access is isolated in repository classes that return DTOs, preventing business logic from directly touching the database.

3. **Service Layer**: Business logic, validation, and orchestration between multiple repositories happens in service classes.

4. **Type Safety**: Shared types between client and server (`shared/types/`) ensure consistent data structures. Type conversion utilities handle frontend ↔ backend transformations.

5. **Security**:
   - Input sanitization middleware strips XSS attack vectors
   - Prepared statements prevent SQL injection
   - CORS configuration with origin validation
   - Security headers (X-Content-Type-Options, X-Frame-Options, etc.)
   - Rate limiting on sensitive endpoints

6. **Error Handling**:
   - Centralized error messages in `server/constants/errors.ts`
   - Structured error responses with appropriate HTTP status codes
   - Development vs. production error detail levels

### Data Architecture

**Database Schema Design:**

The SQLite database (`data/data.db`) uses a normalized relational schema with these key tables:

- **students**: Core student information
- **academic_profile**: Standardized academic assessments
- **social_emotional_profile**: Social-emotional competency data
- **talents_interests_profile**: Student strengths and interests
- **standardized_health_profile**: Health and wellness information
- **motivation_profile**: Intrinsic/extrinsic motivation factors
- **risk_protective_profile**: Risk assessment and protective factors
- **behavior_incidents**: ABC model behavioral event tracking
- **attendance_records**: Attendance tracking with excuse codes
- **survey_templates**, **survey_distributions**, **survey_responses**: Complete survey system
- **counseling_sessions**: Individual and group counseling tracking
- **interventions**: Intervention planning and follow-up

**Data Standardization:**

The system uses a comprehensive taxonomy (`shared/constants/student-profile-taxonomy.ts`) with 394 lines of standardized values for:
- Academic subjects and skills (19 subjects, 15 core skills)
- Social-emotional competencies (15 social skills, 12 emotional regulation skills)
- Behavioral categories (12 types)
- Risk factors (25 categories) and protective factors (18 categories)
- Learning styles, interests, career aspirations

This taxonomy ensures that AI analysis is deterministic—the same data always produces the same profile analysis.

### AI and Analytics System

**Unified Scoring Engine** (`server/services/unified-scoring-engine.service.ts`):

Calculates 8 standardized scores (0-100 scale) for each student:
1. Academic Performance Score
2. Social-Emotional Competency Score
3. Behavioral Risk Score
4. Attendance Consistency Score
5. Motivation Level Score
6. Health & Wellness Score
7. Overall Risk Score
8. Protective Factors Score

**Deterministic Profile Analysis:**

The AI Profile Analyzer (`server/services/ai-profile-analyzer.service.ts`) uses fixed prompts with OpenAI to generate:
- Strengths and areas for growth across all dimensions
- Risk level classification (DÜŞÜK/ORTA/YÜKSEK/ÇOK_YÜKSEK)
- Evidence-based intervention recommendations
- Priority action items

The system is designed to be deterministic—same input data produces consistent analysis results by using structured prompts and temperature=0.

**Early Warning System:**

Risk assessment pipeline:
1. Calculate aggregate scores from multiple data sources
2. Apply weighted risk thresholds
3. Generate alerts with priority levels (DÜŞÜK/ORTA/YÜKSEK/KRİTİK)
4. Recommend evidence-based interventions
5. Track intervention outcomes

**Analytics Caching:**

Performance optimizations in `client/lib/analytics-cache.ts`:
- In-memory caching with configurable TTL (30s default, 5min for expensive calculations)
- Background processing for heavy calculations
- Memoization of pure functions
- Chart data optimization (limit to 100 data points)

### Authentication and Authorization

**Role-Based Access Control (RBAC):**

Four user roles with hierarchical permissions:
1. **Admin**: Full system access, exports, sensitive data viewing
2. **Counselor**: Full analytics, interventions, student details
3. **Teacher**: Limited to their own students and classes
4. **Observer**: Read-only access to aggregate reports

Permission system defined in `client/lib/auth-context.tsx` with granular permissions like:
- `view_all_analytics`, `export_all_data`, `manage_interventions`
- `view_predictive_analysis`, `view_sensitive_data`

**Security Implementation:**
- Password hashing with bcryptjs
- Session-based authentication (not implemented in current code, uses context)
- Permission guards on sensitive routes and components

### Build and Deployment

**Build Process:**

Two-stage build configured in `package.json`:
1. **Client Build** (`npm run build:client`): Vite bundles React app to `dist/spa/`
2. **Server Build** (`npm run build:server`): Vite bundles Express app to `dist/server/`

**Production Optimizations:**
- esbuild minification for fast compilation
- CSS code splitting and minification
- Manual vendor chunking for better caching
- Asset hashing for cache busting
- Static file serving from built SPA directory

**Deployment Target:**

Configured for Replit VM deployment:
- **Build Command**: `npm run build`
- **Run Command**: `npm start` (runs `dist/server/production.mjs`)
- **Port**: 3000 (or from `process.env.PORT`)
- **Database**: File-based SQLite (`data/data.db`) with automatic backups

**Environment Configuration:**

Minimal environment variables required:
- Optional: `OPENAI_API_KEY` for AI profile analysis
- Optional: `ALLOWED_ORIGINS` for production CORS
- Optional: `PORT` for custom port (defaults to 3000)

## External Dependencies

### Core Runtime Dependencies

**Frontend Libraries:**
- `react`, `react-dom` (v18): UI framework
- `react-router-dom`: Client-side routing
- `@tanstack/react-query`: Server state management
- `@tanstack/react-virtual`: Virtual scrolling for large lists
- Radix UI components (`@radix-ui/react-*`): 25+ accessible component primitives

**Backend Libraries:**
- `express` (v5.1.0): Web server framework
- `better-sqlite3` (v12.4.1): Synchronous SQLite driver
- `bcryptjs`: Password hashing
- `cors`: CORS middleware
- `dotenv`: Environment variable loading

**Shared Libraries:**
- `zod` (v3.25.76): Schema validation and type inference
- `xlsx`: Excel file generation and parsing (from CDN)
- `jspdf` (v3.0.3): PDF generation for reports

### Build Tools

- `vite` (v6.x): Build tool and dev server
- `@vitejs/plugin-react-swc`: Fast React refresh with SWC
- `typescript` (v5.x): Type checking
- `tailwindcss`: Utility-first CSS framework
- `postcss`, `autoprefixer`: CSS processing
- `eslint`, `prettier`: Code quality tools

### Third-Party Services

**Optional Integrations:**

1. **OpenAI API** (not required for core functionality):
   - Used for AI-powered profile analysis
   - Generates natural language insights from structured data
   - Requires `OPENAI_API_KEY` environment variable

2. **MEB Integration** (configurable, not implemented):
   - Placeholder for Turkish Ministry of Education system integration
   - Settings stored in database but not actively used

3. **e-Okul API** (configurable, not implemented):
   - Placeholder for school management system integration
   - Settings stored in database but not actively used

### Database

**SQLite Database:**
- **Driver**: `better-sqlite3` (synchronous, no async/await overhead)
- **Location**: `data/data.db` (file-based, no external database server needed)
- **Migrations**: Automatic schema migrations on startup
- **Backups**: Scheduled automatic backups to `data/backups/`
- **Triggers**: Database triggers for updated_at timestamps

**Schema Management:**
- Migrations defined in `server/lib/database/migrations/`
- Auto-migration on server startup checks version table
- Prepared statements cached for performance

### Development Tools

- **Vitest**: Unit testing framework
- **ESLint**: Linting with TypeScript, React, and React Hooks plugins
- **Prettier**: Code formatting
- **TypeScript**: Type checking with strict mode

### Asset Management

- **Fonts**: Inter font family from Google Fonts CDN
- **Icons**: Lucide React icon library (tree-shakeable)
- **Charts**: Recharts for data visualization

All dependencies are pinned to specific versions in `package.json` to ensure reproducible builds.