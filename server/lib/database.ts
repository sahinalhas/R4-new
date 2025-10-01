import Database from 'better-sqlite3';
import path from 'path';

// Lazy initialization için global değişken
let db: Database.Database | null = null;

// Veritabanı bağlantısını lazy-load yapan fonksiyon
function getDatabase(): Database.Database {
  if (!db) {
    try {
      // SQLite veritabanı bağlantısı
      const dbPath = path.join(process.cwd(), 'data.db');
      db = new Database(dbPath);
      
      // Test database connection
      try {
        db.prepare('SELECT 1').get();
      } catch (connectionError) {
        console.error('Database connection test failed:', connectionError);
        db.close();
        db = null;
        throw new Error('Failed to establish database connection');
      }
      
      // WAL mode ve foreign keys için ayarlar
      try {
        db.pragma('journal_mode = WAL');
        db.pragma('foreign_keys = ON');
      } catch (pragmaError) {
        console.error('Failed to set database pragmas:', pragmaError);
        db.close();
        db = null;
        throw new Error('Failed to configure database settings');
      }

      // Veritabanını ilk erişimde başlat
      try {
        initializeDatabaseTables(db);
        runDatabaseMigrations(db);
        setupDatabaseTriggers(db);
      } catch (initError) {
        console.error('Failed to initialize database schema:', initError);
        db.close();
        db = null;
        throw new Error('Failed to initialize database schema');
      }
    } catch (error) {
      console.error('Error initializing database:', error);
      // Clean up database instance on failure
      if (db) {
        try {
          db.close();
        } catch (closeError) {
          console.error('Error closing database after initialization failure:', closeError);
        }
        db = null;
      }
      throw error;
    }
  }
  return db;
}

// Export the getter function for safe lazy loading
export default getDatabase;

// Veritabanı migration'ları çalıştır
export function runMigrations() {
  const database = getDatabase();
  runDatabaseMigrations(database);
}

// Internal migration function with versioning
function runDatabaseMigrations(database: Database.Database) {
  try {
    // Define all migrations
    const migrations = [
      {
        version: 1,
        name: 'add_gender_column_to_students',
        up: () => {
          const studentCols = database.prepare('PRAGMA table_info(students)').all() as { name: string }[];
          const hasGender = studentCols.some((col) => col.name === 'gender');
          if (!hasGender) {
            database.exec('ALTER TABLE students ADD COLUMN gender TEXT CHECK (gender IN ("K", "E")) DEFAULT "K"');
          }
        }
      },
      {
        version: 2,
        name: 'add_category_column_to_subjects',
        up: () => {
          const subjectCols = database.prepare('PRAGMA table_info(subjects)').all() as { name: string }[];
          const hasCategory = subjectCols.some((col) => col.name === 'category');
          if (!hasCategory) {
            database.exec('ALTER TABLE subjects ADD COLUMN category TEXT CHECK (category IN ("LGS", "YKS", "TYT", "AYT", "YDT"))');
          }
        }
      },
      {
        version: 3,
        name: 'migrate_user_sessions_schema',
        up: () => {
          const tableExists = database.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='user_sessions'").get();
          if (tableExists) {
            const sessionCols = database.prepare('PRAGMA table_info(user_sessions)').all() as { name: string; pk: number }[];
            const hasIdPrimaryKey = sessionCols.some((col) => col.name === 'id' && col.pk === 1);
            if (hasIdPrimaryKey) {
              console.log('Migrating user_sessions table to new schema...');
              database.exec('DROP TABLE IF EXISTS user_sessions');
              database.exec(`
                CREATE TABLE user_sessions (
                  userId TEXT PRIMARY KEY,
                  userData TEXT NOT NULL,
                  demoNoticeSeen BOOLEAN DEFAULT FALSE,
                  lastActive DATETIME DEFAULT CURRENT_TIMESTAMP,
                  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
              `);
              console.log('user_sessions table migrated successfully');
            }
          }
        }
      },
      {
        version: 4,
        name: 'fix_interventions_schema',
        up: () => {
          const tableExists = database.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='interventions'").get();
          if (tableExists) {
            const cols = database.prepare('PRAGMA table_info(interventions)').all() as { name: string }[];
            const hasType = cols.some((col) => col.name === 'type');
            const hasDate = cols.some((col) => col.name === 'date');
            
            // If it has 'type' column (old schema), migrate to new schema with 'date'
            if (hasType && !hasDate) {
              console.log('Migrating interventions table to new schema...');
              
              // Backup existing data
              const existingData = database.prepare('SELECT * FROM interventions').all();
              
              // Drop old table
              database.exec('DROP TABLE interventions');
              
              // Create new schema
              database.exec(`
                CREATE TABLE interventions (
                  id TEXT PRIMARY KEY,
                  studentId TEXT NOT NULL,
                  date TEXT NOT NULL,
                  title TEXT NOT NULL,
                  status TEXT NOT NULL CHECK (status IN ('Planlandı', 'Devam', 'Tamamlandı')),
                  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                  FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE CASCADE
                )
              `);
              
              // Migrate old data to new schema
              const insertStmt = database.prepare('INSERT INTO interventions (id, studentId, date, title, status, created_at) VALUES (?, ?, ?, ?, ?, ?)');
              for (const row of existingData as any[]) {
                insertStmt.run(
                  row.id,
                  row.studentId,
                  row.dueDate || row.created_at || new Date().toISOString(),
                  row.title,
                  row.status === 'planned' ? 'Planlandı' : (row.status === 'completed' ? 'Tamamlandı' : 'Devam'),
                  row.created_at || new Date().toISOString()
                );
              }
              
              console.log('interventions table migrated successfully');
            }
          }
        }
      },
      {
        version: 5,
        name: 'add_avgMinutes_and_order_to_topics',
        up: () => {
          const topicCols = database.prepare('PRAGMA table_info(topics)').all() as { name: string }[];
          const hasAvgMinutes = topicCols.some((col) => col.name === 'avgMinutes');
          const hasOrder = topicCols.some((col) => col.name === 'order');
          
          if (!hasAvgMinutes) {
            database.exec('ALTER TABLE topics ADD COLUMN avgMinutes INTEGER DEFAULT 60');
          }
          if (!hasOrder) {
            database.exec('ALTER TABLE topics ADD COLUMN "order" INTEGER DEFAULT 0');
          }
        }
      },
      {
        version: 6,
        name: 'add_unique_constraint_to_subjects',
        up: () => {
          // Check if unique index already exists
          const indexes = database.prepare('PRAGMA index_list(subjects)').all() as { name: string }[];
          const hasUniqueIndex = indexes.some((idx) => idx.name === 'idx_subjects_name_category_unique');
          
          if (!hasUniqueIndex) {
            console.log('Creating unique index on subjects (name, category)...');
            
            // Pre-clean duplicates before creating unique index
            const allSubjects = database.prepare('SELECT * FROM subjects ORDER BY created_at DESC').all() as any[];
            const seen = new Map<string, string>();
            const toDelete: string[] = [];
            
            for (const subject of allSubjects) {
              const key = `${subject.name}|${subject.category || ''}`;
              if (seen.has(key)) {
                // Duplicate found - keep the first one (most recent due to DESC order)
                toDelete.push(subject.id);
                console.log('  Removing duplicate subject before index creation:', subject.name, subject.category || '(no category)');
              } else {
                seen.set(key, subject.id);
              }
            }
            
            // Delete duplicates
            if (toDelete.length > 0) {
              const deleteStmt = database.prepare('DELETE FROM subjects WHERE id = ?');
              const deleteTx = database.transaction((ids: string[]) => {
                for (const id of ids) {
                  deleteStmt.run(id);
                }
              });
              deleteTx(toDelete);
              console.log('  Removed', toDelete.length, 'duplicate subjects');
            }
            
            // Create unique index
            database.exec('CREATE UNIQUE INDEX idx_subjects_name_category_unique ON subjects(name, COALESCE(category, \'\'))');
            console.log('Unique index created successfully');
          }
        }
      }
    ];

    // Get current migration version
    const getCurrentVersion = () => {
      try {
        const result = database.prepare('SELECT MAX(version) as version FROM schema_migrations').get() as { version: number | null };
        return result.version || 0;
      } catch {
        return 0;
      }
    };

    const currentVersion = getCurrentVersion();
    const recordMigration = database.prepare('INSERT INTO schema_migrations (version, name) VALUES (?, ?)');

    // Run pending migrations
    for (const migration of migrations) {
      if (migration.version > currentVersion) {
        console.log(`Running migration ${migration.version}: ${migration.name}`);
        try {
          migration.up();
          recordMigration.run(migration.version, migration.name);
          console.log(`Migration ${migration.version} completed successfully`);
        } catch (migrationError) {
          console.error(`Migration ${migration.version} failed:`, migrationError);
          throw migrationError;
        }
      }
    }
  } catch (error) {
    console.error('Error running migrations:', error);
    throw error;
  }
}

