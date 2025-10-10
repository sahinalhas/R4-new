# Rehber360 - Student Guidance System

## Overview
Rehber360 is a comprehensive Turkish-language student guidance and management system designed for educational institutions. It provides a modern, efficient platform for student tracking, counseling, and administrative tasks. Key features include automated intervention, smart topic planning, and detailed student profiles, aiming to enhance student support and administrative efficiency for educators. The system offers objective, data-driven student evaluation with automated profile creation and an AI-ready architecture for advanced analytics.

## User Preferences
I prefer simple language and clear, concise explanations. I want iterative development with frequent, small updates. Ask before making major architectural changes or introducing new external dependencies. Do not make changes to the folder `node_modules` and `dist`. Do not make changes to the file `replit.nix` and `.replit`.

## Recent Changes (October 2025)
- **Project Structure Reorganization**:
  - Created `data/` folder for all database files (`data.db`, `data.db-shm`, `data.db-wal`)
  - Created `docs/` folder for documentation (`takvim.txt`, `DEPLOYMENT.md`)
  - Database connection path updated to `data/data.db`
  - Package manager standardized to PNPM only (removed npm lock file)
  - Project name corrected to `rehber360`
  - Created comprehensive README.md
- **Type System Improvements**:
  - Moved shared types to `shared/types/` to eliminate duplication
  - Created `meeting-notes.types.ts` for common MeetingNote interface
  - Updated imports across client and server to use shared types
- **Migration Cleanup**:
  - Removed duplicate migration 005 (superseded by migration 007)

## System Architecture
The application uses a modern full-stack architecture, emphasizing modularity and maintainability, and is designed for Replit's autoscale deployment.

### UI/UX Decisions
The design features a premium, award-winning website aesthetic with:
- **Modern Color Palette**: Sophisticated purple tones (HSL 262 80% 45%) with WCAG AAA compliant contrast.
- **Glass Morphism**: Subtle backdrop-blur effects and layered shadows for depth.
- **Premium Typography**: Inter font with optimized tracking, leading, and font-feature-settings for enhanced readability.
- **Smooth Animations**: GPU-optimized transitions with prefers-reduced-motion support.
- **Responsive Spacing**: Golden ratio-based padding and container widths for balanced layouts.
- Frontend components are organized by feature following the Single Responsibility Principle.

### Technical Implementations
- **Frontend**: Built with React 18 and TypeScript using Vite, employing Radix UI, Tailwind CSS, and Framer Motion. Form management uses React Hook Form and Zod for type-safe validation. CVA is used for modular, type-safe style variants.
- **Backend**: Express.js handles API routes and serves the frontend, with a feature-based module structure for repositories, services, and routes.
- **Database**: SQLite is used for all data persistence. Database files are located in `data/` directory:
  - `data/data.db` - Main database file
  - `data/data.db-shm` - Shared memory file
  - `data/data.db-wal` - Write-Ahead Log file
  - Modular organization for schema, migrations, triggers, and indexes
- **Key Features**:
    - **Standardized Student Profiling**: An AI-ready 10-table system with a comprehensive taxonomy and quantifiable metrics (1-10 scales, JSON arrays). It covers academic, social-emotional, talents/interests, health, behavior, interventions, motivation, and risk/protective factors.
    - **Holistic Student Understanding**: Integrates strengths, interests, future vision, SEL competencies, and socioeconomic factors.
    - **Risk Assessment & Protective Factors**: Comprehensive risk analysis with automatic scoring and intervention recommendations.
    - **Automatic Intervention System**: Standardized intervention tracking with calendar integration, effectiveness metrics, and session progress tracking.
    - **Behavioral Tracking**: ABC model-based behavior incidents with categorized behaviors and intervention effectiveness.
    - **Data Management**: API endpoints with error handling, input sanitization, and structured logging.
    - **Performance Optimizations**: Lazy tab loading, virtual scrolling, progressive loading, data pagination, and server-side analytics with caching.

### System Design Choices
The system is configured for Replit's autoscale deployment, using `npm run build` for client and server, and `npm start` for the production server. Global error handling and production build optimizations are implemented for robustness and performance.

## External Dependencies
- **Vite**: Frontend build tool.
- **Express.js**: Backend web framework.
- **SQLite**: Database system.
- **React**: Frontend library.
- **TypeScript**: Programming language.
- **Radix UI**: Unstyled component library.
- **Tailwind CSS**: Utility-first CSS framework.
- **Framer Motion**: Animation library.
- **React Hook Form**: Form state management.
- **Zod**: Schema validation.
- **CVA**: Class variance authority.
- **@tanstack/react-virtual**: Virtual scrolling library.
- **PNPM**: Package manager.

## Project Structure
```
.
├── client/              # Frontend React application
│   ├── components/      # UI components (by feature)
│   ├── pages/          # Page components
│   ├── lib/            # API clients, utilities, types
│   └── hooks/          # Custom React hooks
├── server/             # Backend Express application
│   ├── features/       # Feature-based modules
│   │   └── [feature]/  # Each feature has: repository, services, routes
│   ├── lib/            # Database, middleware, utilities
│   └── services/       # Business logic services
├── shared/             # Shared code between client & server
│   ├── types/          # Common TypeScript interfaces
│   ├── constants/      # Shared constants
│   └── validation/     # Validation schemas
├── data/               # Database files (SQLite)
├── docs/               # Documentation
│   ├── takvim.txt      # Calendar system documentation
│   └── DEPLOYMENT.md   # Deployment guide
└── README.md           # Project overview
```