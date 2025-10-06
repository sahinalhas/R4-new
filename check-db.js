import Database from 'better-sqlite3';

const db = new Database('data.db', { readonly: true });

console.log('=== DATABASE CHECK ===\n');

// Check tables
console.log('Tables:');
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").all();
tables.forEach(t => console.log('  -', t.name));

console.log('\n=== COUNSELING SESSIONS ===');
const sessionCount = db.prepare('SELECT COUNT(*) as count FROM counseling_sessions').get();
console.log('Total sessions:', sessionCount.count);

if (sessionCount.count > 0) {
  console.log('\nRecent sessions:');
  const recentSessions = db.prepare(`
    SELECT id, sessionType, sessionDate, topic, completed, created_at 
    FROM counseling_sessions 
    ORDER BY created_at DESC 
    LIMIT 5
  `).all();
  recentSessions.forEach(s => {
    console.log(`  ID: ${s.id}`);
    console.log(`    Type: ${s.sessionType}`);
    console.log(`    Date: ${s.sessionDate}`);
    console.log(`    Topic: ${s.topic}`);
    console.log(`    Completed: ${s.completed}`);
    console.log(`    Created: ${s.created_at}`);
    console.log('');
  });
}

console.log('\n=== STUDENTS ===');
const studentCount = db.prepare('SELECT COUNT(*) as count FROM students').get();
console.log('Total students:', studentCount.count);

console.log('\n=== APP SETTINGS ===');
const settingsCount = db.prepare('SELECT COUNT(*) as count FROM app_settings').get();
console.log('Total settings rows:', settingsCount.count);

db.close();
