import Database from 'better-sqlite3';
import { randomUUID } from 'crypto';

const db = new Database('data/data.db');

const students = [
  {
    id: randomUUID(),
    name: 'Ahmet Yılmaz',
    email: 'ahmet.yilmaz@okul.edu.tr',
    phone: '555-1234',
    birthDate: '2008-03-15',
    address: 'İstanbul, Türkiye',
    className: '9-A',
    enrollmentDate: '2023-09-01',
    status: 'active',
    gender: 'E',
    parentContact: 'Mehmet Yılmaz - 555-5555'
  },
  {
    id: randomUUID(),
    name: 'Ayşe Kaya',
    email: 'ayse.kaya@okul.edu.tr',
    phone: '555-5678',
    birthDate: '2008-05-20',
    address: 'Ankara, Türkiye',
    className: '9-B',
    enrollmentDate: '2023-09-01',
    status: 'active',
    gender: 'K',
    parentContact: 'Fatma Kaya - 555-6666'
  },
  {
    id: randomUUID(),
    name: 'Mehmet Demir',
    email: 'mehmet.demir@okul.edu.tr',
    phone: '555-9012',
    birthDate: '2007-08-10',
    address: 'İzmir, Türkiye',
    className: '10-A',
    enrollmentDate: '2022-09-01',
    status: 'active',
    gender: 'E',
    parentContact: 'Ali Demir - 555-7777'
  }
];

const insert = db.prepare(`
  INSERT INTO students (id, name, email, phone, birthDate, address, className, enrollmentDate, status, gender, parentContact)
  VALUES (@id, @name, @email, @phone, @birthDate, @address, @className, @enrollmentDate, @status, @gender, @parentContact)
`);

for (const student of students) {
  insert.run(student);
  console.log(`Added student: ${student.name}`);
}

db.close();
console.log('✅ Demo students added successfully!');
