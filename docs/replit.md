# Rehber360 - Student Guidance System

## Overview

Rehber360 is a comprehensive Turkish-language student guidance and management system designed for educational institutions. The platform provides modern tools for student tracking, counseling, risk assessment, and academic monitoring. It features an AI-ready standardized profiling system, automatic intervention tracking, behavioral incident recording using the ABC model, and intelligent scheduling with topic-based planning. The system emphasizes data-driven decision making with server-side analytics and caching for optimal performance.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool for fast development and optimized production builds
- Radix UI for accessible, unstyled component primitives
- Tailwind CSS for utility-first styling with custom theme extensions
- Framer Motion for smooth, GPU-optimized animations
- React Hook Form with Zod for type-safe form validation
- TanStack React Query for server state management and caching

**Design System:**
- Premium, modern UI with purple accent colors (HSL 262 80% 45%)
- Glass morphism effects with backdrop-blur and layered shadows
- Inter font family with optimized typography settings
- Responsive spacing using golden ratio-based padding
- WCAG AAA compliant color contrast ratios
- Smooth transitions with prefers-reduced-motion support

**Component Organization:**
- Feature-based structure following Single Responsibility Principle
- Lazy-loaded route components for code-splitting
- Shared UI components in `/client/components/ui`
- Feature-specific components co-located with pages
- Error boundary implementation for graceful error handling

**State Management:**
- React Query for server state with 30s stale time
- Context API for authentication state
- Local state with hooks for UI interactions
- Optimized cache invalidation strategies

### Backend Architecture

**Technology Stack:**
- Express.js (v5.x) web framework
- SQLite database with better-sqlite3 driver
- TypeScript for type safety across the stack
- Modular feature-based architecture

**Feature-Based Structure:**
Each backend feature follows a standardized 4-layer architecture:
```
server/features/<feature-name>/
├── routes/       - Express route handlers and endpoint definitions
├── services/     - Business logic and orchestration
├── repository/   - Data access layer (SQL queries)
├── types/        - TypeScript interfaces and DTOs
└── index.ts      - Feature router export
```

**Core Features:**
- Students: Foundation for all student-related operations
- Surveys: Template-based survey system with distributions
- Progress: Academic progress tracking
- Subjects: Course and topic management
- Attendance: Attendance record management
- Study: Study session and planning
- Meeting Notes: Counseling session documentation
- Documents: File storage and management
- Coaching: Academic goal setting and tracking
- Exams: Examination records
- Sessions: Counseling session scheduling
- Health: Student health information
- Special Education: IEP and RAM report tracking
- Risk Assessment: Early warning system and alerts
- Behavior: ABC model-based incident tracking
- Counseling Sessions: Structured counseling workflow
- Analytics: Performance metrics and dashboards
- Auth: User authentication and authorization

**Security:**
- CORS configured for Replit deployment with fallback to dev origins
- Security headers (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection)
- Input sanitization with HTML entity encoding
- Zod schema validation for request bodies
- 10mb request size limit with parameter limiting

### Database Architecture

**SQLite Configuration:**
- Database location: `database.db` (root directory)
- Write-Ahead Logging (WAL) mode for concurrent reads
- Shared memory file: `database.db-shm`
- WAL file: `database.db-wal`

**Schema Organization:**
- Migration-based schema evolution
- Triggers for automatic timestamp updates
- Indexes for query optimization
- Modular table design per feature domain

**Key Tables:**
- Students: Core student information with unified data model
- Academic profiles: 10-table standardized profiling system
- Risk assessment: Historical risk scores and early warning alerts
- Behavior incidents: ABC model tracking
- Interventions: Structured intervention plans
- Survey system: Templates, distributions, questions, responses

**Data Model Philosophy:**
- AI-ready standardized taxonomy for consistency
- Quantifiable metrics (1-10 scales, percentages)
- JSON arrays for multi-select fields
- Comprehensive student understanding across 10 dimensions:
  1. Academic performance
  2. Social-emotional competencies
  3. Talents and interests
  4. Health information
  5. Motivation factors
  6. Risk and protective factors
  7. Behavioral patterns
  8. Family involvement
  9. Future vision
  10. Socioeconomic context

### Analytics & Performance

**Caching Strategy:**
- Multi-level caching: memory cache + background processing
- Default TTL: 5 minutes for analytics data
- Memoization for expensive calculations
- Cache invalidation on data mutations
- Performance monitoring with execution time tracking

**Background Processing:**
- Scheduled analytics recalculation
- Auto-backup system for database
- Cleanup of old cache entries
- Risk score history tracking

**Export Capabilities:**
- Excel export with XLSX library
- PDF generation with jsPDF
- Configurable data anonymization
- Role-based export permissions

## External Dependencies

### Core Runtime Dependencies
- **better-sqlite3**: Native SQLite driver for high-performance database operations
- **express**: Web application framework (v5.x)
- **cors**: CORS middleware for cross-origin requests
- **bcryptjs**: Password hashing for authentication
- **zod**: Runtime type validation and schema definition
- **dotenv**: Environment variable management

### Frontend Libraries
- **react** & **react-dom**: UI framework (v18)
- **react-router-dom**: Client-side routing
- **@tanstack/react-query**: Server state management
- **@tanstack/react-virtual**: Virtual scrolling for large lists
- **react-hook-form**: Form state management
- **@hookform/resolvers**: Zod integration for forms
- **framer-motion**: Animation library
- **recharts**: Data visualization
- **lucide-react**: Icon library
- **date-fns**: Date manipulation utilities

### UI Components
- **@radix-ui/react-*****: Accessible component primitives (dialog, dropdown, select, tabs, toast, etc.)
- **tailwindcss**: Utility-first CSS framework
- **tailwind-merge**: Tailwind class merging utility
- **clsx**: Conditional className utility
- **class-variance-authority**: Component variant management

### File Processing
- **xlsx**: Excel file generation and parsing (SheetJS CDN version)
- **jspdf**: PDF generation for reports

### Development Tools
- **typescript**: Type safety across the stack
- **vite**: Build tool and dev server
- **@vitejs/plugin-react-swc**: React plugin with SWC compiler
- **eslint**: Code linting
- **prettier**: Code formatting
- **vitest**: Unit testing framework

### Deployment
- **serverless-http**: Adapter for serverless deployment (if needed)
- Configured for Replit VM deployment with persistent database
- Build outputs to `dist/spa` (frontend) and `dist/server` (backend)
- Production optimizations: minification, tree shaking, CSS code splitting

### Database
- **SQLite** (file-based): No external database service required
- Database files stored in root directory (`database.db`)
- Automatic migrations on startup
- Scheduled backups with configurable frequency