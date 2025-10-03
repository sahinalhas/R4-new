# Rehber360 - Student Guidance System

## Overview
Rehber360 is a comprehensive Turkish-language student guidance and management system. It aims to provide a modern, elegant, and efficient platform for student tracking, counseling, and administrative tasks. The project's ambition is to offer a sophisticated educational application with features like automated intervention, smart topic planning, and detailed student profiles, serving as a vital tool for educational institutions.

## User Preferences
I prefer simple language and clear, concise explanations. I want iterative development with frequent, small updates. Ask before making major architectural changes or introducing new external dependencies. Do not make changes to the folder `node_modules` and `dist`. Do not make changes to the file `replit.nix` and `.replit`.

## System Architecture
The application uses a modern full-stack architecture:
- **Frontend**: React 18 with TypeScript, built using Vite. UI components are styled with Radix UI, Tailwind CSS, and Framer Motion for animations.
- **Backend**: Express.js handles API routes and serves the frontend.
- **Database**: SQLite (`data.db`) is used for all data persistence, replacing prior localStorage usage. The database includes comprehensive tables for student information, counseling features, interventions, schedules, and topic tracking.
- **UI/UX Decisions**: The design emphasizes a modern, responsive interface with a refined, light purple color palette ("hafif bir esinti"). Key UI elements include gradient headers, icon-based statistics cards, modern table designs with hover effects, and enhanced form/dialog components for improved user experience.
- **Technical Implementations**: Features include an automatic intervention system for high-risk students, a sophisticated calendar with template scheduling and Ebbinghaus forgetting curve-based spaced repetition, and robust student tracking (health info, special education, risk factors, behavior, exam results). Data persistence is managed via API endpoints, with comprehensive error handling, input sanitization, and database indexing for performance.
- **Deployment**: Configured for Replit's autoscale deployment, with `npm run build` for client and server, and `npm start` to run the production server.

## External Dependencies
- **Vite**: Frontend build tool.
- **Express.js**: Backend web framework.
- **SQLite**: Database system for data storage.
- **React**: Frontend library.
- **TypeScript**: Superset of JavaScript for type safety.
- **Radix UI**: Unstyled component library.
- **Tailwind CSS**: Utility-first CSS framework.
- **Framer Motion**: Animation library for React.
- **NPM**: Package manager.

## Component Structure
**Component Organization Strategy**:
- Centralized component structure in `client/components/` with organized subfolders
- Each feature has its own folder: `counseling/`, `settings/`, `shared/`, `student-profile/`
- Components follow Single Responsibility Principle (SRP) for better maintainability
- Types, utilities, and helpers separated into dedicated files
- Form components extracted for reusability

**Counseling Components** (`client/components/counseling/`):
- **Display Components**: SessionCard, ActiveSessionsGrid, CompletedSessionsList, SessionsTable
- **Form Components**: IndividualSessionForm, GroupSessionForm
- **Dialog Components**: NewSessionDialog, CompleteSessionDialog
- **Utilities**: types.ts, sessionHelpers.ts, sessionExport.ts
- Main page reduced from 1,419 lines to 351 lines (75% reduction)

**Settings Components** (`client/components/settings/`):
- **Tab Components**: GeneralSettingsTab, NotificationsSettingsTab, DataSettingsTab, IntegrationsSettingsTab, CoursesSettingsTab, PresentationSettingsTab, ClassHoursSettingsTab, SecuritySettingsTab, TransferSettingsTab
- **Shared Editors**: ClassPeriodsEditor, PresentationSystemEditor
- Main page reduced from 870 lines to 280 lines (68% reduction)
- Each tab encapsulates its own UI logic while sharing form state

## Backend Architecture
**Feature-Based Modular Structure** (October 3, 2025 - Migration Complete ✅):
- Backend routes successfully migrated from flat structure to feature-based modules
- Each feature has: repository/ (data access), services/ (business logic), routes/ (handlers), index.ts (router)
- All 5 stages completed: Stage 0 (scaffolding) ✅, Stage 1 (core domains) ✅, Stage 2 (adjacent domains) ✅, Stage 3 (peripheral routers) ✅, Stage 4 (cleanup) ✅
- **Shared Types** (October 3, 2025): Common types (HealthInfo, RiskFactors, SpecialEducation) consolidated in `shared/types.ts` to eliminate duplication between client and server

**Migrated Features** (server/features/):
- **Core Domains**: students, surveys, progress
- **Adjacent Domains**: subjects, settings, attendance, study, meeting-notes, documents
- **Peripheral Features**: coaching, exams, sessions, health, special-education, risk-assessment, behavior, counseling-sessions, auth
- Total: 18 features successfully migrated to modular architecture

