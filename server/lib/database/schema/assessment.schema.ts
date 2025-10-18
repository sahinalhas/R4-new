import type Database from 'better-sqlite3';

/**
 * Comprehensive Assessment Schema
 * Handles all types of student assessments including:
 * - School subject grades
 * - Mock exams (TYT/AYT/LGS)
 * - Topic/outcome assessments
 * - Performance tasks
 * - Standard tests
 * - Assessment scales
 */

export function createAssessmentTables(db: Database.Database): void {
  // Assessment Types - Değerlendirme türleri
  db.exec(`
    CREATE TABLE IF NOT EXISTS assessment_types (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL CHECK (category IN (
        'DERS_NOTU',          -- School subject grades
        'DENEME_SINAVI',      -- Mock exams (TYT/AYT/LGS)
        'KONU_TARAMA',        -- Topic/outcome tests
        'PERFORMANS_GOREVI',  -- Performance tasks/projects
        'STANDART_TEST',      -- Standard tests (central exams)
        'OLCEK',              -- Assessment scales
        'DIGER'               -- Other
      )),
      subCategory TEXT,       -- e.g., 'TYT', 'AYT', 'LGS' for DENEME_SINAVI
      description TEXT,
      isActive BOOLEAN DEFAULT TRUE,
      metadata TEXT,          -- JSON: additional configuration
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Assessments - Yapılan değerlendirmeler
  db.exec(`
    CREATE TABLE IF NOT EXISTS assessments (
      id TEXT PRIMARY KEY,
      assessmentTypeId TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      assessmentDate TEXT NOT NULL,
      semester TEXT,          -- e.g., '2024-2025 Güz'
      academicYear TEXT,      -- e.g., '2024-2025'
      className TEXT,         -- Which class(es) took this assessment
      subjectId TEXT,         -- Link to subjects table (if subject-specific)
      maxScore REAL,          -- Maximum possible score
      passingScore REAL,      -- Minimum passing score
      weight REAL DEFAULT 1.0,-- Weight in final calculation
      metadata TEXT,          -- JSON: exam-specific data (e.g., net counts for mock exams)
      createdBy TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (assessmentTypeId) REFERENCES assessment_types (id) ON DELETE CASCADE,
      FOREIGN KEY (subjectId) REFERENCES subjects (id) ON DELETE SET NULL
    );
  `);

  // Assessment Results - Öğrenci sonuçları
  db.exec(`
    CREATE TABLE IF NOT EXISTS assessment_results (
      id TEXT PRIMARY KEY,
      assessmentId TEXT NOT NULL,
      studentId TEXT NOT NULL,
      score REAL,
      percentage REAL,        -- Score as percentage
      grade TEXT,             -- Letter grade (A, B, C, etc.)
      rank INTEGER,           -- Student's rank in class
      classAverage REAL,      -- Class average for comparison
      schoolAverage REAL,     -- School average for comparison
      notes TEXT,
      submittedAt DATETIME,
      gradedAt DATETIME,
      gradedBy TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (assessmentId) REFERENCES assessments (id) ON DELETE CASCADE,
      FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE CASCADE,
      UNIQUE(assessmentId, studentId)
    );
  `);

  // Mock Exams - Deneme sınavları detaylı bilgiler
  db.exec(`
    CREATE TABLE IF NOT EXISTS mock_exams (
      id TEXT PRIMARY KEY,
      assessmentId TEXT NOT NULL UNIQUE,
      examType TEXT NOT NULL CHECK (examType IN ('TYT', 'AYT', 'LGS', 'KPSS', 'ALES', 'DGS', 'YDS', 'DIGER')),
      examProvider TEXT,      -- Exam publisher/provider
      examNumber TEXT,        -- e.g., '1. Deneme', '2. Deneme'
      totalQuestions INTEGER,
      totalTime INTEGER,      -- Total time in minutes
      sections TEXT,          -- JSON: array of sections with question counts
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (assessmentId) REFERENCES assessments (id) ON DELETE CASCADE
    );
  `);

  // Mock Exam Results - Deneme sınav sonuçları (net analizi)
  db.exec(`
    CREATE TABLE IF NOT EXISTS mock_exam_results (
      id TEXT PRIMARY KEY,
      mockExamId TEXT NOT NULL,
      studentId TEXT NOT NULL,
      assessmentResultId TEXT NOT NULL,
      totalCorrect INTEGER DEFAULT 0,
      totalWrong INTEGER DEFAULT 0,
      totalEmpty INTEGER DEFAULT 0,
      netScore REAL,          -- Calculated net (doğru - yanlış/4)
      targetNet REAL,         -- Student's target net
      sectionResults TEXT,    -- JSON: detailed section-by-section results
      topicResults TEXT,      -- JSON: topic-level performance
      timeSpent INTEGER,      -- Time spent in minutes
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (mockExamId) REFERENCES mock_exams (id) ON DELETE CASCADE,
      FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE CASCADE,
      FOREIGN KEY (assessmentResultId) REFERENCES assessment_results (id) ON DELETE CASCADE,
      UNIQUE(mockExamId, studentId)
    );
  `);

  // Subject Grades - Okul dersi notları
  db.exec(`
    CREATE TABLE IF NOT EXISTS subject_grades (
      id TEXT PRIMARY KEY,
      studentId TEXT NOT NULL,
      subjectId TEXT NOT NULL,
      assessmentId TEXT,      -- Optional: link to specific assessment
      semester TEXT NOT NULL,
      academicYear TEXT NOT NULL,
      gradeType TEXT NOT NULL CHECK (gradeType IN (
        'YAZILI',             -- Written exam
        'SOZLU',              -- Oral exam
        'PERFORMANS',         -- Performance grade
        'PROJE',              -- Project
        'DAVRANIS',           -- Behavior
        'DEVAMSIZLIK',        -- Attendance
        'ORTALAMA'            -- Average
      )),
      score REAL NOT NULL,
      maxScore REAL DEFAULT 100,
      weight REAL DEFAULT 1.0,
      notes TEXT,
      enteredBy TEXT,
      enteredAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE CASCADE,
      FOREIGN KEY (subjectId) REFERENCES subjects (id) ON DELETE CASCADE,
      FOREIGN KEY (assessmentId) REFERENCES assessments (id) ON DELETE SET NULL
    );
  `);

  // Topic Assessments - Konu/kazanım bazlı değerlendirmeler
  db.exec(`
    CREATE TABLE IF NOT EXISTS topic_assessments (
      id TEXT PRIMARY KEY,
      assessmentId TEXT NOT NULL,
      studentId TEXT NOT NULL,
      topicId TEXT NOT NULL,
      outcome TEXT,           -- Kazanım kodu veya açıklaması
      score REAL,
      maxScore REAL,
      mastered BOOLEAN DEFAULT FALSE,
      attempts INTEGER DEFAULT 1,
      lastAttemptDate TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (assessmentId) REFERENCES assessments (id) ON DELETE CASCADE,
      FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE CASCADE,
      FOREIGN KEY (topicId) REFERENCES topics (id) ON DELETE CASCADE,
      UNIQUE(assessmentId, studentId, topicId)
    );
  `);

  // Performance Tasks - Performans görevleri ve rubric değerlendirmeleri
  db.exec(`
    CREATE TABLE IF NOT EXISTS performance_tasks (
      id TEXT PRIMARY KEY,
      assessmentId TEXT NOT NULL UNIQUE,
      taskType TEXT,          -- e.g., 'Proje', 'Sunum', 'Araştırma'
      criteria TEXT NOT NULL, -- JSON: rubric criteria and scores
      maxCriteriaScore REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (assessmentId) REFERENCES assessments (id) ON DELETE CASCADE
    );
  `);

  // Performance Task Results
  db.exec(`
    CREATE TABLE IF NOT EXISTS performance_task_results (
      id TEXT PRIMARY KEY,
      performanceTaskId TEXT NOT NULL,
      studentId TEXT NOT NULL,
      assessmentResultId TEXT NOT NULL,
      criteriaScores TEXT,    -- JSON: score for each criterion
      feedback TEXT,
      strengths TEXT,         -- JSON: identified strengths
      improvements TEXT,      -- JSON: areas for improvement
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (performanceTaskId) REFERENCES performance_tasks (id) ON DELETE CASCADE,
      FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE CASCADE,
      FOREIGN KEY (assessmentResultId) REFERENCES assessment_results (id) ON DELETE CASCADE,
      UNIQUE(performanceTaskId, studentId)
    );
  `);

  // Assessment Analysis - AI ve otomatik analizler
  db.exec(`
    CREATE TABLE IF NOT EXISTS assessment_analyses (
      id TEXT PRIMARY KEY,
      assessmentId TEXT,      -- Overall assessment analysis
      studentId TEXT,         -- Student-specific analysis
      analysisType TEXT NOT NULL CHECK (analysisType IN (
        'PERFORMANCE_DROP',   -- Performans düşüşü
        'WEAK_TOPICS',        -- Zayıf konular
        'TREND_ANALYSIS',     -- Trend analizi
        'PEER_COMPARISON',    -- Akran karşılaştırması
        'TARGET_GAP',         -- Hedef-gerçekleşen farkı
        'AI_INSIGHTS'         -- AI önerileri
      )),
      severity TEXT CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
      findings TEXT NOT NULL, -- JSON: detailed findings
      recommendations TEXT,   -- JSON: action recommendations
      generatedBy TEXT,       -- 'ai' or user_id
      generatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      acknowledgedBy TEXT,
      acknowledgedAt DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (assessmentId) REFERENCES assessments (id) ON DELETE CASCADE,
      FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE SET NULL
    );
  `);

  // Indexes for performance
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_assessments_date ON assessments(assessmentDate DESC);
    CREATE INDEX IF NOT EXISTS idx_assessments_type ON assessments(assessmentTypeId);
    CREATE INDEX IF NOT EXISTS idx_assessments_class ON assessments(className);
    CREATE INDEX IF NOT EXISTS idx_assessments_subject ON assessments(subjectId);
    
    CREATE INDEX IF NOT EXISTS idx_assessment_results_student ON assessment_results(studentId);
    CREATE INDEX IF NOT EXISTS idx_assessment_results_assessment ON assessment_results(assessmentId);
    
    CREATE INDEX IF NOT EXISTS idx_mock_exam_results_student ON mock_exam_results(studentId);
    CREATE INDEX IF NOT EXISTS idx_mock_exam_results_exam ON mock_exam_results(mockExamId);
    
    CREATE INDEX IF NOT EXISTS idx_subject_grades_student ON subject_grades(studentId);
    CREATE INDEX IF NOT EXISTS idx_subject_grades_subject ON subject_grades(subjectId);
    CREATE INDEX IF NOT EXISTS idx_subject_grades_semester ON subject_grades(semester, academicYear);
    
    CREATE INDEX IF NOT EXISTS idx_topic_assessments_student ON topic_assessments(studentId);
    CREATE INDEX IF NOT EXISTS idx_topic_assessments_topic ON topic_assessments(topicId);
    
    CREATE INDEX IF NOT EXISTS idx_assessment_analyses_student ON assessment_analyses(studentId);
    CREATE INDEX IF NOT EXISTS idx_assessment_analyses_type ON assessment_analyses(analysisType);
    CREATE INDEX IF NOT EXISTS idx_assessment_analyses_severity ON assessment_analyses(severity);
  `);
}

