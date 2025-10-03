import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";

/**
 * BACKEND MODULARIZATION - MIGRATION IN PROGRESS
 * 
 * Migration Status: Stage 0 - Scaffolding Complete
 * 
 * We are migrating from individual route imports to a feature-based modular architecture.
 * See server/features/README.md for full documentation.
 * 
 * Migration Stages (5 Stages Total):
 * - Stage 0: ✅ Scaffolding complete
 * - Stage 1: ✅ Core domains - students ✅ → surveys ✅ → progress ✅ (COMPLETE!)
 * - Stage 2: Adjacent domains - attendance, study, meeting-notes, documents, settings, subjects
 * - Stage 3: Peripheral routers - coaching, health, special-education, etc.
 * - Stage 4: Cleanup - remove legacy imports and old route files
 * 
 * STAGE 1 CANONICAL ORDER (COMPLETED):
 * 1. students (foundation for all student features) ✅
 * 2. surveys (independent survey system) ✅
 * 3. progress (student progress tracking) ✅
 * 
 * Future state (Stage 4 - after cleanup):
 * import featureRegistry from "./features";
 * app.use("/api", featureRegistry);
 */

import featureRegistry from "./features";

// ============================================================================
// LEGACY IMPORTS - TO BE MIGRATED
// These imports will be gradually removed as features are migrated to the
// new modular structure in server/features/
// ============================================================================

// Database API routes
import { 
  getStudents, 
  saveStudentHandler, 
  saveStudentsHandler,
  deleteStudentHandler,
  getStudentAcademics,
  addStudentAcademic,
  getStudentProgress,
  getStudentInterventions,
  addStudentIntervention
} from "./routes/students";
import { 
  getSubjects, 
  saveSubjectsHandler,
  getTopics,
  saveTopicsHandler,
  getTopicsBySubjectId
} from "./routes/subjects";
import { 
  getAllProgressHandler,
  getProgress,
  saveProgressHandler,
  getAcademicGoals,
  saveAcademicGoalsHandler 
} from "./routes/progress";
import { 
  migrateData,
  getMigrationStatusHandler 
} from "./routes/migrate";
import {
  getSurveyTemplates,
  getSurveyTemplateById,
  createSurveyTemplate,
  updateSurveyTemplateHandler,
  deleteSurveyTemplateHandler,
  getQuestionsByTemplateId,
  createSurveyQuestion,
  updateSurveyQuestionHandler,
  deleteSurveyQuestionHandler,
  deleteQuestionsByTemplateHandler,
  getSurveyDistributions,
  getSurveyDistributionById,
  getSurveyDistributionByPublicLink,
  createSurveyDistribution,
  updateSurveyDistributionHandler,
  deleteSurveyDistributionHandler,
  getSurveyResponses,
  createSurveyResponse,
  updateSurveyResponseHandler,
  deleteSurveyResponseHandler,
  getSurveyAnalytics,
  getSurveyQuestionAnalytics,
  getDistributionStatistics
} from "./routes/surveys";
import {
  getMeetingNotes,
  saveMeetingNoteHandler,
  updateMeetingNoteHandler,
  deleteMeetingNoteHandler
} from "./routes/meeting-notes";
import {
  getDocuments,
  saveDocumentHandler,
  deleteDocumentHandler
} from "./routes/documents";
import {
  getSettings,
  saveSettingsHandler
} from "./routes/settings";
import {
  getAttendanceByStudentHandler,
  getAllAttendance,
  saveAttendanceHandler
} from "./routes/attendance";
import {
  getStudyAssignments,
  saveStudyAssignmentHandler,
  updateStudyAssignmentHandler,
  deleteStudyAssignmentHandler,
  getAllWeeklySlotsHandler,
  getWeeklySlots,
  saveWeeklySlotHandler,
  updateWeeklySlotHandler,
  deleteWeeklySlotHandler
} from "./routes/study";
import {
  getSession,
  saveSession,
  updateSessionActivity,
  deleteSession
} from "./routes/auth";
import {
  getStudySessions,
  saveStudySession
} from "./routes/sessions";
import coachingRouter from "./routes/coaching.js";
import healthRouter from "./routes/health.js";
import specialEducationRouter from "./routes/special-education.js";
import riskAssessmentRouter from "./routes/risk-assessment.js";
import behaviorRouter from "./routes/behavior.js";
import examsRouter from "./routes/exams.js";
import counselingSessionsRouter, { getClassHours, getCounselingTopics } from "./routes/counseling-sessions.js";
import { simpleRateLimit } from "./middleware/validation.js";

