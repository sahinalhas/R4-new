# Rehber360 - Student Guidance System

## Overview
Rehber360 is a comprehensive Turkish-language student guidance and management system designed for educational institutions. It provides a modern, elegant, and efficient platform for student tracking, counseling, and administrative tasks. Key capabilities include automated intervention, smart topic planning, and detailed student profiles, aiming to be a vital tool for educators.

## User Preferences
I prefer simple language and clear, concise explanations. I want iterative development with frequent, small updates. Ask before making major architectural changes or introducing new external dependencies. Do not make changes to the folder `node_modules` and `dist`. Do not make changes to the file `replit.nix` and `.replit`.

## System Architecture
The application employs a modern full-stack architecture with a focus on modularity and maintainability.

- **UI/UX Decisions**: The design emphasizes a modern, responsive interface using a light purple color palette. Key UI elements include gradient headers, icon-based statistics cards, modern table designs, and enhanced form/dialog components for improved user experience. Frontend components are organized by feature, adhering to the Single Responsibility Principle.
- **Technical Implementations**:
    - **Frontend**: React 18 with TypeScript, built using Vite. Radix UI, Tailwind CSS, and Framer Motion are used for styling and animations.
    - **Backend**: Express.js handles API routes, serving the frontend, and is structured with feature-based modules (repository, services, routes). Common types are shared between client and server.
    - **Database**: SQLite (`data.db`) is used for all data persistence. The database schema, migrations, triggers, and indexes are modularly organized.
    - **Key Features**: Includes an automatic intervention system for high-risk students, a sophisticated calendar with template scheduling and Ebbinghaus forgetting curve-based spaced repetition, and robust student tracking (health info, special education, risk factors, behavior, exam results). Data persistence is managed via API endpoints with error handling, input sanitization, and database indexing.
    - **Form Management**: Modern form management utilizes React Hook Form and Zod validation for type-safe and user-friendly input. All student profile sections use controlled forms with proper state management.
    - **Component Patterns**: CVA (class-variance-authority) is used for modular, type-safe style variants. Form components follow React Hook Form patterns with proper validation, error handling, and user feedback via toast notifications.
- **System Design Choices**: The system is configured for Replit's autoscale deployment, with `npm run build` for client and server, and `npm start` for the production server.

## Recent Changes (October 2025)
- **Turkish Character Support for Excel/CSV (October 6, 2025)**: Enhanced all Excel and CSV import/export operations with proper UTF-8 encoding:
  - **Excel Import**: Added `codepage: 65001` (UTF-8) to all `XLSX.read()` operations for proper Turkish character support
  - **Excel Export**: Added `codepage: 65001` and `bookSST: true` to all `XLSX.write()` and `XLSX.writeFile()` operations
  - **CSV Import**: Already had UTF-8 and Windows-1254 fallback support, enhanced with `raw: false` option
  - **Files Updated**: 
    - `client/components/shared/ExcelLoader.tsx`: YKS subject/topic loader
    - `client/lib/excel-template-generator.ts`: Survey template generator and parser
    - `client/components/counseling/utils/sessionExport.ts`: Counseling session export
    - `client/pages/Students.tsx`: Student data import
  - **Database**: Already configured with `pragma('encoding = "UTF-8")` in connection.ts
  - **Benefits**: Turkish characters (ç, ğ, ı, ö, ş, ü, Ç, Ğ, İ, Ö, Ş, Ü) now display correctly in all Excel/CSV operations without encoding errors
- **Removed Lazy Loading for Instant Navigation (October 5, 2025)**: Eliminated all lazy loading to achieve instant page transitions:
  - **All Pages Eagerly Loaded**: Converted all lazy imports to normal imports in `client/App.tsx` - all page components now load with initial bundle
  - **Removed Suspense Boundaries**: Eliminated all Suspense wrappers since pages are no longer lazy-loaded
  - **Trade-off**: Larger initial bundle size but instant navigation between pages with zero loading delays
  - **Benefits**: Pages switch instantly without any loading indicators, improved perceived performance for navigation-heavy workflows
