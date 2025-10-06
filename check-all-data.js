import Database from 'better-sqlite3';

const db = new Database('data.db', { readonly: true });

console.log('=== COMPLETE DATABASE CHECK ===\n');

const tables = [
  { name: 'students', label: 'Öğrenciler' },
  { name: 'counseling_sessions', label: 'Görüşmeler' },
  { name: 'meeting_notes', label: 'Görüşme Notları' },
  { name: 'academic_records', label: 'Akademik Kayıtlar' },
  { name: 'progress', label: 'İlerlemeler' },
  { name: 'interventions', label: 'Müdahaleler' },
  { name: 'notes', label: 'Notlar' },
  { name: 'student_documents', label: 'Belgeler' },
  { name: 'attendance', label: 'Devamsızlık' },
  { name: 'survey_responses', label: 'Anket Cevapları' },
  { name: 'study_sessions', label: 'Çalışma Oturumları' },
  { name: 'app_settings', label: 'Ayarlar' },
  { name: 'user_sessions', label: 'Kullanıcı Oturumları' }
];

for (const table of tables) {
  try {
    const result = db.prepare(`SELECT COUNT(*) as count FROM ${table.name}`).get();
    const status = result.count > 0 ? '✅' : '⚠️ ';
    console.log(`${status} ${table.label.padEnd(25)} : ${result.count} kayıt`);
  } catch (error) {
    console.log(`❌ ${table.label.padEnd(25)} : Tablo yok!`);
  }
}

db.close();

console.log('\n=== ÖZET ===');
console.log('⚠️  = Veri yok (kayboluyor olabilir)');
console.log('✅ = Veri var (çalışıyor)');
console.log('❌ = Tablo yok (hata)');
