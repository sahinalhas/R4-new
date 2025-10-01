import {
  loadStudents as dbLoadStudents,
  saveStudents as dbSaveStudents,
  loadSubjects as dbLoadSubjects,
  saveSubjects as dbSaveSubjects,
  loadTopics as dbLoadTopics,
  saveTopics as dbSaveTopics,
  saveProgress as dbSaveProgress,
  saveAcademicGoals as dbSaveAcademicGoals,
  Student,
  Subject,
  Topic,
  Progress,
  AcademicGoal
} from './db-service.js';

// LocalStorage'dan veri yükleyen mock fonksiyonlar
// Gerçek uygulamada bu veriler client tarafından gönderilecek

export function migrateFromLocalStorage(localStorageData: any) {
  console.log('Starting migration from localStorage to SQLite...');
  
  try {
    // Students migration
    if (localStorageData.students && Array.isArray(localStorageData.students)) {
      console.log(`Migrating ${localStorageData.students.length} students...`);
      dbSaveStudents(localStorageData.students);
    }

    // Subjects migration
    if (localStorageData.subjects && Array.isArray(localStorageData.subjects)) {
      console.log(`Migrating ${localStorageData.subjects.length} subjects...`);
      dbSaveSubjects(localStorageData.subjects);
    }

    // Topics migration
    if (localStorageData.topics && Array.isArray(localStorageData.topics)) {
      console.log(`Migrating ${localStorageData.topics.length} topics...`);
      dbSaveTopics(localStorageData.topics);
    }

    // Progress migration
    if (localStorageData.progress && Array.isArray(localStorageData.progress)) {
      console.log(`Migrating ${localStorageData.progress.length} progress records...`);
      dbSaveProgress(localStorageData.progress);
    }

    // Academic goals migration
    if (localStorageData.academicGoals && Array.isArray(localStorageData.academicGoals)) {
      console.log(`Migrating ${localStorageData.academicGoals.length} academic goals...`);
      dbSaveAcademicGoals(localStorageData.academicGoals);
    }

    console.log('Migration completed successfully!');
    return { success: true, message: 'Migration completed successfully' };
  } catch (error) {
    console.error('Migration failed:', error);
    return { success: false, message: 'Migration failed: ' + (error instanceof Error ? error.message : String(error)) };
  }
}

export function getMigrationStatus() {
  // Check if database has any data
  const students = dbLoadStudents();
  const subjects = dbLoadSubjects();
  const topics = dbLoadTopics();
  
  return {
    hasData: students.length > 0 || subjects.length > 0 || topics.length > 0,
    counts: {
      students: students.length,
      subjects: subjects.length,
      topics: topics.length
    }
  };
}