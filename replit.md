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

## Recent Changes
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