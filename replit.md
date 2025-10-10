# Rehber360 - Student Guidance & Management System

## Overview

Rehber360 is a comprehensive Turkish-language student guidance and management platform designed for educational institutions. The system provides modern tools for student tracking, counseling sessions, risk assessment, academic performance monitoring, and administrative tasks. It features an automated intervention system, intelligent topic planning, detailed student profiles, and robust analytics capabilities.

The application is built as a full-stack TypeScript solution with React frontend and Express.js backend, using SQLite for data persistence. It emphasizes performance optimization, type safety, and modular architecture.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- **React 18 with TypeScript** - Component-based UI with strict type safety
- **Vite** - Fast development server and optimized production builds with code-splitting
- **TanStack Query (React Query)** - Server state management with 30s stale time and intelligent caching
- **React Router DOM** - Client-side routing with lazy-loaded route components
- **Radix UI** - Accessible, unstyled component primitives for dialogs, dropdowns, tabs, etc.
- **Tailwind CSS** - Utility-first styling with custom theme (purple primary: HSL 262 80% 45%)
- **Framer Motion** - GPU-optimized animations with reduced-motion support
- **React Hook Form + Zod** - Type-safe form validation and management

**Design Patterns:**
- **Feature-based organization** - Components co-located with their feature pages
- **Lazy loading** - Route-level code splitting for optimal initial load
- **Error boundaries** - Graceful error handling with user-friendly fallbacks
- **Context API** - Authentication state and user permissions management
- **Custom hooks** - Reusable logic for mobile detection, toast notifications, undo/redo functionality

**Performance Optimizations:**
- Analytics caching with memoization (5-minute TTL for expensive calculations)
- Background processing for heavy computations
- Virtual scrolling for large data lists using TanStack Virtual
- Chart data sampling for performance (max 50 data points by default)
- Debounced search inputs and optimized re-renders

### Backend Architecture

**Technology Stack:**
- **Express.js v5** - Web framework with enhanced security middleware
- **SQLite with better-sqlite3** - File-based database (synchronous, fast queries)
- **TypeScript** - End-to-end type safety shared between client and server
- **Zod** - Runtime validation for API inputs

**Architectural Patterns:**
- **Feature-based modular structure** - Each domain (students, surveys, counseling, etc.) is a self-contained module
- **Repository pattern** - Data access layer separated from business logic
- **Service layer** - Business logic orchestration between repositories
- **Type-driven design** - Shared types between frontend and backend via `/shared` directory

**Feature Module Structure:**
```
server/features/<feature-name>/
├── routes/      - Express route handlers
├── services/    - Business logic layer
├── repository/  - Database operations
├── types/       - TypeScript definitions
└── index.ts     - Feature router aggregation
```

**Security & Middleware:**
- CORS configuration with Replit domain support
- Security headers (X-Content-Type-Options, X-Frame-Options, CSP)
- Input sanitization and XSS protection
- Request size limits (10MB with validation)
- SQL injection prevention through parameterized queries

**Data Architecture:**
- SQLite database stored in `/data/data.db`
- Migration system for schema updates
- Automatic profile initialization for new students
- Scheduled analytics processing (background jobs)
- Backup system with configurable frequency

### Key Domain Models

**Student Management:**
- Unified student data model with frontend/backend mapping
- Standardized profile system (academic, social-emotional, health, motivation, talents)
- Risk assessment with protective factors
- Holistic profiling with strengths-based approach

**Assessment Systems:**
- Survey templates with MEB compliance support
- Multiple distribution methods (Excel, online forms, hybrid)
- Automated scoring and analytics
- Behavioral tracking with ABC model

**Counseling & Intervention:**
- Individual and group counseling sessions
- Calendar-integrated scheduling with class hours
- Automated intervention recommendations based on risk scores
- Follow-up tracking and outcome documentation

**Analytics & Reporting:**
- Multi-dimensional risk scoring (academic, behavioral, attendance, social-emotional)
- Early warning system with alert prioritization
- Predictive analysis for student success
- Comparative reports across classes and demographics
- Progress tracking with trend analysis

### State Management Strategy

**Client-side:**
- TanStack Query for all server data with intelligent cache invalidation
- React Context for global auth state and user permissions
- Local component state for UI interactions
- Custom `useUndo` hook for form history management

**Server-side:**
- Stateless API design (except for scheduled jobs)
- In-memory caching for analytics (5-minute TTL)
- Background processor for expensive calculations
- Database-backed session/state persistence

### Performance & Scalability Considerations

**Frontend:**
- Code splitting by route and vendor chunks (React, UI libraries, charts separated)
- Asset optimization (images, fonts with content hashing)
- CSS code splitting and minification
- Lazy component loading with Suspense fallbacks

**Backend:**
- Connection pooling for database queries
- Prepared statements for frequently-used queries
- Indexed database columns for fast lookups
- Background analytics scheduler to offload heavy computations

**Caching Strategy:**
- Analytics cache: 5 minutes (configurable via constants)
- Memoization cache: 30 seconds for pure calculations
- React Query cache: 30 seconds stale time, 5 minutes garbage collection
- Browser cache: Aggressive caching for static assets with content hashing

## External Dependencies

### Core Runtime Dependencies
- **express** (v5.1.0) - Web application framework
- **better-sqlite3** (v12.4.1) - Synchronous SQLite database driver
- **bcryptjs** (v3.0.2) - Password hashing for authentication
- **cors** (v2.8.5) - Cross-origin resource sharing middleware
- **dotenv** (v17.2.1) - Environment variable management
- **zod** (v3.25.76) - Schema validation library

### Frontend Libraries
- **@tanstack/react-query** - Server state management
- **@tanstack/react-virtual** (v3.13.12) - Virtual scrolling for large lists
- **react-router-dom** - Client-side routing
- **recharts** - Chart visualization library
- **framer-motion** - Animation library
- **@radix-ui/*** - Accessible UI primitives (dialogs, dropdowns, select, tabs, toast)

### Document Processing
- **jspdf** (v3.0.3) - PDF generation for reports
- **xlsx** (v0.20.1) - Excel file parsing and generation for surveys

### Build Tools & Development
- **vite** - Build tool and dev server
- **@vitejs/plugin-react-swc** - Fast React refresh with SWC compiler
- **typescript** - Type checking and compilation
- **tailwindcss** - Utility-first CSS framework
- **eslint** - Code linting with TypeScript support
- **vitest** - Unit testing framework

### Database & Storage
- **SQLite** - File-based relational database (no external server required)
- Location: `data/data.db`
- Migrations managed via custom migration system
- Backup system with scheduled cleanup

### Deployment Dependencies
- **serverless-http** (v3.2.0) - Serverless deployment wrapper (optional)
- Configured for Replit VM deployment with persistent storage

### No External API Requirements
The application is self-contained and does not require external API keys or third-party services for core functionality. All data is stored locally in SQLite.