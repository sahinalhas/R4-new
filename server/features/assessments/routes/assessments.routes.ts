import { Router, type Request, type Response } from 'express';
import { AssessmentService } from '../services/assessment.service';
import { ExcelImportService } from '../services/excel-import.service';
import { excelTemplateService } from '../services/excel-template.service';
import multer from 'multer';

const router = Router();
const assessmentService = new AssessmentService();
const excelService = new ExcelImportService();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// ============= ASSESSMENT TYPES =============

router.get('/types', (req: Request, res: Response) => {
  try {
    const types = assessmentService.getAssessmentTypes();
    res.json(types);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/types/category/:category', (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    const types = assessmentService.getAssessmentTypesByCategory(category);
    res.json(types);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ============= ASSESSMENTS =============

router.get('/', (req: Request, res: Response) => {
  try {
    const filters = {
      assessmentTypeId: req.query.assessmentTypeId as string,
      className: req.query.className as string,
      subjectId: req.query.subjectId as string,
      semester: req.query.semester as string,
      academicYear: req.query.academicYear as string,
      dateFrom: req.query.dateFrom as string,
      dateTo: req.query.dateTo as string,
    };

    // Remove undefined values
    Object.keys(filters).forEach(key => 
      filters[key as keyof typeof filters] === undefined && delete filters[key as keyof typeof filters]
    );

    const assessments = assessmentService.getAssessments(filters);
    res.json(assessments);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const assessment = assessmentService.getAssessmentById(id);
    if (!assessment) {
      return res.status(404).json({ error: 'Değerlendirme bulunamadı' });
    }
    res.json(assessment);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', (req: Request, res: Response) => {
  try {
    const assessment = assessmentService.createAssessment(req.body);
    res.status(201).json(assessment);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const assessment = assessmentService.updateAssessment(id, req.body);
    res.json(assessment);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    assessmentService.deleteAssessment(id);
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ============= ASSESSMENT RESULTS =============

router.get('/:id/results', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const results = assessmentService.getAssessmentResults(id);
    res.json(results);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/results', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = assessmentService.createAssessmentResult({
      ...req.body,
      assessmentId: id
    });
    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ============= STUDENT ASSESSMENTS =============

router.get('/student/:studentId', (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const filters = {
      assessmentTypeId: req.query.assessmentTypeId as string,
      dateFrom: req.query.dateFrom as string,
      dateTo: req.query.dateTo as string,
    };

    Object.keys(filters).forEach(key => 
      filters[key as keyof typeof filters] === undefined && delete filters[key as keyof typeof filters]
    );

    const results = assessmentService.getStudentAssessmentResults(studentId, filters);
    res.json(results);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/student/:studentId/summary', (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const summary = assessmentService.getStudentAssessmentSummary(studentId);
    res.json(summary);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ============= MOCK EXAMS =============

router.post('/mock-exams', (req: Request, res: Response) => {
  try {
    const result = assessmentService.createMockExamWithResults(req.body);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/mock-exams/student/:studentId', (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const results = assessmentService.getStudentMockExamResults(studentId);
    res.json(results);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ============= SUBJECT GRADES =============

router.post('/subject-grades', (req: Request, res: Response) => {
  try {
    const grade = assessmentService.createSubjectGrade(req.body);
    res.status(201).json(grade);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/subject-grades/student/:studentId', (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const filters = {
      semester: req.query.semester as string,
      academicYear: req.query.academicYear as string,
      subjectId: req.query.subjectId as string,
    };

    Object.keys(filters).forEach(key => 
      filters[key as keyof typeof filters] === undefined && delete filters[key as keyof typeof filters]
    );

    const grades = assessmentService.getStudentSubjectGrades(studentId, filters);
    res.json(grades);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ============= BULK UPLOAD =============

router.post('/bulk-upload/mock-exam', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Dosya yüklenmedi' });
    }

    const examType = req.body.examType || req.query.examType;
    if (!examType) {
      return res.status(400).json({ error: 'Sınav tipi belirtilmedi' });
    }

    const parsedData = excelService.parseMockExamFile(req.file.buffer, examType as string);
    const errors = excelService.validateMockExamData(parsedData);

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    // Convert to bulk upload format
    const bulkData = {
      examType: parsedData.examType as any,
      examProvider: parsedData.examProvider,
      examNumber: parsedData.examNumber,
      examDate: parsedData.examDate,
      className: parsedData.className,
      results: parsedData.students.map(s => ({
        studentId: s.studentId,
        sectionResults: s.sections.map(sec => ({
          sectionName: sec.sectionName,
          correct: sec.correct,
          wrong: sec.wrong,
          empty: sec.empty,
          net: sec.correct - (sec.wrong / 4)
        })),
        topicResults: []
      }))
    };

    const result = assessmentService.bulkUploadMockExam(bulkData);
    res.status(201).json({ 
      success: true, 
      assessmentId: result.assessmentId,
      mockExamId: result.mockExamId,
      processedCount: bulkData.results.length 
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/bulk-upload/subject-grades', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Dosya yüklenmedi' });
    }

    const parsedData = excelService.parseSubjectGradesFile(req.file.buffer);
    const errors = excelService.validateSubjectGradesData(parsedData);

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    // Convert to bulk upload format
    const bulkData = {
      subjectId: parsedData.subjectId,
      semester: parsedData.semester,
      academicYear: parsedData.academicYear,
      gradeType: parsedData.gradeType as any,
      className: parsedData.className,
      grades: parsedData.grades
    };

    assessmentService.bulkUploadSubjectGrades(bulkData);
    res.status(201).json({ 
      success: true,
      processedCount: bulkData.grades.length 
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ============= TEMPLATES =============

router.get('/templates/mock-exam/:examType', (req: Request, res: Response) => {
  try {
    const { examType } = req.params;
    const buffer = excelTemplateService.generateMockExamTemplate(examType);
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=deneme-sinav-${examType}-sablonu.xlsx`);
    res.send(buffer);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/templates/subject-grades', (req: Request, res: Response) => {
  try {
    const buffer = excelService.generateSubjectGradesTemplate();
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=ders-notlari-sablonu.xlsx');
    res.send(buffer);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
