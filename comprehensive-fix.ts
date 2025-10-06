import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

const students = db.prepare('SELECT id, name FROM students').all() as any[];

function comprehensiveFix(text: string): string {
  let fixed = text;
  
  // Kelime ortasındaki yanlış büyük harfleri düzelt
  fixed = fixed
    // Büyük Ş kelime ortasında -> küçük ş
    .replace(/([a-zığüşöç])Ş([a-zığüşöçıİĞÜŞÖÇ])/g, '$1ş$2')
    // AyŞ -> Ayş
    .replace(/Ay\Şe/g, 'Ayşe')
    // ŞimŞ -> Şimş
    .replace(/Şim\Ş/g, 'Şimş')
    // GüneŞ -> Güneş
    .replace(/Güne\Ş/g, 'Güneş')
    // ÇalıŞ -> Çalış
    .replace(/Çalı\Ş/g, 'Çalış')
    
    // Kelime başındaki yanlış Ç -> Ö dönüşümleri
    .replace(/^Çz/g, 'Öz')
    .replace(/ Çz/g, ' Öz')
    .replace(/^Çm/g, 'Öm')
    .replace(/ Çm/g, ' Öm')
    .replace(/^Çğ/g, 'Öğ')
    .replace(/ Çğ/g, ' Öğ')
    
    // Şz -> Öz (Şztürk -> Öztürk)
    .replace(/Şz/g, 'Öz')
    
    // Çnal -> Ünal
    .replace(/Çnal/g, 'Ünal')
    
    // Diğer yaygın hatalar
    .replace(/Çz/g, 'Öz')
    .replace(/Ş([a-z])/g, 'ş$1')  // Kelime ortasındaki büyük Ş
    
    // Özel durumlar
    .replace(/AyŞe/gi, 'Ayşe')
    .replace(/GüneŞ/gi, 'Güneş')
    .replace(/ŞimŞ/gi, 'Şimş')
    
    // Kelime başlarını düzelt
    .replace(/^ş/g, 'Ş')
    .replace(/ ş/g, ' Ş')
    .replace(/^ö/g, 'Ö')
    .replace(/ ö/g, ' Ö')
    .replace(/^ü/g, 'Ü')
    .replace(/ ü/g, ' Ü')
    .replace(/^ç/g, 'Ç')
    .replace(/ ç/g, ' Ç')
    .replace(/^ı/g, 'I')
    .replace(/ ı/g, ' I')
    .replace(/^ğ/g, 'Ğ')
    .replace(/ ğ/g, ' Ğ');
  
  return fixed;
}

console.log('Applying comprehensive encoding fix...\n');

const updates: { id: string, old: string, new: string }[] = [];

students.forEach((s: any) => {
  const fixed = comprehensiveFix(s.name);
  if (fixed !== s.name) {
    updates.push({ id: s.id, old: s.name, new: fixed });
  }
});

if (updates.length > 0) {
  console.log(`Found ${updates.length} students to fix:\n`);
  updates.forEach(u => {
    console.log(`  ID ${u.id}: "${u.old}" → "${u.new}"`);
  });
  
  console.log(`\nFixing ${updates.length} students...`);
  
  const updateStmt = db.prepare('UPDATE students SET name = ? WHERE id = ?');
  db.exec('BEGIN TRANSACTION');
  try {
    updates.forEach(u => {
      updateStmt.run(u.new, u.id);
    });
    db.exec('COMMIT');
    console.log('\n✅ All students fixed successfully!');
  } catch (err: any) {
    db.exec('ROLLBACK');
    console.error('\n❌ Error:', err.message);
  }
} else {
  console.log('✅ No issues found!');
}

db.close();
