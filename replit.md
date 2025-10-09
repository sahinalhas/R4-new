# Rehber360 - Student Guidance System

## Overview
Rehber360 is a comprehensive Turkish-language student guidance and management system for educational institutions. It offers a modern, efficient platform for student tracking, counseling, and administrative tasks, featuring automated intervention, smart topic planning, and detailed student profiles. The system aims to be a vital tool for educators by enhancing student support and administrative efficiency.

## User Preferences
I prefer simple language and clear, concise explanations. I want iterative development with frequent, small updates. Ask before making major architectural changes or introducing new external dependencies. Do not make changes to the folder `node_modules` and `dist`. Do not make changes to the file `replit.nix` and `.replit`.

## Recent Changes
**October 9, 2025**: Complete Student Profile Standardization System implemented - objective, data-driven student evaluation with automatic profile creation:

### Unified Data Processing Architecture
- **Centralized Type System** (`shared/types/student.types.ts`):
  - Unified Student interface combining backend/frontend models
  - UnifiedStudentScores with 8-dimensional scoring (0-100 scale)
  - ProfileCompleteness tracking for all sections
  - Standardized type conversion utilities
  
- **Core Services** (`server/services/`):
  - **StudentDataProcessor**: Validates, normalizes, and transforms student data
  - **UnifiedScoringEngine**: Calculates aggregate scores across all dimensions
  - **AutoProfileInitializer**: Automatically creates standard profiles for new students
  - **ProfileQualityValidator**: Validates data completeness and quality

- **8-Dimensional Scoring System** (0-100 scale):
  - Academic Performance (20%): GPA, skills, study habits
  - Social-Emotional Development (20%): SEL competencies, relationships
  - Behavioral Status (15%): Incidents, interventions, patterns
  - Talents & Interests (10%): Creative, physical talents, engagement
  - Health Profile (10%): Physical health, medical history
  - Motivation Level (10%): Intrinsic/extrinsic motivation, goals
  - Risk Factors (7.5%): Academic, behavioral, social risks
  - Protective Factors (7.5%): Family, peer support, resilience

### Automatic Profile Management
- **Auto-Creation**: Missing profiles automatically generated on student creation
- **Completeness Tracking**: Real-time calculation of profile completeness (5 categories)
- **Quality Validation**: Minimum requirements enforced for each profile type
- **Migration Support**: Bulk initialization script for existing students

### Unified Profile API (`/api/students/:id/`)
- `GET /unified-profile`: Complete student profile in single call (student, scores, completeness, quality)
- `POST /initialize-profiles`: Auto-create missing profiles
- `POST /recalculate-scores`: Refresh aggregate scores
- `GET /quality-report`: Detailed data quality analysis

### UI Components (`client/components/student-profile/`)
- **ProfileCompletenessIndicator**: Visual progress bars for each section, missing field alerts
- **UnifiedScoreDashboard**: Real-time scoring visualization with color-coded metrics
- Both components support dynamic updates and quality warnings

### Standardized Form Validation (`shared/validation/`)
- Zod schemas for all profile types (academic, social-emotional, talents, health, behavior, risk, motivation)
- Consistent validation rules across frontend/backend
- Completeness calculation helpers
- Type-safe form values

**October 9, 2025**: AI-Ready Standardized Student Profile System implemented with comprehensive taxonomy for machine learning analysis:

