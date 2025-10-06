import Database from 'better-sqlite3';

const db = new Database('data.db', { readonly: true });

console.log('=== STUDENT IDs ===\n');

const students = db.prepare(`
  SELECT id, name, className 
  FROM students 
  ORDER BY id 
  LIMIT 20
`).all();

console.log('First 20 students:');
students.forEach(s => {
  console.log(`  ID: "${s.id}" | Name: ${s.name} | Class: ${s.className}`);
});

console.log('\n=== Checking specific IDs ===');
const check1001 = db.prepare('SELECT * FROM students WHERE id = ?').get('1001');
console.log('Student with ID "1001":', check1001 ? 'FOUND' : 'NOT FOUND');

if (check1001) {
  console.log('  Name:', check1001.name);
  console.log('  Class:', check1001.className);
}

db.close();