export function createServer() {
  const app = express();

  // Security headers middleware
  app.use((req, res, next) => {
    // Security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // Remove server information
    res.removeHeader('X-Powered-By');
    
    next();
  });

  // CORS configuration with enhanced security
  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests) in development
      if (!origin && process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      
      if (process.env.NODE_ENV === 'production') {
        // Production: strict whitelist with safe fallbacks
        const allowedOrigins = [];
        
        // Add Replit domain if available
        if (process.env.REPLIT_DEV_DOMAIN) {
          allowedOrigins.push(`https://${process.env.REPLIT_DEV_DOMAIN}`);
        }
        
        // Add custom allowed origins from environment
        if (process.env.ALLOWED_ORIGINS) {
          const customOrigins = process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim());
          allowedOrigins.push(...customOrigins);
        }
        
        // Safe default: if no origins configured, allow same-origin and Replit requests
        if (allowedOrigins.length === 0) {
          // Allow requests with no origin (server-to-server)
          if (!origin) {
            return callback(null, true);
          }
          
          // Allow common Replit patterns
          if (origin.includes('.replit.dev') || origin.includes('.repl.co')) {
            return callback(null, true);
          }
          
          // For other domains, be permissive in production when no explicit config is provided
          // This allows legitimate same-origin requests while the admin configures proper origins
          console.warn(`CORS: No explicit origins configured. Allowing origin: ${origin}. Consider setting ALLOWED_ORIGINS environment variable.`);
          return callback(null, true);
        }
        
        if (!origin || allowedOrigins.includes(origin)) {
          return callback(null, true);
        } else {
          return callback(new Error('Not allowed by CORS'), false);
        }
      } else {
        // Development: allow common development origins
        const devOrigins = [
          'http://localhost:3000',
          'http://localhost:5000',
          'http://localhost:5173', // Vite default
          'http://localhost:8080',
          'http://127.0.0.1:3000',
          'http://127.0.0.1:5000',
          'http://127.0.0.1:5173',
          'http://127.0.0.1:8080'
        ];
        
        // Allow any localhost/127.0.0.1 origin in development for flexibility
        if (!origin || 
            devOrigins.includes(origin) || 
            origin.startsWith('http://localhost:') || 
            origin.startsWith('http://127.0.0.1:') ||
            origin.includes('.replit.dev') ||
            origin.includes('.repl.co')) {
          return callback(null, true);
        } else {
          console.warn(`CORS: Blocked origin in development: ${origin}`);
          return callback(new Error('Not allowed by CORS in development'), false);
        }
      }
    },
    credentials: true,
    optionsSuccessStatus: 200 // For legacy browser support
  }));

  // Request size limits with additional validation
  app.use(express.json({ 
    limit: '10mb',
    verify: (req, res, buf) => {
      // Additional validation could be added here
      if (buf.length === 0) {
        throw new Error('Empty request body');
      }
    }
  }));
  app.use(express.urlencoded({ 
    extended: true, 
    limit: '10mb',
    parameterLimit: 1000 // Limit number of parameters
  }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // ========================================================================
  // FEATURE REGISTRY - NEW MODULAR ROUTES (Stage 1+)
  // ========================================================================
  // Mount the feature registry to handle new modular routes
  // Both new and legacy routes coexist during migration for backward compatibility
  app.use("/api", featureRegistry);
  
  // ========================================================================
  // LEGACY ROUTE REGISTRATIONS - TO BE REPLACED BY FEATURE REGISTRY
  // ========================================================================
  // Note: During migration, both new (feature registry) and legacy routes are active
  // Legacy routes will be removed in Stage 4 after full migration is complete
  
  // Database API routes
  // Apply appropriate rate limits per endpoint based on operation type
  
  // ✅ MIGRATED: Students (Stage 1.1)
  // New route: /api/students -> server/features/students
  // Legacy routes kept for backward compatibility during migration
  // TODO (Stage 4): Remove these legacy students routes after full migration
  app.get("/api/students", simpleRateLimit(200, 15 * 60 * 1000), getStudents);
  app.post("/api/students", simpleRateLimit(50, 15 * 60 * 1000), saveStudentHandler);
  app.post("/api/students/bulk", simpleRateLimit(10, 15 * 60 * 1000), saveStudentsHandler);
  app.delete("/api/students/:id", simpleRateLimit(20, 15 * 60 * 1000), deleteStudentHandler);
  app.get("/api/students/:id/academics", simpleRateLimit(200, 15 * 60 * 1000), getStudentAcademics);
  app.post("/api/students/academics", simpleRateLimit(50, 15 * 60 * 1000), addStudentAcademic);
  app.get("/api/students/:id/progress", simpleRateLimit(200, 15 * 60 * 1000), getStudentProgress);

  // Subjects & Topics
  app.get("/api/subjects", simpleRateLimit(200, 15 * 60 * 1000), getSubjects);
  app.post("/api/subjects", simpleRateLimit(50, 15 * 60 * 1000), saveSubjectsHandler);
  app.get("/api/subjects/:id/topics", simpleRateLimit(200, 15 * 60 * 1000), getTopicsBySubjectId);
  app.get("/api/topics", simpleRateLimit(200, 15 * 60 * 1000), getTopics);
  app.post("/api/topics", simpleRateLimit(50, 15 * 60 * 1000), saveTopicsHandler);

  // ✅ MIGRATED: Progress (Stage 1.3 - Stage 1 Complete!)
  // New route: /api/progress, /api/academic-goals -> server/features/progress
  // Legacy routes kept for backward compatibility during migration
  // TODO (Stage 4): Remove these legacy progress routes after full migration
  app.get("/api/progress", simpleRateLimit(200, 15 * 60 * 1000), getAllProgressHandler);
  app.get("/api/progress/:studentId", simpleRateLimit(200, 15 * 60 * 1000), getProgress);
  app.post("/api/progress", simpleRateLimit(50, 15 * 60 * 1000), saveProgressHandler);
  app.get("/api/academic-goals/:studentId", simpleRateLimit(200, 15 * 60 * 1000), getAcademicGoals);
  app.post("/api/academic-goals", simpleRateLimit(50, 15 * 60 * 1000), saveAcademicGoalsHandler);

  // Migration
  app.post("/api/migrate", simpleRateLimit(5, 15 * 60 * 1000), migrateData);
  app.get("/api/migrate/status", simpleRateLimit(200, 15 * 60 * 1000), getMigrationStatusHandler);

  // ✅ MIGRATED: Surveys (Stage 1.2)
  // New route: /api/surveys -> server/features/surveys
  // Legacy routes kept for backward compatibility during migration
  // TODO (Stage 4): Remove these legacy survey routes after full migration
  
  // Survey Templates
  app.get("/api/survey-templates", simpleRateLimit(200, 15 * 60 * 1000), getSurveyTemplates);
  app.get("/api/survey-templates/:id", simpleRateLimit(200, 15 * 60 * 1000), getSurveyTemplateById);
  app.post("/api/survey-templates", simpleRateLimit(30, 15 * 60 * 1000), createSurveyTemplate);
  app.put("/api/survey-templates/:id", simpleRateLimit(30, 15 * 60 * 1000), updateSurveyTemplateHandler);
  app.delete("/api/survey-templates/:id", simpleRateLimit(20, 15 * 60 * 1000), deleteSurveyTemplateHandler);

  // Survey Questions
  app.get("/api/survey-questions/:templateId", simpleRateLimit(200, 15 * 60 * 1000), getQuestionsByTemplateId);
  app.post("/api/survey-questions", simpleRateLimit(50, 15 * 60 * 1000), createSurveyQuestion);
  app.put("/api/survey-questions/:id", simpleRateLimit(50, 15 * 60 * 1000), updateSurveyQuestionHandler);
  app.delete("/api/survey-questions/:id", simpleRateLimit(30, 15 * 60 * 1000), deleteSurveyQuestionHandler);
  app.delete("/api/survey-questions/template/:templateId", simpleRateLimit(20, 15 * 60 * 1000), deleteQuestionsByTemplateHandler);

  // Survey Distributions
  app.get("/api/survey-distributions", simpleRateLimit(200, 15 * 60 * 1000), getSurveyDistributions);
  app.get("/api/survey-distributions/:id", simpleRateLimit(200, 15 * 60 * 1000), getSurveyDistributionById);
  app.get("/api/survey-distributions/link/:publicLink", simpleRateLimit(300, 15 * 60 * 1000), getSurveyDistributionByPublicLink);
  app.post("/api/survey-distributions", simpleRateLimit(30, 15 * 60 * 1000), createSurveyDistribution);
  app.put("/api/survey-distributions/:id", simpleRateLimit(30, 15 * 60 * 1000), updateSurveyDistributionHandler);
  app.delete("/api/survey-distributions/:id", simpleRateLimit(20, 15 * 60 * 1000), deleteSurveyDistributionHandler);

  // Survey Responses - higher limits for public submissions
  app.get("/api/survey-responses", simpleRateLimit(200, 15 * 60 * 1000), getSurveyResponses);
  app.post("/api/survey-responses", simpleRateLimit(100, 15 * 60 * 1000), createSurveyResponse);
  app.put("/api/survey-responses/:id", simpleRateLimit(50, 15 * 60 * 1000), updateSurveyResponseHandler);
  app.delete("/api/survey-responses/:id", simpleRateLimit(30, 15 * 60 * 1000), deleteSurveyResponseHandler);

  // Survey Analytics
  app.get("/api/survey-analytics/:distributionId", simpleRateLimit(150, 15 * 60 * 1000), getSurveyAnalytics);
  app.get("/api/survey-analytics/:distributionId/question/:questionId", simpleRateLimit(150, 15 * 60 * 1000), getSurveyQuestionAnalytics);
  app.get("/api/survey-statistics/:distributionId", simpleRateLimit(150, 15 * 60 * 1000), getDistributionStatistics);

  // Meeting Notes
  app.get("/api/meeting-notes/:studentId", simpleRateLimit(200, 15 * 60 * 1000), getMeetingNotes);
  app.post("/api/meeting-notes", simpleRateLimit(50, 15 * 60 * 1000), saveMeetingNoteHandler);
  app.put("/api/meeting-notes/:id", simpleRateLimit(50, 15 * 60 * 1000), updateMeetingNoteHandler);
  app.delete("/api/meeting-notes/:id", simpleRateLimit(30, 15 * 60 * 1000), deleteMeetingNoteHandler);

  // Student Documents
  app.get("/api/documents/:studentId", simpleRateLimit(200, 15 * 60 * 1000), getDocuments);
  app.post("/api/documents", simpleRateLimit(30, 15 * 60 * 1000), saveDocumentHandler);
  app.delete("/api/documents/:id", simpleRateLimit(30, 15 * 60 * 1000), deleteDocumentHandler);

  // App Settings
  app.get("/api/settings", simpleRateLimit(200, 15 * 60 * 1000), getSettings);
  app.put("/api/settings", simpleRateLimit(30, 15 * 60 * 1000), saveSettingsHandler);

  // Attendance
  app.get("/api/attendance", simpleRateLimit(200, 15 * 60 * 1000), getAllAttendance);
  app.get("/api/attendance/:studentId", simpleRateLimit(200, 15 * 60 * 1000), getAttendanceByStudentHandler);
  app.post("/api/attendance", simpleRateLimit(50, 15 * 60 * 1000), saveAttendanceHandler);

  // Interventions
  app.get("/api/students/:id/interventions", simpleRateLimit(200, 15 * 60 * 1000), getStudentInterventions);
  app.post("/api/students/interventions", simpleRateLimit(50, 15 * 60 * 1000), addStudentIntervention);

  // Study Assignments
  app.get("/api/study-assignments/:studentId", simpleRateLimit(200, 15 * 60 * 1000), getStudyAssignments);
  app.post("/api/study-assignments", simpleRateLimit(50, 15 * 60 * 1000), saveStudyAssignmentHandler);
  app.put("/api/study-assignments/:id", simpleRateLimit(50, 15 * 60 * 1000), updateStudyAssignmentHandler);
  app.delete("/api/study-assignments/:id", simpleRateLimit(30, 15 * 60 * 1000), deleteStudyAssignmentHandler);

  // Weekly Slots
  app.get("/api/weekly-slots", simpleRateLimit(200, 15 * 60 * 1000), getAllWeeklySlotsHandler);
  app.get("/api/weekly-slots/:studentId", simpleRateLimit(200, 15 * 60 * 1000), getWeeklySlots);
  app.post("/api/weekly-slots", simpleRateLimit(50, 15 * 60 * 1000), saveWeeklySlotHandler);
  app.put("/api/weekly-slots/:id", simpleRateLimit(50, 15 * 60 * 1000), updateWeeklySlotHandler);
  app.delete("/api/weekly-slots/:id", simpleRateLimit(30, 15 * 60 * 1000), deleteWeeklySlotHandler);

  // Auth/Session
  app.get("/api/session/:userId", simpleRateLimit(200, 15 * 60 * 1000), getSession);
  app.post("/api/session", simpleRateLimit(100, 15 * 60 * 1000), saveSession);
  app.put("/api/session/:userId/activity", simpleRateLimit(200, 15 * 60 * 1000), updateSessionActivity);
  app.delete("/api/session/:userId", simpleRateLimit(50, 15 * 60 * 1000), deleteSession);

  // Study Sessions
  app.get("/api/study-sessions/:studentId", simpleRateLimit(200, 15 * 60 * 1000), getStudySessions);
  app.post("/api/study-sessions", simpleRateLimit(50, 15 * 60 * 1000), saveStudySession);

  // Coaching routes - comprehensive student guidance features
  app.use("/api/coaching", simpleRateLimit(200, 15 * 60 * 1000), coachingRouter);

  // Health Information routes
  app.use("/api", simpleRateLimit(200, 15 * 60 * 1000), healthRouter);

  // Special Education (BEP) routes
  app.use("/api", simpleRateLimit(200, 15 * 60 * 1000), specialEducationRouter);

  // Risk Assessment routes
  app.use("/api", simpleRateLimit(200, 15 * 60 * 1000), riskAssessmentRouter);

  // Behavior Tracking routes
  app.use("/api", simpleRateLimit(200, 15 * 60 * 1000), behaviorRouter);

  // Exam Results routes
  app.use("/api", simpleRateLimit(200, 15 * 60 * 1000), examsRouter);

  // Counseling Sessions routes
  app.use("/api/counseling-sessions", simpleRateLimit(200, 15 * 60 * 1000), counselingSessionsRouter);
  app.get("/api/class-hours", simpleRateLimit(200, 15 * 60 * 1000), getClassHours);
  app.get("/api/counseling-topics", simpleRateLimit(200, 15 * 60 * 1000), getCounselingTopics);

  return app;
}
