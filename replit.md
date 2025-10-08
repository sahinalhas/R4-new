# Rehber360 - Student Guidance System

## Overview
Rehber360 is a comprehensive Turkish-language student guidance and management system for educational institutions. It offers a modern, efficient platform for student tracking, counseling, and administrative tasks, featuring automated intervention, smart topic planning, and detailed student profiles. The system aims to be a vital tool for educators by enhancing student support and administrative efficiency.

## User Preferences
I prefer simple language and clear, concise explanations. I want iterative development with frequent, small updates. Ask before making major architectural changes or introducing new external dependencies. Do not make changes to the folder `node_modules` and `dist`. Do not make changes to the file `replit.nix` and `.replit`.

## System Architecture
The application utilizes a modern full-stack architecture, emphasizing modularity and maintainability.

- **UI/UX Decisions**: The design prioritizes a modern, responsive interface with a light purple color palette, gradient headers, icon-based statistics, and enhanced form/dialog components. Frontend components are organized by feature to adhere to the Single Responsibility Principle.
- **Technical Implementations**:
    - **Frontend**: Built with React 18 and TypeScript using Vite, employing Radix UI, Tailwind CSS, and Framer Motion for styling and animations. Form management uses React Hook Form and Zod for type-safe validation. CVA is used for modular, type-safe style variants.
    - **Backend**: Express.js handles API routes and serves the frontend, with a feature-based module structure for repositories, services, and routes.
    - **Database**: SQLite (`data.db`) is used for all data persistence, with a modular organization for schema, migrations, triggers, and indexes.
    - **Key Features**: Includes an automatic intervention system, a calendar with Ebbinghaus forgetting curve-based spaced repetition, and comprehensive student tracking (health, special education, risk factors, behavior, exam results). Data persistence is managed via API endpoints with error handling and input sanitization. Performance optimizations include lazy tab loading, virtual scrolling, progressive loading, and data pagination for reports, alongside server-side analytics with caching.
- **System Design Choices**: The system is configured for Replit's autoscale deployment, using `npm run build` for client and server, and `npm start` for the production server. Global error handling and production build optimizations are implemented for robustness and performance.

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
- **NPM**: Package manager.