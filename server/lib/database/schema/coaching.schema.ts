import type Database from 'better-sqlite3';

export function createCoachingTables(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS multiple_intelligence (
      id TEXT PRIMARY KEY,
      studentId TEXT NOT NULL,
      linguistic REAL DEFAULT 0,
      logicalMathematical REAL DEFAULT 0,
      spatial REAL DEFAULT 0,
      musicalRhythmic REAL DEFAULT 0,
      bodilyKinesthetic REAL DEFAULT 0,
      interpersonal REAL DEFAULT 0,
      intrapersonal REAL DEFAULT 0,
      naturalist REAL DEFAULT 0,
      notes TEXT,
      assessmentDate TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE CASCADE
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS learning_styles (
      id TEXT PRIMARY KEY,
      studentId TEXT NOT NULL,
      visual REAL DEFAULT 0,
      auditory REAL DEFAULT 0,
      kinesthetic REAL DEFAULT 0,
      reading REAL DEFAULT 0,
      notes TEXT,
      assessmentDate TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE CASCADE
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS smart_goals (
      id TEXT PRIMARY KEY,
      studentId TEXT NOT NULL,
      title TEXT NOT NULL,
      specific TEXT NOT NULL,
      measurable TEXT NOT NULL,
      achievable TEXT NOT NULL,
      relevant TEXT NOT NULL,
      timeBound TEXT NOT NULL,
      status TEXT DEFAULT 'active',
      progress REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE CASCADE
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS coaching_recommendations (
      id TEXT PRIMARY KEY,
      studentId TEXT NOT NULL,
      recommendationType TEXT NOT NULL,
      recommendation TEXT NOT NULL,
      priority TEXT DEFAULT 'medium',
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE CASCADE
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS evaluations_360 (
      id TEXT PRIMARY KEY,
      studentId TEXT NOT NULL,
      evaluatorType TEXT NOT NULL,
      evaluatorName TEXT,
      ratings TEXT NOT NULL,
      comments TEXT,
      evaluationDate TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE CASCADE
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS achievements (
      id TEXT PRIMARY KEY,
      studentId TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT,
      date TEXT NOT NULL,
      evidence TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE CASCADE
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS self_assessments (
      id TEXT PRIMARY KEY,
      studentId TEXT NOT NULL,
      assessmentType TEXT NOT NULL,
      scores TEXT NOT NULL,
      reflections TEXT,
      assessmentDate TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE CASCADE
    );
  `);
}
