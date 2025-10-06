import Database from 'better-sqlite3';

const db = new Database('data.db', { readonly: true });

console.log('=== GÖRÜŞMELER DURUMU ===\n');

const total = db.prepare('SELECT COUNT(*) as count FROM counseling_sessions').get();
console.log('Toplam görüşme sayısı:', total.count);

const active = db.prepare('SELECT COUNT(*) as count FROM counseling_sessions WHERE completed = 0').get();
console.log('Aktif görüşme sayısı:', active.count);

const completed = db.prepare('SELECT COUNT(*) as count FROM counseling_sessions WHERE completed = 1').get();
console.log('Tamamlanmış görüşme sayısı:', completed.count);

if (total.count > 0) {
  console.log('\n=== Tüm Görüşmeler ===');
  const sessions = db.prepare(`
    SELECT id, sessionType, topic, completed, created_at 
    FROM counseling_sessions 
    ORDER BY created_at DESC
  `).all();
  
  sessions.forEach((s, i) => {
    console.log(`\n${i + 1}. Görüşme:`);
    console.log(`   ID: ${s.id}`);
    console.log(`   Tip: ${s.sessionType}`);
    console.log(`   Konu: ${s.topic}`);
    console.log(`   Durum: ${s.completed ? 'Tamamlanmış' : 'Aktif'}`);
    console.log(`   Oluşturma: ${s.created_at}`);
  });
}

db.close();
