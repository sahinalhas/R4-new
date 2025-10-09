# Rehber360 - Student Guidance System

## Overview
Rehber360 is a comprehensive Turkish-language student guidance and management system for educational institutions. It offers a modern, efficient platform for student tracking, counseling, and administrative tasks, featuring automated intervention, smart topic planning, and detailed student profiles. The system aims to be a vital tool for educators by enhancing student support and administrative efficiency.

## User Preferences
I prefer simple language and clear, concise explanations. I want iterative development with frequent, small updates. Ask before making major architectural changes or introducing new external dependencies. Do not make changes to the folder `node_modules` and `dist`. Do not make changes to the file `replit.nix` and `.replit`.

## Recent Changes
**October 9, 2025**: Advanced Risk Assessment and Early Warning System implemented with automatic risk scoring, early warning alerts, and intervention recommendations. The system includes:
- Automatic risk score calculation from academic, behavioral, attendance, and social-emotional data
- Real-time early warning alerts with severity levels (KRİTİK, YÜKSEK, ORTA, DÜŞÜK)
- AI-powered intervention recommendations based on risk analysis
- Risk Dashboard with active alerts, high-risk student tracking, and trending analysis
- Risk Summary Widget integrated into main dashboard
- Complete backend infrastructure with new database tables (early_warning_alerts, risk_score_history, intervention_recommendations)
- RESTful API endpoints for risk analysis, alert management, and intervention tracking

**October 8, 2025**: Modern design system overhaul completed with premium aesthetics, accessibility compliance, and performance optimization.

## System Architecture
The application utilizes a modern full-stack architecture, emphasizing modularity and maintainability.

- **UI/UX Decisions**: The design features a premium, award-winning website aesthetic with:
  - **Modern Color Palette**: Sophisticated purple tones (HSL 262 80% 45%) with WCAG AAA compliant contrast (8.6:1 light mode, 6.2:1 dark mode)
  - **Glass Morphism**: Subtle backdrop-blur effects and layered shadows for depth
  - **Premium Typography**: Inter font with optimized tracking, leading, and font-feature-settings for enhanced readability
  - **Smooth Animations**: GPU-optimized transitions with prefers-reduced-motion support
  - **Responsive Spacing**: Golden ratio-based padding and container widths for balanced layouts
  - Frontend components are organized by feature to adhere to the Single Responsibility Principle.
- **Technical Implementations**:
    - **Frontend**: Built with React 18 and TypeScript using Vite, employing Radix UI, Tailwind CSS, and Framer Motion for styling and animations. Form management uses React Hook Form and Zod for type-safe validation. CVA is used for modular, type-safe style variants.
    - **Backend**: Express.js handles API routes and serves the frontend, with a feature-based module structure for repositories, services, and routes.
    - **Database**: SQLite (`data.db`) is used for all data persistence, with a modular organization for schema, migrations, triggers, and indexes.
    - **Key Features**: 
      - **Risk Assessment & Early Warning System**: Automatic risk scoring algorithm that analyzes academic performance, behavioral patterns, attendance records, and social-emotional factors. Generates real-time alerts when risk thresholds are exceeded and provides AI-powered intervention recommendations.
      - **Automatic Intervention System**: Original intervention tracking with calendar integration using Ebbinghaus forgetting curve-based spaced repetition.
      - **Comprehensive Student Tracking**: Health records, special education needs, risk factors, behavior monitoring, and exam results.
      - **Data Management**: API endpoints with error handling, input sanitization, and structured logging for monitoring.
      - **Performance Optimizations**: Lazy tab loading, virtual scrolling, progressive loading, data pagination for reports, and server-side analytics with caching.
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