/**
 * Seed default assessment types
 */
export function seedAssessmentTypes(db: Database.Database): void {
  const stmt = db.prepare(`
    INSERT OR IGNORE INTO assessment_types (id, name, category, subCategory, description)
    VALUES (?, ?, ?, ?, ?)
  `);

  const types = [
    ['yazili-sinav', 'Yazılı Sınav', 'DERS_NOTU', null, 'Okul dersi yazılı sınavı'],
    ['sozlu-sinav', 'Sözlü Sınav', 'DERS_NOTU', null, 'Okul dersi sözlü sınavı'],
    ['performans-notu', 'Performans Notu', 'DERS_NOTU', null, 'Ders performans değerlendirmesi'],
    
    ['deneme-tyt', 'TYT Deneme Sınavı', 'DENEME_SINAVI', 'TYT', 'Üniversite hazırlık TYT denemesi'],
    ['deneme-ayt', 'AYT Deneme Sınavı', 'DENEME_SINAVI', 'AYT', 'Üniversite hazırlık AYT denemesi'],
    ['deneme-lgs', 'LGS Deneme Sınavı', 'DENEME_SINAVI', 'LGS', 'Lise yerleştirme deneme sınavı'],
    
    ['konu-tarama', 'Konu Tarama Testi', 'KONU_TARAMA', null, 'Belirli konularda tarama testi'],
    ['kazanim-testi', 'Kazanım Testi', 'KONU_TARAMA', null, 'Kazanım bazlı değerlendirme'],
    
    ['proje', 'Proje Değerlendirmesi', 'PERFORMANS_GOREVI', null, 'Öğrenci projesi değerlendirmesi'],
    ['sunum', 'Sunum Değerlendirmesi', 'PERFORMANS_GOREVI', null, 'Öğrenci sunumu değerlendirmesi'],
    
    ['merkezi-sinav', 'Merkezi Sınav', 'STANDART_TEST', null, 'Resmi merkezi sınav (LGS, YKS vb.)'],
    ['seviye-tespit', 'Seviye Tespit Sınavı', 'STANDART_TEST', null, 'Öğrenci seviye belirleme sınavı'],
  ];

  const insertTransaction = db.transaction(() => {
    for (const type of types) {
      stmt.run(...type);
    }
  });

  insertTransaction();
}