- **Production Deployment & Database Optimization (October 5, 2025)**: Completed production deployment readiness:
  - **Database Index Fixes**: Systematically fixed all column name mismatches in `server/lib/database/indexes.ts`:
    - Updated students table indexes: `sinif`→`className`, `cinsiyet`→`gender`
    - Fixed date column references: `meetingDate`, `visitDate`, `startTime`, `created_at`
    - Removed invalid `smart_goals.targetDate` index (column doesn't exist)
  - **Production Build Optimizations**: Enhanced `vite.config.ts` with:
    - esbuild minification for fast code compression
    - CSS code splitting for better caching
    - Tree shaking to remove unused code
    - Asset compression reporting (gzip/brotli)
  - **React Query Configuration**: Optimized for data freshness:
    - `staleTime: 0` for always-fresh data
    - `refetchOnWindowFocus: true` for tab switching
    - `refetchOnReconnect: true` for network recovery
  - **Global Error Handling**: Added comprehensive error handling in `client/lib/error-handler.ts`:
    - Uncaught exception handler with structured logging
    - Promise rejection handler
    - User-facing error toast notifications
  - **Deployment Configuration**: Configured for Replit VM deployment:
    - Build: `npm run build` (client + server)
    - Run: `npm start` for production server
    - Created `DEPLOYMENT.md` with comprehensive deployment guide
  - **Benefits**: Production-ready deployment, optimized performance, robust error handling, systematic database integrity
- **Major Code Refactoring - Modular Architecture (October 4, 2025)**: Comprehensive refactoring to improve code maintainability, modularity, and follow SOLID principles:
  - **CORS & Security**: Extracted CORS configuration to modular helpers (`server/middleware/cors-config.ts`, `server/middleware/security-headers.ts`)
  - **API Interceptor Pattern**: Implemented interceptor pattern for centralized request/response handling (`client/lib/api/api-interceptors.ts`)
  - **Repository Helpers**: Created reusable SQL helper utilities for database operations (`server/lib/database/repository-helpers.ts`)
  - **Cache Architecture**: Refactored analytics cache into separate responsibilities:
    - `client/lib/cache/cache-manager.ts`: Pure caching logic
    - `client/lib/cache/task-manager.ts`: Task execution and coordination
    - `client/lib/cache/background-processor.ts`: Background processing orchestration
  - **React Query Integration**: Created React Query hooks for Students API (`client/lib/api/students-query-hooks.ts`) for modern data fetching
  - **UI Labels Modularization**: Organized UI labels into feature-based modules:
    - `client/constants/labels/common.labels.ts`: Common actions
    - `client/constants/labels/navigation.labels.ts`: Navigation items
    - `client/constants/labels/student.labels.ts`: Student information
    - `client/constants/labels/academic.labels.ts`: Academic content
    - `client/constants/labels/status.labels.ts`: Status values
    - `client/constants/labels/time.labels.ts`: Time-related labels
  - **Centralized UI Variants**: Created shared variant style system (`client/lib/ui/variant-styles.ts`) for consistent component styling
  - **Benefits**: Improved code organization, reduced duplication, better separation of concerns, enhanced maintainability


- **API Layer Refactoring (Complete)**: All API modules refactored for maximum consistency and maintainability:
  - **Generic API Client**: Created `client/lib/api/api-client.ts` with `createApiHandler` utility for centralized fetch/error handling
  - **Centralized Constants**: Established 4 dedicated constant files:
    - `analytics.constants.ts`: Risk thresholds, weights, defaults
    - `cache.constants.ts`: Cache TTL, limits, chart optimization
    - `session.constants.ts`: Session durations, time conversions, colors
    - `messages.constants.ts`: All API error/success messages (70+ messages)
  - **API Migration**: 10 API modules migrated to generic client pattern:
    - academic.api.ts, attendance.api.ts, coaching.api.ts (14 functions)
    - documents.api.ts, family.api.ts (9 functions), notes.api.ts
    - study.api.ts (preserving caching), survey.api.ts
    - risk.api.ts, students.api.ts
  - **Analytics Update**: Analytics and analytics-cache modules use extracted constants instead of magic numbers
  - **Feature Registry**: Server features reorganized into domain-based groups (Core, Academic, Student Support, Communication, System)
  - **Benefits**: Eliminated code duplication, consistent error handling, centralized toast messaging, future i18n support ready
- **Comprehensive Form Refactoring**: All student profile sections refactored to use React Hook Form + Zod validation:
  - BasicInfoSection, SaglikBilgileriSection, OzelEgitimSection, DavranisTakibiSection
  - EvZiyaretleriSection, RiskDegerlendirmeSection
  - AileKatilimiSection, VeliGorusmeleriSection
  - SinavSonuclariSection (from manual DOM manipulation to RHF)
  - MudahalelerSection, HedeflerPlanlamaSection, GorusmelerSection (from useState to RHF)
  - This improves state management, validation, maintainability, and user experience with proper error handling and toast notifications.
- **Centralized Theme Configuration**: Created `client/lib/config/theme.config.ts` for centralized color management:
  - CHART_COLORS: Primary chart colors for analytics
  - RISK_COLORS: Risk level color mapping (hex values)
  - RISK_BADGE_COLORS: Risk badge Tailwind classes
  - MASTERY_COLORS: Topic mastery level colors
  - DIFFICULTY_COLORS: Difficulty level colors
  - STATUS_SURFACE_COLORS: Surface colors for success/error/neutral states
  - STATUS_BAR_COLORS: Progress bar colors (success/warning/danger)
  - PERFORMANCE_COLORS: Performance visualization colors
  - All analytics components (AnalyticsCharts, ProgressCharts, EarlyWarningSystem, PredictiveAnalysis, ComparativeReports) now use centralized theme
  - Eliminated all hardcoded colors in analytics components for better maintainability
- **Style Modularization**: RiskPill component refactored to use CVA for type-safe, maintainable style variants instead of hardcoded string comparisons.
- **Type Safety**: All form schemas use Zod with proper enum types for fields like cinsiyet ("K" | "E") and risk levels ("Düşük" | "Orta" | "Yüksek").

## External Dependencies
- **Vite**: Frontend build tool.
- **Express.js**: Backend web framework.
- **SQLite**: Database system for data storage.
- **React**: Frontend library.
- **TypeScript**: Superset of JavaScript.
- **Radix UI**: Unstyled component library.
- **Tailwind CSS**: Utility-first CSS framework.
- **Framer Motion**: Animation library for React.
- **React Hook Form**: Form state management.
- **Zod**: Schema validation.
- **CVA**: Class variance authority for style variants.
- **NPM**: Package manager.