**Benefits**:
- Clear separation of concerns (routes ← services ← repository)
- Improved maintainability and testability
- Reduced coupling between domains
- Clean codebase with no legacy route duplication
- Backward compatibility maintained with existing URL patterns

## Recent Changes
**October 3, 2025** - Additional modularization improvements ✅
- **Coaching Routes Modularized**: Split coaching routes into 4 logical modules (goals, assessments, family, achievements) with independent rate limiting per route
- **Surveys Routes Modularized**: Split surveys routes into 5 modules (templates, questions, distributions, responses, analytics) with proper separation of concerns
- **Surveys Service Modularized**: Refactored surveys service (390 lines) into 6 focused modules: templates, questions, distributions, responses, validation, and analytics. Helper functions kept private as designed
- **Student Profile Data Fetching Extracted**: Created `client/lib/api/student-profile.api.ts` to centralize student profile data aggregation. Moved 21 API call orchestration from React hook to dedicated API module. Hook reduced from 110+ lines to ~30 lines, improving separation of concerns and testability

**October 3, 2025** - Final cleanup: Removed demo route and empty directories ✅
- Deleted obsolete demo route file (server/routes/demo.ts)
- Removed demo route import and usage from server/index.ts
- Removed unused DemoResponse interface from shared/api.ts
- Deleted empty server/routes/ directory (no longer needed with feature-based architecture)
- Verified all changes with no regressions - dev server running successfully

**October 3, 2025** - Code cleanup and consolidation ✅
- Eliminated duplicate type definitions across codebase
- Created `shared/types.ts` for common types (HealthInfo, RiskFactors, SpecialEducation)
- Removed 3 duplicate type directories from server/features/ (health, risk-assessment, special-education)
- Removed duplicate `client/lib/types/risk.types.ts` file
- Cleaned up `client/lib/types/academic.types.ts` (removed HealthInfo, SpecialEducation)
- Removed unnecessary `client/components/ui/use-toast.ts` wrapper file
- Updated all import references to use shared types
- All changes validated with LSP - no errors
- Improved code maintainability and reduced duplication

**October 3, 2025** - Backend modularization: Stage 4 Complete - Migration Finished! ✅
- Removed all legacy route imports and registrations from server/index.ts (~150 lines cleaned)
- Deleted 19 old route files from server/routes/
- Fixed surveys feature URL structure to maintain backward compatibility (/survey-templates, /survey-distributions, etc.)
- Verified all API endpoints working correctly (students, surveys, progress, settings, etc.)
- Confirmed frontend dashboard loads successfully with no errors
- Backend now runs entirely on modular feature-based architecture
- Clean, maintainable codebase ready for future development

**October 3, 2025** - Backend modularization: Stage 1 Complete (Core Domains)
- Created feature-based architecture in server/features/
- Migrated 3 core domains to new structure: students, surveys, progress
- Extracted 1,178 lines of route code into modular components
- Database operations moved from monolithic db-service.ts to domain repositories
- Feature registry system implemented for clean router mounting
- All APIs maintain backward compatibility
- Zero breaking changes - legacy routes still functional during migration

**October 3, 2025** - Major refactoring: Settings.tsx modularization
- Refactored Settings.tsx from 870 lines to 280 lines (68% reduction)
- Created 9 focused tab components in `client/components/settings/`
- Each tab (General, Notifications, Data, Integrations, Courses, Presentation, ClassHours, Security, Transfer) is now a separate component
- Main Settings page now handles only form lifecycle, routing sync, and theme side effects
- All tabs share form state via react-hook-form for consistent data management
- Preserved all existing functionality including save/reset/import/export
- LSP validation passed - no TypeScript errors
- Application tested and working correctly

**October 3, 2025** - Major refactoring: CounselingSessions modularization
- Refactored CounselingSessions.tsx from 1,419 lines to 351 lines (75% reduction)
- Created 11 focused, reusable components in `client/components/counseling/`
- Extracted types, schemas (Zod), and helper utilities into separate files
- Improved code maintainability with Single Responsibility Principle
- All functionality preserved - no breaking changes
- LSP validation passed - no type errors
- Application tested and working correctly

**October 2, 2025** - Project imported and configured for Replit environment
- Installed all npm dependencies
- Configured workflow: "Dev Server" running `npm run dev` on port 5000
- Set up deployment configuration for Replit autoscale deployment
- Verified application is working correctly with dashboard loading properly
- Vite dev server configured with host 0.0.0.0 and allowedHosts: true for Replit proxy compatibility