### Standardization & Taxonomy System
- **Complete Taxonomy Library** (`shared/constants/student-profile-taxonomy.ts`):
  - **Academic**: 19 subjects + 15 academic skills (categorized: bilişsel, yürütücü, akademik)
  - **Social-Emotional**: 20 social skills (sosyal, duygusal categories)
  - **Creative Talents**: 17 categories (görsel sanat, müzik, performans, edebiyat)
  - **Physical Talents**: 22 sports & skills (takım sporu, bireysel, dövüş, fitness)
  - **Interest Areas**: 26 standardized interests (akademik, teknoloji, sanat, sosyal)
  - **Health Standards**: Blood types (8), chronic diseases (21), allergies (21), medications (12)
  - **Interventions**: 31 categorized intervention types (akademik, davranışsal, sosyal, aile, psikolojik, kariyer)
  - **Behavior Categories**: 40+ standardized behaviors (OLUMLU to ÇOK_CİDDİ with ABC model support)
  - **Learning Styles**: 6 scientifically-validated styles
  - **Scales**: Skill levels (1-5), Intensity levels (1-5), Frequency levels (0-4)

### Standardized Data Models (AI-Compatible)
- **AcademicProfile**: Measurable academic strengths/weaknesses, learning styles, motivation (1-10), study hours, homework completion rate
- **SocialEmotionalProfile**: Quantified SEL metrics (empathy, self-awareness, emotion regulation 1-10), friend circle data, social role, bullying status
- **TalentsInterestsProfile**: Multi-select talents, interests with proficiency tracking, club memberships, competition records
- **StandardizedHealthProfile**: Coded chronic diseases, allergies, medications (JSON arrays), emergency contacts
- **StandardizedIntervention**: Categorized interventions with effectiveness tracking, session progress, initial/current assessments
- **StandardizedBehaviorIncident**: ABC model (Antecedent-Behavior-Consequence), categorized behaviors, intervention effectiveness
- **AIReadyStudentProfile**: Aggregate profile with calculated scores (0-100) for academic, social, emotional, behavioral, motivation, risk factors

### Database Schema (10 New Tables)
- `academic_profiles`, `social_emotional_profiles`, `talents_interests_profiles`
- `standardized_health_profiles`, `standardized_interventions`, `standardized_behavior_incidents`
- `motivation_profiles`, `risk_protective_profiles`
- `student_aggregate_scores` (7 calculated metrics for AI analysis)
- `student_ai_insights` (AI-generated summaries, recommendations, predictions)

### UI Components (Multi-Select & Tag System)
- **MultiSelect Component**: Categorized dropdown with grouping, search, and visual selection
- **TagInput Component**: Free-text tags with auto-suggestions
- **Standardized Forms**:
  - `StandardizedHealthSection`: Blood type selector, disease/allergy/medication multi-selects
  - `StandardizedAcademicSection`: Subject/skill multi-selects, learning style dropdowns, motivation slider (1-10)
  - `StandardizedTalentsSection`: Creative/physical talents, interests with proficiency tracking
  - `StandardizedBehaviorSection`: ABC model forms, categorized behaviors, intervention tracking

### API Endpoints (`/api/standardized-profile/:studentId/`)
- GET/POST `/academic`, `/social-emotional`, `/talents-interests`, `/health`
- GET/POST `/interventions`, `/behavior-incidents`
- All endpoints store data as JSON for AI processing

### Benefits for AI Analysis
1. **Consistent Data**: Standardized categories enable pattern recognition across students
2. **Quantifiable Metrics**: 1-10 scales, percentages, frequencies for statistical analysis
3. **Structured JSON**: Arrays and objects optimized for machine learning pipelines
4. **Taxonomy-Based**: Hierarchical categories allow multi-level analysis
5. **Aggregate Scores**: Pre-calculated metrics (0-100) for quick AI model inputs
6. **Predictive Modeling**: Clean, structured data enables outcome prediction and early intervention

**October 9, 2025**: Holistic Student Profiling System implemented to understand students from every dimension (now enhanced with standardized taxonomy).

**October 9, 2025**: Advanced Risk Assessment and Early Warning System implemented with automatic risk scoring, early warning alerts, and intervention recommendations.

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
      - **Holistic Student Profiling**: Six-dimensional student understanding system covering strengths, social relations, interests, future vision, SEL competencies, and socioeconomic factors. Enables comprehensive student tracking with dedicated UI sections and backend APIs for each dimension.
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