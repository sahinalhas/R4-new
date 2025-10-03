import { Router } from 'express';
import { simpleRateLimit } from '../../middleware/validation.js';
import * as studentsRoutes from './routes/students.routes.js';

const router = Router();

router.get("/", simpleRateLimit(200, 15 * 60 * 1000), studentsRoutes.getStudents);
router.post("/", simpleRateLimit(50, 15 * 60 * 1000), studentsRoutes.saveStudentHandler);
router.post("/bulk", simpleRateLimit(10, 15 * 60 * 1000), studentsRoutes.saveStudentsHandler);
router.delete("/:id", simpleRateLimit(20, 15 * 60 * 1000), studentsRoutes.deleteStudentHandler);
router.get("/:id/academics", simpleRateLimit(200, 15 * 60 * 1000), studentsRoutes.getStudentAcademics);
router.post("/academics", simpleRateLimit(50, 15 * 60 * 1000), studentsRoutes.addStudentAcademic);
router.get("/:id/progress", simpleRateLimit(200, 15 * 60 * 1000), studentsRoutes.getStudentProgress);
router.get("/:id/interventions", simpleRateLimit(200, 15 * 60 * 1000), studentsRoutes.getStudentInterventions);
router.post("/interventions", simpleRateLimit(50, 15 * 60 * 1000), studentsRoutes.addStudentIntervention);

export default router;
