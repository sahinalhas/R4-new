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
- **Form Refactoring**: Student profile sections (BasicInfoSection, SaglikBilgileriSection, OzelEgitimSection) refactored to use React Hook Form instead of direct prop mutation or DOM manipulation. This improves state management, validation, and maintainability.
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
