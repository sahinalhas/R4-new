import type Database from 'better-sqlite3';

export const migration013 = {
  version: 13,
  name: 'fix_schema_columns_for_coaching_and_special_education',
  up: (db: Database.Database) => {
    const coachingCols = db.prepare('PRAGMA table_info(coaching_recommendations)').all() as { name: string }[];
    const specialEdCols = db.prepare('PRAGMA table_info(special_education)').all() as { name: string }[];

    const hasColumn = (cols: { name: string }[], colName: string) => 
      cols.some((col) => col.name === colName);

    if (!hasColumn(coachingCols, 'type')) {
      db.exec('ALTER TABLE coaching_recommendations ADD COLUMN type TEXT');
      db.exec('UPDATE coaching_recommendations SET type = recommendationType WHERE type IS NULL');
    }
    if (!hasColumn(coachingCols, 'title')) {
      db.exec('ALTER TABLE coaching_recommendations ADD COLUMN title TEXT');
      db.exec('UPDATE coaching_recommendations SET title = recommendation WHERE title IS NULL');
    }
    if (!hasColumn(coachingCols, 'description')) {
      db.exec('ALTER TABLE coaching_recommendations ADD COLUMN description TEXT');
    }
    if (!hasColumn(coachingCols, 'automated')) {
      db.exec('ALTER TABLE coaching_recommendations ADD COLUMN automated BOOLEAN DEFAULT 0');
    }
    if (!hasColumn(coachingCols, 'implementationSteps')) {
      db.exec('ALTER TABLE coaching_recommendations ADD COLUMN implementationSteps TEXT');
    }
    if (!hasColumn(coachingCols, 'createdAt')) {
      db.exec('ALTER TABLE coaching_recommendations ADD COLUMN createdAt DATETIME');
      db.exec('UPDATE coaching_recommendations SET createdAt = created_at WHERE createdAt IS NULL');
    }

    if (!hasColumn(specialEdCols, 'iepStartDate')) {
      db.exec('ALTER TABLE special_education ADD COLUMN iepStartDate TEXT');
    }
    if (!hasColumn(specialEdCols, 'iepEndDate')) {
      db.exec('ALTER TABLE special_education ADD COLUMN iepEndDate TEXT');
    }
    if (!hasColumn(specialEdCols, 'iepGoals')) {
      db.exec('ALTER TABLE special_education ADD COLUMN iepGoals TEXT');
      db.exec('UPDATE special_education SET iepGoals = iepDetails WHERE iepGoals IS NULL');
    }
    if (!hasColumn(specialEdCols, 'diagnosis')) {
      db.exec('ALTER TABLE special_education ADD COLUMN diagnosis TEXT');
      db.exec('UPDATE special_education SET diagnosis = learningDisabilities WHERE diagnosis IS NULL');
    }
    if (!hasColumn(specialEdCols, 'ramReportDate')) {
      db.exec('ALTER TABLE special_education ADD COLUMN ramReportDate TEXT');
    }
    if (!hasColumn(specialEdCols, 'ramReportSummary')) {
      db.exec('ALTER TABLE special_education ADD COLUMN ramReportSummary TEXT');
    }
    if (!hasColumn(specialEdCols, 'modifications')) {
      db.exec('ALTER TABLE special_education ADD COLUMN modifications TEXT');
    }
    if (!hasColumn(specialEdCols, 'evaluationSchedule')) {
      db.exec('ALTER TABLE special_education ADD COLUMN evaluationSchedule TEXT');
    }
    if (!hasColumn(specialEdCols, 'specialistContacts')) {
      db.exec('ALTER TABLE special_education ADD COLUMN specialistContacts TEXT');
    }
    if (!hasColumn(specialEdCols, 'parentInvolvement')) {
      db.exec('ALTER TABLE special_education ADD COLUMN parentInvolvement TEXT');
    }
    if (!hasColumn(specialEdCols, 'transitionPlan')) {
      db.exec('ALTER TABLE special_education ADD COLUMN transitionPlan TEXT');
    }
    if (!hasColumn(specialEdCols, 'assistiveTechnology')) {
      db.exec('ALTER TABLE special_education ADD COLUMN assistiveTechnology TEXT');
    }
    if (!hasColumn(specialEdCols, 'behavioralSupport')) {
      db.exec('ALTER TABLE special_education ADD COLUMN behavioralSupport TEXT');
    }
    if (!hasColumn(specialEdCols, 'status')) {
      db.exec('ALTER TABLE special_education ADD COLUMN status TEXT DEFAULT "AKTİF"');
    }
    if (!hasColumn(specialEdCols, 'nextReviewDate')) {
      db.exec('ALTER TABLE special_education ADD COLUMN nextReviewDate TEXT');
      db.exec('UPDATE special_education SET nextReviewDate = reviewDate WHERE nextReviewDate IS NULL');
    }
    if (!hasColumn(specialEdCols, 'notes')) {
      db.exec('ALTER TABLE special_education ADD COLUMN notes TEXT');
    }
  }
};