// Veritabanı şemasını oluştur
export function initializeDatabase() {
  const database = getDatabase();
  initializeDatabaseTables(database);
}

// Internal initialization function
function initializeDatabaseTables(database: Database.Database) {
  // Students tablosu
  database.exec(`
    CREATE TABLE IF NOT EXISTS students (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      birthDate TEXT,
      address TEXT,
      className TEXT,
      enrollmentDate TEXT NOT NULL,
      status TEXT DEFAULT 'active',
      avatar TEXT,
      parentContact TEXT,
      notes TEXT,
      gender TEXT CHECK (gender IN ('K', 'E')) DEFAULT 'K',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Academic records tablosu
  database.exec(`
    CREATE TABLE IF NOT EXISTS academic_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      studentId TEXT NOT NULL,
      semester TEXT NOT NULL,
      gpa REAL,
      year INTEGER,
      exams TEXT, -- JSON format
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE CASCADE
    );
  `);

  // Interventions tablosu
  database.exec(`
    CREATE TABLE IF NOT EXISTS interventions (
      id TEXT PRIMARY KEY,
      studentId TEXT NOT NULL,
      date TEXT NOT NULL,
      title TEXT NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('Planlandı', 'Devam', 'Tamamlandı')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE CASCADE
    );
  `);

  // Subjects tablosu
  database.exec(`
    CREATE TABLE IF NOT EXISTS subjects (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      code TEXT,
      description TEXT,
      color TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Topics tablosu
  database.exec(`
    CREATE TABLE IF NOT EXISTS topics (
      id TEXT PRIMARY KEY,
      subjectId TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      difficulty TEXT,
      estimatedHours INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (subjectId) REFERENCES subjects (id) ON DELETE CASCADE
    );
  `);

  // Progress tablosu (çalışma ilerlemesi)
  database.exec(`
    CREATE TABLE IF NOT EXISTS progress (
      id TEXT PRIMARY KEY,
      studentId TEXT NOT NULL,
      topicId TEXT NOT NULL,
      completed INTEGER DEFAULT 0,
      remaining INTEGER DEFAULT 0,
      lastStudied DATETIME,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE CASCADE,
      FOREIGN KEY (topicId) REFERENCES topics (id) ON DELETE CASCADE,
      UNIQUE(studentId, topicId)
    );
  `);

  // Academic goals tablosu
  database.exec(`
    CREATE TABLE IF NOT EXISTS academic_goals (
      id TEXT PRIMARY KEY,
      studentId TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      targetScore REAL,
      currentScore REAL,
      examType TEXT,
      deadline TEXT,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE CASCADE
    );
  `);

  // Study sessions tablosu
  database.exec(`
    CREATE TABLE IF NOT EXISTS study_sessions (
      id TEXT PRIMARY KEY,
      studentId TEXT NOT NULL,
      topicId TEXT NOT NULL,
      startTime DATETIME NOT NULL,
      endTime DATETIME,
      duration INTEGER, -- dakika cinsinden
      notes TEXT,
      efficiency REAL, -- 0-1 arası
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE CASCADE,
      FOREIGN KEY (topicId) REFERENCES topics (id) ON DELETE CASCADE
    );
  `);

  // Notes tablosu
  database.exec(`
    CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY,
      studentId TEXT NOT NULL,
      title TEXT NOT NULL,
      content TEXT,
      category TEXT,
      tags TEXT, -- JSON array
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE CASCADE
    );
  `);

  // Anket şablonları tablosu
  database.exec(`
    CREATE TABLE IF NOT EXISTS survey_templates (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      type TEXT NOT NULL, -- 'MEB_STANDAR', 'OZEL', 'AKADEMIK', 'SOSYAL', 'REHBERLIK'
      mebCompliant BOOLEAN DEFAULT FALSE,
      isActive BOOLEAN DEFAULT TRUE,
      createdBy TEXT,
      tags TEXT, -- JSON array
      estimatedDuration INTEGER, -- dakika
      targetGrades TEXT, -- JSON array: ['9', '10', '11', '12']
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Anket soruları tablosu
  database.exec(`
    CREATE TABLE IF NOT EXISTS survey_questions (
      id TEXT PRIMARY KEY,
      templateId TEXT NOT NULL,
      questionText TEXT NOT NULL,
      questionType TEXT NOT NULL, -- 'MULTIPLE_CHOICE', 'OPEN_ENDED', 'LIKERT', 'YES_NO', 'RATING', 'DROPDOWN'
      required BOOLEAN DEFAULT FALSE,
      orderIndex INTEGER NOT NULL,
      options TEXT, -- JSON array for multiple choice, likert scales etc
      validation TEXT, -- JSON object for validation rules
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (templateId) REFERENCES survey_templates (id) ON DELETE CASCADE
    );
  `);

  // Anket dağıtımları tablosu
  database.exec(`
    CREATE TABLE IF NOT EXISTS survey_distributions (
      id TEXT PRIMARY KEY,
      templateId TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      targetClasses TEXT, -- JSON array: ['9/A', '10/B']
      targetStudents TEXT, -- JSON array of student IDs
      distributionType TEXT NOT NULL, -- 'MANUAL_EXCEL', 'ONLINE_LINK', 'HYBRID'
      excelTemplate TEXT, -- Base64 encoded Excel file
      publicLink TEXT, -- UUID for public access
      startDate TEXT,
      endDate TEXT,
      allowAnonymous BOOLEAN DEFAULT FALSE,
      maxResponses INTEGER,
      status TEXT DEFAULT 'DRAFT', -- 'DRAFT', 'ACTIVE', 'CLOSED', 'ARCHIVED'
      createdBy TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (templateId) REFERENCES survey_templates (id) ON DELETE CASCADE
    );
  `);

  // Anket yanıtları tablosu
  database.exec(`
    CREATE TABLE IF NOT EXISTS survey_responses (
      id TEXT PRIMARY KEY,
      distributionId TEXT NOT NULL,
      studentId TEXT, -- NULL for anonymous responses
      studentInfo TEXT, -- JSON for manual entry: {name, class, number}
      responseData TEXT NOT NULL, -- JSON object with question IDs as keys
      submissionType TEXT NOT NULL, -- 'ONLINE', 'EXCEL_UPLOAD', 'MANUAL_ENTRY'
      isComplete BOOLEAN DEFAULT FALSE,
      submittedAt DATETIME,
      ipAddress TEXT,
      userAgent TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (distributionId) REFERENCES survey_distributions (id) ON DELETE CASCADE,
      FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE SET NULL
    );
  `);

  // Legacy surveys tablosu - backward compatibility için korunuyor
  database.exec(`
    CREATE TABLE IF NOT EXISTS surveys (
      id TEXT PRIMARY KEY,
      studentId TEXT NOT NULL,
      type TEXT NOT NULL,
      questions TEXT NOT NULL, -- JSON format
      responses TEXT, -- JSON format
      completed BOOLEAN DEFAULT FALSE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE CASCADE
    );
  `);

  // Attendance tablosu
  database.exec(`
    CREATE TABLE IF NOT EXISTS attendance (
      id TEXT PRIMARY KEY,
      studentId TEXT NOT NULL,
      date TEXT NOT NULL,
      status TEXT NOT NULL,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE CASCADE
    );
  `);

  // Meeting notes tablosu - Görüşme notları
  database.exec(`
    CREATE TABLE IF NOT EXISTS meeting_notes (
      id TEXT PRIMARY KEY,
      studentId TEXT NOT NULL,
      date TEXT NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('Bireysel', 'Grup', 'Veli')),
      note TEXT NOT NULL,
      plan TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE CASCADE
    );
  `);

  // Student documents tablosu - Öğrenci dokümanları
  database.exec(`
    CREATE TABLE IF NOT EXISTS student_documents (
      id TEXT PRIMARY KEY,
      studentId TEXT NOT NULL,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      dataUrl TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE CASCADE
    );
  `);

  // App settings tablosu - Uygulama ayarları
  database.exec(`
    CREATE TABLE IF NOT EXISTS app_settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      settings TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Study assignments tablosu - Çalışma ödevleri
  database.exec(`
    CREATE TABLE IF NOT EXISTS study_assignments (
      id TEXT PRIMARY KEY,
      studentId TEXT NOT NULL,
      topicId TEXT NOT NULL,
      dueDate TEXT NOT NULL,
      status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'overdue')),
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE CASCADE,
      FOREIGN KEY (topicId) REFERENCES topics (id) ON DELETE CASCADE
    );
  `);

  // Weekly slots tablosu - Haftalık çalışma programı
  database.exec(`
    CREATE TABLE IF NOT EXISTS weekly_slots (
      id TEXT PRIMARY KEY,
      studentId TEXT NOT NULL,
      day INTEGER NOT NULL CHECK (day >= 1 AND day <= 7),
      startTime TEXT NOT NULL,
      endTime TEXT NOT NULL,
      subjectId TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE CASCADE,
      FOREIGN KEY (subjectId) REFERENCES subjects (id) ON DELETE CASCADE
    );
  `);

  // User sessions tablosu - Kullanıcı oturum verileri
  database.exec(`
    CREATE TABLE IF NOT EXISTS user_sessions (
      userId TEXT PRIMARY KEY,
      userData TEXT NOT NULL,
      demoNoticeSeen BOOLEAN DEFAULT FALSE,
      lastActive DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Database migrations tracking table
  database.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Multiple Intelligence tablosu - Çoklu Zeka Değerlendirmeleri
  database.exec(`
    CREATE TABLE IF NOT EXISTS multiple_intelligence (
      id TEXT PRIMARY KEY,
      studentId TEXT NOT NULL,
      assessmentDate TEXT NOT NULL,
      linguisticVerbal INTEGER NOT NULL CHECK (linguisticVerbal >= 0 AND linguisticVerbal <= 100),
      logicalMathematical INTEGER NOT NULL CHECK (logicalMathematical >= 0 AND logicalMathematical <= 100),
      visualSpatial INTEGER NOT NULL CHECK (visualSpatial >= 0 AND visualSpatial <= 100),
      bodilyKinesthetic INTEGER NOT NULL CHECK (bodilyKinesthetic >= 0 AND bodilyKinesthetic <= 100),
      musicalRhythmic INTEGER NOT NULL CHECK (musicalRhythmic >= 0 AND musicalRhythmic <= 100),
      interpersonal INTEGER NOT NULL CHECK (interpersonal >= 0 AND interpersonal <= 100),
      intrapersonal INTEGER NOT NULL CHECK (intrapersonal >= 0 AND intrapersonal <= 100),
      naturalistic INTEGER NOT NULL CHECK (naturalistic >= 0 AND naturalistic <= 100),
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE CASCADE
    );
  `);

  // Learning Styles tablosu - Öğrenme Stilleri
  database.exec(`
    CREATE TABLE IF NOT EXISTS learning_styles (
      id TEXT PRIMARY KEY,
      studentId TEXT NOT NULL,
      assessmentDate TEXT NOT NULL,
      visual INTEGER NOT NULL CHECK (visual >= 0 AND visual <= 100),
      auditory INTEGER NOT NULL CHECK (auditory >= 0 AND auditory <= 100),
      kinesthetic INTEGER NOT NULL CHECK (kinesthetic >= 0 AND kinesthetic <= 100),
      reading INTEGER NOT NULL CHECK (reading >= 0 AND reading <= 100),
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE CASCADE
    );
  `);

  // SMART Goals tablosu - SMART Hedefler
  database.exec(`
    CREATE TABLE IF NOT EXISTS smart_goals (
      id TEXT PRIMARY KEY,
      studentId TEXT NOT NULL,
      title TEXT NOT NULL,
      specific TEXT,
      measurable TEXT,
      achievable TEXT,
      relevant TEXT,
      timeBound TEXT,
      category TEXT,
      status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
      progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
      startDate TEXT,
      targetDate TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE CASCADE
    );
  `);

  // Coaching Recommendations tablosu - Koçluk Önerileri
  database.exec(`
    CREATE TABLE IF NOT EXISTS coaching_recommendations (
      id TEXT PRIMARY KEY,
      studentId TEXT NOT NULL,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      priority TEXT CHECK (priority IN ('Düşük', 'Orta', 'Yüksek')),
      status TEXT DEFAULT 'Öneri' CHECK (status IN ('Öneri', 'Planlandı', 'Uygulanıyor', 'Tamamlandı', 'İptal')),
      automated BOOLEAN DEFAULT FALSE,
      implementationSteps TEXT,
      createdAt TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE CASCADE
    );
  `);

  // 360 Evaluations tablosu - 360 Derece Değerlendirmeler
  database.exec(`
    CREATE TABLE IF NOT EXISTS evaluations_360 (
      id TEXT PRIMARY KEY,
      studentId TEXT NOT NULL,
      evaluationDate TEXT NOT NULL,
      selfEvaluation TEXT,
      teacherEvaluation TEXT,
      peerEvaluation TEXT,
      parentEvaluation TEXT,
      strengths TEXT,
      areasForImprovement TEXT,
      actionPlan TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE CASCADE
    );
  `);

  // Achievements tablosu - Başarılar
  database.exec(`
    CREATE TABLE IF NOT EXISTS achievements (
      id TEXT PRIMARY KEY,
      studentId TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT,
      earnedAt TEXT NOT NULL,
      points INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE CASCADE
    );
  `);

  // Self Assessments tablosu - Öz Değerlendirmeler
  database.exec(`
    CREATE TABLE IF NOT EXISTS self_assessments (
      id TEXT PRIMARY KEY,
      studentId TEXT NOT NULL,
      moodRating INTEGER NOT NULL CHECK (moodRating >= 1 AND moodRating <= 10),
      motivationLevel INTEGER NOT NULL CHECK (motivationLevel >= 1 AND motivationLevel <= 10),
      stressLevel INTEGER NOT NULL CHECK (stressLevel >= 1 AND stressLevel <= 10),
      confidenceLevel INTEGER NOT NULL CHECK (confidenceLevel >= 1 AND confidenceLevel <= 10),
      studyDifficulty INTEGER NOT NULL CHECK (studyDifficulty >= 1 AND studyDifficulty <= 10),
      socialInteraction INTEGER NOT NULL CHECK (socialInteraction >= 1 AND socialInteraction <= 10),
      sleepQuality INTEGER NOT NULL CHECK (sleepQuality >= 1 AND sleepQuality <= 10),
      physicalActivity INTEGER NOT NULL CHECK (physicalActivity >= 1 AND physicalActivity <= 10),
      dailyGoalsAchieved INTEGER NOT NULL CHECK (dailyGoalsAchieved >= 0 AND dailyGoalsAchieved <= 100),
      todayHighlight TEXT,
      todayChallenge TEXT,
      tomorrowGoal TEXT,
      notes TEXT,
      assessmentDate TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE CASCADE
    );
  `);

  // Parent Meetings tablosu - Veli Görüşmeleri
  database.exec(`
    CREATE TABLE IF NOT EXISTS parent_meetings (
      id TEXT PRIMARY KEY,
      studentId TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('YÜZ_YÜZE', 'TELEFON', 'ONLINE', 'EV_ZİYARETİ')),
      participants TEXT NOT NULL,
      mainTopics TEXT NOT NULL,
      concerns TEXT,
      decisions TEXT,
      actionPlan TEXT,
      nextMeetingDate TEXT,
      parentSatisfaction INTEGER CHECK (parentSatisfaction >= 1 AND parentSatisfaction <= 10),
      followUpRequired BOOLEAN DEFAULT FALSE,
      notes TEXT,
      createdBy TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE CASCADE
    );
  `);

  // Home Visits tablosu - Ev Ziyaretleri
  database.exec(`
    CREATE TABLE IF NOT EXISTS home_visits (
      id TEXT PRIMARY KEY,
      studentId TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      visitDuration INTEGER NOT NULL,
      visitors TEXT NOT NULL,
      familyPresent TEXT NOT NULL,
      homeEnvironment TEXT NOT NULL CHECK (homeEnvironment IN ('UYGUN', 'ORTA', 'ZOR_KOŞULLAR', 'DEĞERLENDİRİLEMEDİ')),
      familyInteraction TEXT NOT NULL CHECK (familyInteraction IN ('OLUMLU', 'NORMAL', 'GERGİN', 'İŞBİRLİKSİZ')),
      observations TEXT NOT NULL,
      recommendations TEXT NOT NULL,
      concerns TEXT,
      resources TEXT,
      followUpActions TEXT,
      nextVisitPlanned TEXT,
      notes TEXT,
      createdBy TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE CASCADE
    );
  `);

  // Family Participation tablosu - Aile Katılım Durumu
  database.exec(`
    CREATE TABLE IF NOT EXISTS family_participation (
      id TEXT PRIMARY KEY,
      studentId TEXT NOT NULL,
      eventType TEXT NOT NULL CHECK (eventType IN ('VELI_TOPLANTISI', 'OKUL_ETKİNLİĞİ', 'ÖĞRETMEN_GÖRÜŞMESİ', 'PERFORMANS_DEĞERLENDİRME', 'DİĞER')),
      eventName TEXT NOT NULL,
      eventDate TEXT NOT NULL,
      participationStatus TEXT NOT NULL CHECK (participationStatus IN ('KATILDI', 'KATILMADI', 'GEÇ_KATILDI', 'ERKEN_AYRILDI')),
      participants TEXT,
      engagementLevel TEXT NOT NULL CHECK (engagementLevel IN ('ÇOK_AKTİF', 'AKTİF', 'PASİF', 'İLGİSİZ')),
      communicationFrequency TEXT NOT NULL CHECK (communicationFrequency IN ('GÜNLÜK', 'HAFTALIK', 'AYLIK', 'SADECE_GEREKENDE')),
      preferredContactMethod TEXT NOT NULL CHECK (preferredContactMethod IN ('TELEFON', 'EMAIL', 'WHATSAPP', 'YÜZ_YÜZE', 'OKUL_SISTEMI')),
      parentAvailability TEXT,
      notes TEXT,
      recordedBy TEXT NOT NULL,
      recordedAt TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE CASCADE
    );
  `);

  // Health Info tablosu - Sağlık Bilgileri ve Acil Durum
  database.exec(`
    CREATE TABLE IF NOT EXISTS health_info (
      id TEXT PRIMARY KEY,
      studentId TEXT NOT NULL UNIQUE,
      bloodType TEXT CHECK (bloodType IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'BELİRTİLMEMİŞ')),
      chronicDiseases TEXT,
      allergies TEXT,
      medications TEXT,
      specialNeeds TEXT,
      medicalHistory TEXT,
      emergencyContact1Name TEXT,
      emergencyContact1Phone TEXT,
      emergencyContact1Relation TEXT,
      emergencyContact2Name TEXT,
      emergencyContact2Phone TEXT,
      emergencyContact2Relation TEXT,
      physicianName TEXT,
      physicianPhone TEXT,
      insuranceInfo TEXT,
      vaccinations TEXT,
      dietaryRestrictions TEXT,
      physicalLimitations TEXT,
      mentalHealthNotes TEXT,
      lastHealthCheckup TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE CASCADE
    );
  `);

  // Special Education tablosu - Özel Eğitim İhtiyaçları (BEP)
  database.exec(`
    CREATE TABLE IF NOT EXISTS special_education (
      id TEXT PRIMARY KEY,
      studentId TEXT NOT NULL,
      hasIEP BOOLEAN DEFAULT FALSE,
      iepStartDate TEXT,
      iepEndDate TEXT,
      iepGoals TEXT,
      diagnosis TEXT,
      ramReportDate TEXT,
      ramReportSummary TEXT,
      supportServices TEXT,
      accommodations TEXT,
      modifications TEXT,
      progressNotes TEXT,
      evaluationSchedule TEXT,
      specialistContacts TEXT,
      parentInvolvement TEXT,
      transitionPlan TEXT,
      assistiveTechnology TEXT,
      behavioralSupport TEXT,
      status TEXT DEFAULT 'AKTİF' CHECK (status IN ('AKTİF', 'TAMAMLANMIŞ', 'REVİZYON_GEREKLİ', 'ASKIDA')),
      nextReviewDate TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE CASCADE
    );
  `);

  // Risk Factors tablosu - Risk Faktörleri ve Erken Uyarı Sistemi
  database.exec(`
    CREATE TABLE IF NOT EXISTS risk_factors (
      id TEXT PRIMARY KEY,
      studentId TEXT NOT NULL,
      assessmentDate TEXT NOT NULL,
      academicRiskLevel TEXT NOT NULL CHECK (academicRiskLevel IN ('DÜŞÜK', 'ORTA', 'YÜKSEK', 'KRİTİK')),
      behavioralRiskLevel TEXT NOT NULL CHECK (behavioralRiskLevel IN ('DÜŞÜK', 'ORTA', 'YÜKSEK', 'KRİTİK')),
      attendanceRiskLevel TEXT NOT NULL CHECK (attendanceRiskLevel IN ('DÜŞÜK', 'ORTA', 'YÜKSEK', 'KRİTİK')),
      socialEmotionalRiskLevel TEXT NOT NULL CHECK (socialEmotionalRiskLevel IN ('DÜŞÜK', 'ORTA', 'YÜKSEK', 'KRİTİK')),
      dropoutRisk INTEGER CHECK (dropoutRisk >= 0 AND dropoutRisk <= 100),
      academicFactors TEXT,
      behavioralFactors TEXT,
      attendanceFactors TEXT,
      socialFactors TEXT,
      familyFactors TEXT,
      protectiveFactors TEXT,
      interventionsNeeded TEXT,
      alertsGenerated TEXT,
      followUpActions TEXT,
      assignedCounselor TEXT,
      parentNotified BOOLEAN DEFAULT FALSE,
      parentNotificationDate TEXT,
      overallRiskScore INTEGER CHECK (overallRiskScore >= 0 AND overallRiskScore <= 100),
      status TEXT DEFAULT 'DEVAM_EDEN' CHECK (status IN ('YENİ', 'DEVAM_EDEN', 'İYİLEŞME', 'ÇÖZÜLDÜ')),
      nextAssessmentDate TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE CASCADE
    );
  `);

  // Behavior Incidents tablosu - Davranış Takibi
  database.exec(`
    CREATE TABLE IF NOT EXISTS behavior_incidents (
      id TEXT PRIMARY KEY,
      studentId TEXT NOT NULL,
      incidentDate TEXT NOT NULL,
      incidentTime TEXT NOT NULL,
      location TEXT NOT NULL,
      behaviorType TEXT NOT NULL CHECK (behaviorType IN ('OLUMLU', 'KÜÇÜK_İHLAL', 'ORTA_DÜZEY', 'CİDDİ', 'ÇOK_CİDDİ')),
      behaviorCategory TEXT NOT NULL,
      description TEXT NOT NULL,
      antecedent TEXT,
      consequence TEXT,
      duration INTEGER,
      intensity TEXT CHECK (intensity IN ('DÜŞÜK', 'ORTA', 'YÜKSEK')),
      frequency TEXT,
      witnessedBy TEXT,
      othersInvolved TEXT,
      interventionUsed TEXT,
      interventionEffectiveness TEXT CHECK (interventionEffectiveness IN ('ÇOK_ETKİLİ', 'ETKİLİ', 'KISMEN_ETKİLİ', 'ETKİSİZ')),
      parentNotified BOOLEAN DEFAULT FALSE,
      parentNotificationMethod TEXT,
      parentResponse TEXT,
      followUpRequired BOOLEAN DEFAULT FALSE,
      followUpDate TEXT,
      followUpNotes TEXT,
      adminNotified BOOLEAN DEFAULT FALSE,
      consequenceGiven TEXT,
      supportProvided TEXT,
      triggerAnalysis TEXT,
      patternNotes TEXT,
      positiveAlternative TEXT,
      status TEXT DEFAULT 'AÇIK' CHECK (status IN ('AÇIK', 'DEVAM_EDIYOR', 'ÇÖZÜLDÜ', 'İZLENIYOR')),
      recordedBy TEXT NOT NULL,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE CASCADE
    );
  `);

  // Exam Results tablosu - Test Sonuçları (LGS/YKS)
  database.exec(`
    CREATE TABLE IF NOT EXISTS exam_results (
      id TEXT PRIMARY KEY,
      studentId TEXT NOT NULL,
      examType TEXT NOT NULL CHECK (examType IN ('LGS', 'YKS', 'TYT', 'AYT', 'YDT', 'DENEME', 'KONU_TARAMA', 'DİĞER')),
      examName TEXT NOT NULL,
      examDate TEXT NOT NULL,
      examProvider TEXT,
      totalScore REAL,
      percentileRank REAL,
      turkishScore REAL,
      mathScore REAL,
      scienceScore REAL,
      socialScore REAL,
      foreignLanguageScore REAL,
      turkishNet REAL,
      mathNet REAL,
      scienceNet REAL,
      socialNet REAL,
      foreignLanguageNet REAL,
      totalNet REAL,
      correctAnswers INTEGER,
      wrongAnswers INTEGER,
      emptyAnswers INTEGER,
      totalQuestions INTEGER,
      subjectBreakdown TEXT,
      topicAnalysis TEXT,
      strengthAreas TEXT,
      weaknessAreas TEXT,
      improvementSuggestions TEXT,
      comparedToGoal TEXT,
      comparedToPrevious TEXT,
      comparedToClassAverage REAL,
      schoolRank INTEGER,
      classRank INTEGER,
      isOfficial BOOLEAN DEFAULT FALSE,
      certificateUrl TEXT,
      answerKeyUrl TEXT,
      detailedReportUrl TEXT,
      goalsMet BOOLEAN DEFAULT FALSE,
      parentNotified BOOLEAN DEFAULT FALSE,
      counselorNotes TEXT,
      actionPlan TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE CASCADE
    );
  `);

}

// Veritabanını kapat
export function closeDatabase() {
  const database = getDatabase();
  database.close();
}

// Trigger oluştur - updated_at alanlarını otomatik güncelle
export function setupTriggers() {
  const database = getDatabase();
  setupDatabaseTriggers(database);
}

// Internal trigger setup function
function setupDatabaseTriggers(database: Database.Database) {
  
  database.exec(`
    CREATE TRIGGER IF NOT EXISTS update_students_timestamp 
    AFTER UPDATE ON students 
    BEGIN 
      UPDATE students SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id; 
    END;
  `);

  database.exec(`
    CREATE TRIGGER IF NOT EXISTS update_progress_timestamp 
    AFTER UPDATE ON progress 
    BEGIN 
      UPDATE progress SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id; 
    END;
  `);

  database.exec(`
    CREATE TRIGGER IF NOT EXISTS update_academic_goals_timestamp 
    AFTER UPDATE ON academic_goals 
    BEGIN 
      UPDATE academic_goals SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id; 
    END;
  `);

  database.exec(`
    CREATE TRIGGER IF NOT EXISTS update_notes_timestamp 
    AFTER UPDATE ON notes 
    BEGIN 
      UPDATE notes SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id; 
    END;
  `);

  database.exec(`
    CREATE TRIGGER IF NOT EXISTS update_surveys_timestamp 
    AFTER UPDATE ON surveys 
    BEGIN 
      UPDATE surveys SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id; 
    END;
  `);

  database.exec(`
    CREATE TRIGGER IF NOT EXISTS update_meeting_notes_timestamp 
    AFTER UPDATE ON meeting_notes 
    BEGIN 
      UPDATE meeting_notes SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id; 
    END;
  `);

  database.exec(`
    CREATE TRIGGER IF NOT EXISTS update_app_settings_timestamp 
    AFTER UPDATE ON app_settings 
    BEGIN 
      UPDATE app_settings SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id; 
    END;
  `);

  database.exec(`
    CREATE TRIGGER IF NOT EXISTS update_user_sessions_timestamp 
    AFTER UPDATE ON user_sessions 
    BEGIN 
      UPDATE user_sessions SET updated_at = CURRENT_TIMESTAMP WHERE userId = NEW.userId; 
    END;
  `);

  database.exec(`
    CREATE TRIGGER IF NOT EXISTS update_smart_goals_timestamp 
    AFTER UPDATE ON smart_goals 
    BEGIN 
      UPDATE smart_goals SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id; 
    END;
  `);

  database.exec(`
    CREATE TRIGGER IF NOT EXISTS update_coaching_recommendations_timestamp 
    AFTER UPDATE ON coaching_recommendations 
    BEGIN 
      UPDATE coaching_recommendations SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id; 
    END;
  `);

  database.exec(`
    CREATE TRIGGER IF NOT EXISTS update_parent_meetings_timestamp 
    AFTER UPDATE ON parent_meetings 
    BEGIN 
      UPDATE parent_meetings SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id; 
    END;
  `);

  database.exec(`
    CREATE TRIGGER IF NOT EXISTS update_home_visits_timestamp 
    AFTER UPDATE ON home_visits 
    BEGIN 
      UPDATE home_visits SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id; 
    END;
  `);

  database.exec(`
    CREATE TRIGGER IF NOT EXISTS update_family_participation_timestamp 
    AFTER UPDATE ON family_participation 
    BEGIN 
      UPDATE family_participation SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id; 
    END;
  `);

  database.exec(`
    CREATE TRIGGER IF NOT EXISTS update_health_info_timestamp 
    AFTER UPDATE ON health_info 
    BEGIN 
      UPDATE health_info SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id; 
    END;
  `);

  database.exec(`
    CREATE TRIGGER IF NOT EXISTS update_special_education_timestamp 
    AFTER UPDATE ON special_education 
    BEGIN 
      UPDATE special_education SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id; 
    END;
  `);

  database.exec(`
    CREATE TRIGGER IF NOT EXISTS update_risk_factors_timestamp 
    AFTER UPDATE ON risk_factors 
    BEGIN 
      UPDATE risk_factors SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id; 
    END;
  `);

  database.exec(`
    CREATE TRIGGER IF NOT EXISTS update_behavior_incidents_timestamp 
    AFTER UPDATE ON behavior_incidents 
    BEGIN 
      UPDATE behavior_incidents SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id; 
    END;
  `);

  database.exec(`
    CREATE TRIGGER IF NOT EXISTS update_exam_results_timestamp 
    AFTER UPDATE ON exam_results 
    BEGIN 
      UPDATE exam_results SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id; 
    END;
  `);

  // Setup performance indexes
  setupDatabaseIndexes(database);
}

// Create performance indexes on foreign keys and frequently queried columns
function setupDatabaseIndexes(database: Database.Database) {
  // Students table indexes for filtering
  database.exec('CREATE INDEX IF NOT EXISTS idx_students_sinif ON students(sinif)');
  database.exec('CREATE INDEX IF NOT EXISTS idx_students_cinsiyet ON students(cinsiyet)');
  database.exec('CREATE INDEX IF NOT EXISTS idx_students_risk ON students(risk)');
  database.exec('CREATE INDEX IF NOT EXISTS idx_students_sinif_cinsiyet ON students(sinif, cinsiyet)');
  
  // Student-related indexes
  database.exec('CREATE INDEX IF NOT EXISTS idx_meeting_notes_studentId ON meeting_notes(studentId)');
  database.exec('CREATE INDEX IF NOT EXISTS idx_attendance_studentId ON attendance(studentId)');
  database.exec('CREATE INDEX IF NOT EXISTS idx_academic_records_studentId ON academic_records(studentId)');
  database.exec('CREATE INDEX IF NOT EXISTS idx_interventions_studentId ON interventions(studentId)');
  database.exec('CREATE INDEX IF NOT EXISTS idx_student_documents_studentId ON student_documents(studentId)');
  database.exec('CREATE INDEX IF NOT EXISTS idx_progress_studentId ON progress(studentId)');
  database.exec('CREATE INDEX IF NOT EXISTS idx_academic_goals_studentId ON academic_goals(studentId)');
  database.exec('CREATE INDEX IF NOT EXISTS idx_study_sessions_studentId ON study_sessions(studentId)');
  database.exec('CREATE INDEX IF NOT EXISTS idx_notes_studentId ON notes(studentId)');
  database.exec('CREATE INDEX IF NOT EXISTS idx_multiple_intelligence_studentId ON multiple_intelligence(studentId)');
  database.exec('CREATE INDEX IF NOT EXISTS idx_learning_styles_studentId ON learning_styles(studentId)');
  database.exec('CREATE INDEX IF NOT EXISTS idx_smart_goals_studentId ON smart_goals(studentId)');
  database.exec('CREATE INDEX IF NOT EXISTS idx_coaching_recommendations_studentId ON coaching_recommendations(studentId)');
  database.exec('CREATE INDEX IF NOT EXISTS idx_evaluations_360_studentId ON evaluations_360(studentId)');
  database.exec('CREATE INDEX IF NOT EXISTS idx_achievements_studentId ON achievements(studentId)');
  database.exec('CREATE INDEX IF NOT EXISTS idx_self_assessments_studentId ON self_assessments(studentId)');
  database.exec('CREATE INDEX IF NOT EXISTS idx_parent_meetings_studentId ON parent_meetings(studentId)');
  database.exec('CREATE INDEX IF NOT EXISTS idx_home_visits_studentId ON home_visits(studentId)');
  database.exec('CREATE INDEX IF NOT EXISTS idx_family_participation_studentId ON family_participation(studentId)');
  database.exec('CREATE INDEX IF NOT EXISTS idx_study_assignments_studentId ON study_assignments(studentId)');
  database.exec('CREATE INDEX IF NOT EXISTS idx_weekly_slots_studentId ON weekly_slots(studentId)');
  database.exec('CREATE INDEX IF NOT EXISTS idx_surveys_studentId ON surveys(studentId)');
  database.exec('CREATE INDEX IF NOT EXISTS idx_survey_responses_studentId ON survey_responses(studentId)');
  database.exec('CREATE INDEX IF NOT EXISTS idx_health_info_studentId ON health_info(studentId)');
  database.exec('CREATE INDEX IF NOT EXISTS idx_special_education_studentId ON special_education(studentId)');
  database.exec('CREATE INDEX IF NOT EXISTS idx_risk_factors_studentId ON risk_factors(studentId)');
  database.exec('CREATE INDEX IF NOT EXISTS idx_behavior_incidents_studentId ON behavior_incidents(studentId)');
  database.exec('CREATE INDEX IF NOT EXISTS idx_exam_results_studentId ON exam_results(studentId)');
  
  // Survey-related indexes
  database.exec('CREATE INDEX IF NOT EXISTS idx_survey_questions_templateId ON survey_questions(templateId)');
  database.exec('CREATE INDEX IF NOT EXISTS idx_survey_distributions_templateId ON survey_distributions(templateId)');
  database.exec('CREATE INDEX IF NOT EXISTS idx_survey_responses_distributionId ON survey_responses(distributionId)');
  
  // Topic and subject indexes
  database.exec('CREATE INDEX IF NOT EXISTS idx_topics_subjectId ON topics(subjectId)');
  database.exec('CREATE INDEX IF NOT EXISTS idx_progress_topicId ON progress(topicId)');
  database.exec('CREATE INDEX IF NOT EXISTS idx_study_sessions_topicId ON study_sessions(topicId)');
  database.exec('CREATE INDEX IF NOT EXISTS idx_study_assignments_topicId ON study_assignments(topicId)');
  database.exec('CREATE INDEX IF NOT EXISTS idx_weekly_slots_subjectId ON weekly_slots(subjectId)');
  
  // Date indexes for time-based queries
  database.exec('CREATE INDEX IF NOT EXISTS idx_meeting_notes_date ON meeting_notes(date)');
  database.exec('CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date)');
  database.exec('CREATE INDEX IF NOT EXISTS idx_interventions_date ON interventions(date)');
  database.exec('CREATE INDEX IF NOT EXISTS idx_risk_factors_assessmentDate ON risk_factors(assessmentDate)');
  database.exec('CREATE INDEX IF NOT EXISTS idx_behavior_incidents_incidentDate ON behavior_incidents(incidentDate)');
  database.exec('CREATE INDEX IF NOT EXISTS idx_exam_results_examDate ON exam_results(examDate)');
  
  // Composite indexes for common query patterns
  database.exec('CREATE INDEX IF NOT EXISTS idx_progress_student_topic ON progress(studentId, topicId)');
  database.exec('CREATE INDEX IF NOT EXISTS idx_attendance_student_date ON attendance(studentId, date)');
  database.exec('CREATE INDEX IF NOT EXISTS idx_exam_results_student_date ON exam_results(studentId, examDate)');
  database.exec('CREATE INDEX IF NOT EXISTS idx_exam_results_type ON exam_results(examType)');
}

// Database backup utilities
export function createBackup(backupPath?: string): string {
  const database = getDatabase();
  const fs = require('fs');
  const path = require('path');
  
  // Default backup path with timestamp
  if (!backupPath) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const backupsDir = path.join(process.cwd(), 'backups');
    
    // Create backups directory if it doesn't exist
    if (!fs.existsSync(backupsDir)) {
      fs.mkdirSync(backupsDir, { recursive: true });
    }
    
    backupPath = path.join(backupsDir, `backup-${timestamp}.db`);
  }
  
  try {
    // Use SQLite's VACUUM INTO for efficient backup
    database.prepare(`VACUUM INTO ?`).run(backupPath);
    console.log(`Database backup created: ${backupPath}`);
    return backupPath;
  } catch (error) {
    console.error('Error creating backup:', error);
    throw error;
  }
}

// Auto-cleanup old backups (keep last N backups)
export function cleanupOldBackups(keepCount: number = 10): void {
  const fs = require('fs');
  const path = require('path');
  
  const backupsDir = path.join(process.cwd(), 'backups');
  
  if (!fs.existsSync(backupsDir)) {
    return;
  }
  
  try {
    const files = fs.readdirSync(backupsDir)
      .filter((file: string) => file.endsWith('.db'))
      .map((file: string) => ({
        name: file,
        path: path.join(backupsDir, file),
        time: fs.statSync(path.join(backupsDir, file)).mtime.getTime()
      }))
      .sort((a: any, b: any) => b.time - a.time);
    
    // Delete old backups
    if (files.length > keepCount) {
      const filesToDelete = files.slice(keepCount);
      filesToDelete.forEach((file: any) => {
        fs.unlinkSync(file.path);
        console.log(`Deleted old backup: ${file.name}`);
      });
    }
  } catch (error) {
    console.error('Error cleaning up old backups:', error);
  }
}

// Schedule automatic backups (call this on server startup)
export function scheduleAutoBackup(intervalHours: number = 24): NodeJS.Timeout {
  const intervalMs = intervalHours * 60 * 60 * 1000;
  
  // Create initial backup
  createBackup();
  cleanupOldBackups();
  
  // Schedule periodic backups
  const backupInterval = setInterval(() => {
    try {
      createBackup();
      cleanupOldBackups();
    } catch (error) {
      console.error('Scheduled backup failed:', error);
    }
  }, intervalMs);
  
  console.log(`Automatic backups scheduled every ${intervalHours} hours`);
  return backupInterval;
}