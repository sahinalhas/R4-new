import type Database from 'better-sqlite3';

export function up(db: Database.Database): void {
  console.log('Adding missing columns to motivation_profiles table...');
  
  try {
    // Add persistenceLevel column if it doesn't exist
    try {
      db.exec(`ALTER TABLE motivation_profiles ADD COLUMN persistenceLevel INTEGER;`);
    } catch (e: any) {
      if (!e.message.includes('duplicate column')) throw e;
    }
    
    // Add futureOrientationLevel column if it doesn't exist
    try {
      db.exec(`ALTER TABLE motivation_profiles ADD COLUMN futureOrientationLevel INTEGER;`);
    } catch (e: any) {
      if (!e.message.includes('duplicate column')) throw e;
    }
    
    // Add shortTermGoals column if it doesn't exist
    try {
      db.exec(`ALTER TABLE motivation_profiles ADD COLUMN shortTermGoals TEXT;`);
    } catch (e: any) {
      if (!e.message.includes('duplicate column')) throw e;
    }
    
    // Add longTermGoals column if it doesn't exist
    try {
      db.exec(`ALTER TABLE motivation_profiles ADD COLUMN longTermGoals TEXT;`);
    } catch (e: any) {
      if (!e.message.includes('duplicate column')) throw e;
    }
    
    // Add obstacles column if it doesn't exist
    try {
      db.exec(`ALTER TABLE motivation_profiles ADD COLUMN obstacles TEXT;`);
    } catch (e: any) {
      if (!e.message.includes('duplicate column')) throw e;
    }
    
    // Add supportNeeds column if it doesn't exist
    try {
      db.exec(`ALTER TABLE motivation_profiles ADD COLUMN supportNeeds TEXT;`);
    } catch (e: any) {
      if (!e.message.includes('duplicate column')) throw e;
    }
    
    console.log('✅ Motivation profile columns updated successfully');
  } catch (error) {
    console.error('Error updating motivation profile columns:', error);
    throw error;
  }
}

export function down(db: Database.Database): void {
  // SQLite doesn't support DROP COLUMN in standard versions
  // Columns added: persistenceLevel, futureOrientationLevel, shortTermGoals, 
  // longTermGoals, obstacles, supportNeeds
  console.log('⚠️ Note: SQLite does not support DROP COLUMN.');
  console.log('⚠️ Added columns remain in table but can be ignored in earlier versions.');
  
  // No actual changes needed - columns are nullable and won't break older code
}
